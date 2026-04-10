import { useEffect, useMemo, useRef, useState } from 'react'
import type { MutableRefObject, RefObject } from 'react'
import * as d3 from 'd3'

import type { GraphData, GraphEdge, GraphNode } from '../types'
import { getGroupColor } from '../utils/colorPalette'
import { buildHighlightState } from '../utils/graphLayout'
import { Tooltip } from '../components/KnowledgeGraph/Tooltip'
import type { InternalLayoutProps } from './types'

type TooltipState = {
  type: 'node' | 'edge'
  data: GraphNode | GraphEdge
  x: number
  y: number
  pinned: boolean
}

function useZoomPan(
  svgRef: RefObject<SVGSVGElement | null>,
  contentRef: RefObject<SVGGElement | null>,
  transformRef: MutableRefObject<d3.ZoomTransform>,
) {
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)

  useEffect(() => {
    const svgElement = svgRef.current
    const contentElement = contentRef.current

    if (!svgElement || !contentElement) {
      return
    }

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        transformRef.current = event.transform
        d3.select(contentElement).attr('transform', event.transform.toString())
      })

    zoomBehaviorRef.current = zoomBehavior
    transformRef.current = d3.zoomIdentity
    const selection = d3.select(svgElement)
    selection.call(zoomBehavior)

    return () => {
      selection.on('.zoom', null)
      zoomBehaviorRef.current = null
      transformRef.current = d3.zoomIdentity
    }
  }, [contentRef, svgRef, transformRef])

  return zoomBehaviorRef
}

function buildChordMatrix(data: GraphData): { groups: string[]; matrix: number[][] } {
  const groupSet = new Set<string>()
  for (const node of data.nodes) {
    groupSet.add(node.group ?? 'ungrouped')
  }
  const groups = Array.from(groupSet).sort()
  const groupIndex = new Map(groups.map((g, i) => [g, i]))

  const nodeGroup = new Map<string, string>()
  for (const node of data.nodes) {
    nodeGroup.set(node.id, node.group ?? 'ungrouped')
  }

  const n = groups.length
  const matrix = Array.from({ length: n }, () => Array(n).fill(0))

  for (const edge of data.edges) {
    const sg = nodeGroup.get(edge.source)
    const tg = nodeGroup.get(edge.target)
    if (!sg || !tg) continue

    const si = groupIndex.get(sg)!
    const ti = groupIndex.get(tg)!
    matrix[si][ti] += edge.weight ?? 1
    if (!edge.directed) matrix[ti][si] += edge.weight ?? 1
  }

  return { groups, matrix }
}

function joinClassNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

function getTooltipPosition(
  x: number,
  y: number,
  transform: d3.ZoomTransform,
  width: number,
  height: number,
): { x: number; y: number } {
  const screenX = transform.applyX(x)
  const screenY = transform.applyY(y)
  const tooltipW = 220
  const tooltipH = 140

  return {
    x: Math.max(8, Math.min(screenX + 16, width - tooltipW - 8)),
    y: Math.max(8, Math.min(screenY - 20, height - tooltipH - 8)),
  }
}

export function ChordLayout({
  data,
  width,
  height,
  hoveredNodeId,
  selectedNodeId,
  onNodeClick,
  onEdgeClick,
  onNodeHover,
  showTooltips = false,
  tooltipOptions,
  svgRef,
}: InternalLayoutProps) {
  const contentRef = useRef<SVGGElement | null>(null)
  const containerRef = useRef<SVGSVGElement | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity)

  useZoomPan(svgRef || containerRef, contentRef, transformRef)

  const { groups, matrix } = useMemo(() => buildChordMatrix(data), [data])

  const chord = useMemo(
    () => d3.chord().padAngle(0.05).sortSubgroups(d3.descending)(matrix),
    [matrix],
  )

  const radius = Math.min(width, height) / 2 - 80
  const innerRadius = radius - 28
  const outerRadius = radius - 8

  const arc = d3.arc<d3.ChordGroup>().innerRadius(innerRadius).outerRadius(outerRadius)

  const ribbon = d3.ribbon<d3.Chord, d3.ChordSubgroup>().radius(innerRadius)

  const highlightState = useMemo(() => buildHighlightState(data, hoveredNodeId), [data, hoveredNodeId])

  return (
    <>
      <svg
        ref={svgRef || containerRef}
        className="okve-graph__svg"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Chord diagram"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setTooltip((previous) => (previous?.pinned ? null : previous))
          }
        }}
      >
        <g ref={contentRef} className="okve-graph__content">
          <g transform={`translate(${width / 2}, ${height / 2})`}>
          {/* Group arcs (outer ring segments) */}
          {chord.groups.map((group, i) => {
            const groupName = groups[i]
            const isHovered = hoveredGroup === groupName
            const isDimmed = hoveredGroup ? hoveredGroup !== groupName : false

            return (
              <g key={groupName}>
                <path
                  d={arc(group) ?? ''}
                  fill={getGroupColor(groupName)}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth={1}
                  className={joinClassNames(
                    'okve-chord-arc',
                    isHovered && 'okve-chord-arc--hovered',
                    isDimmed && 'okve-chord-arc--dimmed',
                  )}
                  onMouseEnter={() => setHoveredGroup(groupName)}
                  onMouseLeave={() => setHoveredGroup(null)}
                />
                {/* Group label */}
                <text
                  className="okve-label"
                  transform={`
                    rotate(${((group.startAngle + group.endAngle) / 2 * 180) / Math.PI - 90})
                    translate(${outerRadius + 12})
                    ${(group.startAngle + group.endAngle) / 2 > Math.PI ? 'rotate(180)' : ''}
                  `}
                  textAnchor={(group.startAngle + group.endAngle) / 2 > Math.PI ? 'end' : 'start'}
                  dominantBaseline="middle"
                  fontSize={11}
                >
                  {groupName}
                </text>
              </g>
            )
          })}

          {/* Chords (ribbons between groups) */}
          {chord.map((chordItem, i) => {
            const sourceGroup = groups[chordItem.source.index]
            const targetGroup = groups[chordItem.target.index]
            const isHighlighted = !hoveredGroup || sourceGroup === hoveredGroup || targetGroup === hoveredGroup

            return (
              <path
                key={i}
                d={ribbon(chordItem) ?? ''}
                fill={getGroupColor(sourceGroup)}
                fillOpacity={isHighlighted ? 0.65 : 0.08}
                stroke={getGroupColor(sourceGroup)}
                strokeOpacity={isHighlighted ? 0.8 : 0.1}
                strokeWidth={0.5}
                className="okve-chord-ribbon"
                  onClick={() => {
                    const edgeData: GraphEdge = {
                      id: `chord-${i}`,
                      source: sourceGroup,
                      target: targetGroup,
                      weight: chordItem.source.value,
                      directed: false,
                      label: `${sourceGroup} -> ${targetGroup}`,
                    }
                    onEdgeClick?.(edgeData)

                    if (showTooltips && tooltipOptions?.edgeFields) {
                      const midAngle = (chordItem.source.startAngle + chordItem.source.endAngle) / 2
                      const tx = width / 2 + innerRadius * Math.cos(midAngle - Math.PI / 2)
                      const ty = height / 2 + innerRadius * Math.sin(midAngle - Math.PI / 2)
                      const position = getTooltipPosition(tx, ty, transformRef.current, width, height)
                      setTooltip((prev) =>
                        prev?.pinned
                          ? null
                          : {
                              type: 'edge',
                              data: edgeData,
                              x: position.x,
                              y: position.y,
                              pinned: true,
                            },
                      )
                    }
                  }}
              />
            )
          })}

          {/* Nodes positioned on arc segments */}
          {data.nodes.map((node) => {
            const groupName = node.group ?? 'ungrouped'
            const groupIndex = groups.indexOf(groupName)

            if (groupIndex === -1) return null

            const group = chord.groups[groupIndex]
            const groupAngle = (group.startAngle + group.endAngle) / 2
            const nodeRadius = 8 * (node.size ?? 1)
            const distance = radius + 20

            const x = distance * Math.cos(groupAngle - Math.PI / 2)
            const y = distance * Math.sin(groupAngle - Math.PI / 2)

            const isSelected = selectedNodeId === node.id
            const isHovered = hoveredNodeId === node.id
            const isDimmed = hoveredNodeId ? !highlightState.highlightedNodeIds.has(node.id) : false

            return (
              <g
                key={node.id}
                transform={`translate(${x}, ${y})`}
                onMouseEnter={() => {
                  onNodeHover?.(node.id)
                  if (showTooltips && tooltipOptions?.nodeFields) {
                    const tx = width / 2 + x
                    const ty = height / 2 + y
                    const position = getTooltipPosition(tx, ty, transformRef.current, width, height)
                    setTooltip({
                      type: 'node',
                      data: node,
                      x: position.x,
                      y: position.y,
                      pinned: false,
                    })
                  }
                }}
                onMouseLeave={() => {
                  onNodeHover?.(null)
                  if (!tooltip?.pinned) {
                    setTooltip(null)
                  }
                }}
                onClick={() => {
                  onNodeClick?.(node)
                  if (showTooltips && tooltipOptions?.nodeFields) {
                    const tx = width / 2 + x
                    const ty = height / 2 + y
                    const position = getTooltipPosition(tx, ty, transformRef.current, width, height)
                    setTooltip((prev) =>
                      prev?.pinned
                        ? null
                        : {
                            type: 'node',
                            data: node,
                            x: position.x,
                            y: position.y,
                            pinned: true,
                          },
                    )
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  r={nodeRadius}
                  className={joinClassNames(
                    'okve-node',
                    isHovered && 'okve-node--hovered',
                    isSelected && 'okve-node--selected',
                    isDimmed && 'okve-node--dimmed',
                  )}
                  fill={getGroupColor(node.group)}
                />
                <text
                  className={joinClassNames(
                    'okve-label',
                    isHovered && 'okve-label--hovered',
                    isDimmed && 'okve-label--dimmed',
                  )}
                  textAnchor="middle"
                  dy="0.31em"
                  fontSize={10}
                >
                  {node.label}
                </text>
              </g>
            )
          })}
          </g>
        </g>
      </svg>

      {tooltip && (
        <Tooltip
          type={tooltip.type}
          data={tooltip.data}
          x={tooltip.x}
          y={tooltip.y}
          pinned={tooltip.pinned}
          options={tooltipOptions}
          onClose={() => setTooltip(null)}
        />
      )}
    </>
  )
}
