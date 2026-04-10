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

const NODE_BASE_RADIUS = 8
const ARROWHEAD_ID = 'okve-arrowhead-arc'

function getNodeRadius(node: GraphNode) {
  return NODE_BASE_RADIUS * (node.size ?? 1)
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

function sortNodesByDegree(data: GraphData): GraphNode[] {
  const degree = new Map<string, number>()
  for (const node of data.nodes) {
    degree.set(node.id, 0)
  }
  for (const edge of data.edges) {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1)
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1)
  }
  return [...data.nodes].sort((a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0))
}

function assignPositions(nodes: GraphNode[], width: number, padding: number): Map<string, number> {
  const positions = new Map<string, number>()
  const step = (width - padding * 2) / Math.max(nodes.length - 1, 1)
  nodes.forEach((node, i) => {
    positions.set(node.id, padding + i * step)
  })
  return positions
}

function arcPath(x1: number, x2: number, baseline: number): string {
  const radius = Math.abs(x2 - x1) / 2
  return `M ${x1} ${baseline} A ${radius} ${radius} 0 0 1 ${x2} ${baseline}`
}

function joinClassNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

export function ArcLayout({
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
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity)

  useZoomPan(svgRef || containerRef, contentRef, transformRef)

  const padding = 60
  const baseline = height * 0.65

  const sortedNodes = useMemo(() => sortNodesByDegree(data), [data])

  const positions = useMemo(() => assignPositions(sortedNodes, width, padding), [sortedNodes, width])

  const nodesById = useMemo(() => new Map(data.nodes.map((node) => [node.id, node] as const)), [
    data.nodes,
  ])
  const edgesById = useMemo(() => new Map(data.edges.map((edge) => [edge.id, edge] as const)), [
    data.edges,
  ])

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
        aria-label="Arc diagram"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setTooltip((previous) => (previous?.pinned ? null : previous))
          }
        }}
      >
        <defs>
          <marker
            id={ARROWHEAD_ID}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="rgba(255,255,255,0.6)" />
          </marker>
        </defs>

        <g ref={contentRef} className="okve-graph__content">
          {/* Baseline */}
          <line
            x1={padding}
            y1={baseline}
            x2={width - padding}
            y2={baseline}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />

        {/* Arcs (edges) — render behind nodes */}
        {data.edges.map((edge) => {
          const x1 = positions.get(edge.source) ?? 0
          const x2 = positions.get(edge.target) ?? 0
          const isHighlighted = hoveredNodeId ? highlightState.highlightedEdgeIds.has(edge.id) : true
          const isDimmed = hoveredNodeId ? !isHighlighted : false

          return (
            <path
              key={edge.id}
              d={arcPath(x1, x2, baseline)}
              className={joinClassNames(
                'okve-edge',
                isHighlighted && 'okve-edge--highlighted',
                isDimmed && 'okve-edge--dimmed',
              )}
              fill="none"
              stroke={getGroupColor(nodesById.get(edge.source)?.group ?? 'ungrouped')}
              strokeWidth={edge.weight ? 1 + edge.weight * 0.5 : 1.5}
              markerEnd={edge.directed ? `url(#${ARROWHEAD_ID})` : undefined}
              onMouseEnter={() => {
                if (showTooltips && tooltipOptions?.edgeFields) {
                  const edgeData = edgesById.get(edge.id)
                  if (edgeData) {
                    const position = getTooltipPosition(
                      (x1 + x2) / 2,
                      baseline - 25,
                      transformRef.current,
                      width,
                      height,
                    )
                    setTooltip({
                      type: 'edge',
                      data: edgeData,
                      x: position.x,
                      y: position.y,
                      pinned: false,
                    })
                  }
                }
              }}
              onMouseLeave={() => {
                if (!tooltip?.pinned) {
                  setTooltip(null)
                }
              }}
              onClick={() => {
                onEdgeClick?.(edge)
                if (showTooltips && tooltipOptions?.edgeFields) {
                  const edgeData = edgesById.get(edge.id)
                  if (edgeData) {
                    const position = getTooltipPosition(
                      (x1 + x2) / 2,
                      baseline - 25,
                      transformRef.current,
                      width,
                      height,
                    )
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
                }
              }}
              style={{ cursor: 'pointer' }}
            />
          )
        })}

        {/* Nodes */}
        {sortedNodes.map((node) => {
          const x = positions.get(node.id) ?? 0
          const isSelected = selectedNodeId === node.id
          const isHovered = hoveredNodeId === node.id
          const isDimmed = hoveredNodeId ? !highlightState.highlightedNodeIds.has(node.id) : false
          const radius = getNodeRadius(node)

          return (
            <g
              key={node.id}
              transform={`translate(${x}, ${baseline})`}
              onMouseEnter={() => {
                onNodeHover?.(node.id)
                if (showTooltips && tooltipOptions?.nodeFields) {
                  const position = getTooltipPosition(
                    x,
                    baseline,
                    transformRef.current,
                    width,
                    height,
                  )
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
                  const position = getTooltipPosition(
                    x,
                    baseline,
                    transformRef.current,
                    width,
                    height,
                  )
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
                r={radius}
                className={joinClassNames(
                  'okve-node',
                  isHovered && 'okve-node--hovered',
                  isSelected && 'okve-node--selected',
                  isDimmed && 'okve-node--dimmed',
                )}
                fill={getGroupColor(node.group)}
              />
              {/* Labels rotate -45deg to avoid overlap */}
              <text
                className={joinClassNames(
                  'okve-label',
                  isHovered && 'okve-label--hovered',
                  isDimmed && 'okve-label--dimmed',
                )}
                transform="rotate(-45)"
                textAnchor="end"
                dx={-(radius + 6)}
                dy="0.31em"
                fontSize={11}
              >
                {node.label}
              </text>
            </g>
          )
        })}
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
