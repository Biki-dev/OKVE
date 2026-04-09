import { useEffect, useMemo, useRef, useState } from 'react'
import type { MutableRefObject, RefObject } from 'react'
import * as d3 from 'd3'

import type { GraphData, GraphEdge, GraphNode } from '../types'
import { getGroupColor } from '../utils/colorPalette'
import { buildHighlightState, seedNodePositions } from '../utils/graphLayout'
import { Tooltip } from '../components/KnowledgeGraph/Tooltip'
import type { InternalLayoutProps } from './types'

type LayoutNode = GraphNode & d3.SimulationNodeDatum
type LayoutEdge = Omit<GraphEdge, 'source' | 'target'> &
  d3.SimulationLinkDatum<LayoutNode> & {
    source: string | LayoutNode
    target: string | LayoutNode
  }

type TooltipState = {
  type: 'node' | 'edge'
  data: GraphNode | GraphEdge
  x: number
  y: number
  pinned: boolean
}

const NODE_BASE_RADIUS = 8
const ARROWHEAD_ID = 'okve-arrowhead'

function getTooltipPosition(
  nodeX: number,
  nodeY: number,
  transform: d3.ZoomTransform,
  containerWidth: number,
  containerHeight: number,
): { x: number; y: number } {
  const screenX = transform.applyX(nodeX)
  const screenY = transform.applyY(nodeY)
  const tooltipW = 220
  const tooltipH = 140

  return {
    x: Math.max(8, Math.min(screenX + 16, containerWidth - tooltipW - 8)),
    y: Math.max(8, Math.min(screenY - 20, containerHeight - tooltipH - 8)),
  }
}

function getNodeRadius(node: GraphNode) {
  return NODE_BASE_RADIUS * (node.size ?? 1)
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

function fitToScreen(
  svg: SVGSVGElement,
  zoom: d3.ZoomBehavior<SVGSVGElement, unknown>,
  nodes: LayoutNode[],
  width: number,
  height: number,
) {
  if (nodes.length === 0) {
    return
  }

  const xs = nodes.map((node) => node.x ?? 0)
  const ys = nodes.map((node) => node.y ?? 0)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  const padding = 60
  const scaleX = (width - padding * 2) / (maxX - minX || 1)
  const scaleY = (height - padding * 2) / (maxY - minY || 1)
  const scale = Math.min(scaleX, scaleY, 2)

  const tx = width / 2 - ((minX + maxX) / 2) * scale
  const ty = height / 2 - ((minY + maxY) / 2) * scale

  d3.select(svg).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale))
}

function useGraphSimulation(data: GraphData, width: number, height: number) {
  const [layout, setLayout] = useState<{ nodes: LayoutNode[]; edges: LayoutEdge[] }>({
    nodes: [],
    edges: [],
  })
  const [isSimulationSettled, setIsSimulationSettled] = useState(false)

  useEffect(() => {
    setIsSimulationSettled(false)

    if (data.nodes.length === 0) {
      setLayout({ nodes: [], edges: [] })
      setIsSimulationSettled(true)
      return
    }

    const nodes = seedNodePositions(data.nodes, width, height).map((node) => ({ ...node }))
    const edges = data.edges.map((edge) => ({ ...edge })) as LayoutEdge[]

    const simulation = d3
      .forceSimulation<LayoutNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<LayoutNode, LayoutEdge>(edges)
          .id((node) => node.id)
          .distance((edge) => (edge.weight ? Math.max(100, 180 - edge.weight * 16) : 170))
          .strength(0.2),
      )
      .force('charge', d3.forceManyBody().strength(-360))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((node) => getNodeRadius(node as GraphNode) * 2.2))

    const updateLayout = () => {
      setLayout({
        nodes: nodes.map((node) => ({ ...node })),
        edges: edges.map((edge) => ({ ...edge })),
      })
    }

    simulation.on('tick', updateLayout)
    simulation.on('end', () => {
      updateLayout()
      setIsSimulationSettled(true)
    })
    updateLayout()

    return () => {
      simulation.stop()
    }
  }, [data, height, width])

  return { layout, isSimulationSettled }
}

function joinClassNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

export function ForceLayout({
  data,
  width,
  height,
  hoveredNodeId,
  selectedNodeId,
  focusNodeId,
  onNodeClick,
  onEdgeClick,
  onNodeHover,
  showTooltips = false,
  tooltipOptions,
  svgRef,
  interactionResetKey,
}: InternalLayoutProps) {
  const contentRef = useRef<SVGGElement | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const hasFitToScreenRef = useRef(false)
  const lastAnimatedFocusNodeIdRef = useRef<string | null>(null)
  const zoomTransformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity)

  const zoomBehaviorRef = useZoomPan(svgRef, contentRef, zoomTransformRef)
  const { layout, isSimulationSettled } = useGraphSimulation(data, width, height)
  const highlightState = useMemo(() => buildHighlightState(data, hoveredNodeId), [data, hoveredNodeId])

  const nodesById = useMemo(() => new Map(data.nodes.map((node) => [node.id, node] as const)), [data.nodes])
  const edgesById = useMemo(() => new Map(data.edges.map((edge) => [edge.id, edge] as const)), [data.edges])

  useEffect(() => {
    if (!isSimulationSettled) {
      hasFitToScreenRef.current = false
      return
    }

    if (hasFitToScreenRef.current) {
      return
    }

    const svgElement = svgRef.current
    const zoomBehavior = zoomBehaviorRef.current

    if (!svgElement || !zoomBehavior || layout.nodes.length === 0) {
      return
    }

    fitToScreen(svgElement, zoomBehavior, layout.nodes, width, height)
    hasFitToScreenRef.current = true
  }, [height, isSimulationSettled, layout.nodes, svgRef, width, zoomBehaviorRef])

  useEffect(() => {
    if (!showTooltips) {
      setTooltip(null)
    }
  }, [showTooltips])

  useEffect(() => {
    if (interactionResetKey == null) {
      return
    }

    setTooltip(null)
    lastAnimatedFocusNodeIdRef.current = null
  }, [interactionResetKey])

  useEffect(() => {
    const svgElement = svgRef.current
    const zoomBehavior = zoomBehaviorRef.current

    if (!focusNodeId || !svgElement || !zoomBehavior) {
      if (!focusNodeId) {
        lastAnimatedFocusNodeIdRef.current = null
      }

      return
    }

    const node = layout.nodes.find((layoutNode) => layoutNode.id === focusNodeId)

    if (!node || node.x == null || node.y == null) {
      return
    }

    if (lastAnimatedFocusNodeIdRef.current === focusNodeId) {
      return
    }

    const svg = d3.select(svgElement)
    const scale = 1.8

    svg
      .transition()
      .duration(600)
      .ease(d3.easeCubicInOut)
      .call(
        zoomBehavior.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scale)
          .translate(-node.x, -node.y),
      )

    lastAnimatedFocusNodeIdRef.current = focusNodeId
  }, [focusNodeId, height, layout.nodes, svgRef, width, zoomBehaviorRef])

  return (
    <>
      <svg
        ref={svgRef}
        className="okve-graph__svg"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Interactive knowledge graph"
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
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <g ref={contentRef} className="okve-graph__content">
          {layout.edges.map((edge) => {
            const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id
            const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id
            const sourceNode = layout.nodes.find((node) => node.id === sourceId)
            const targetNode = layout.nodes.find((node) => node.id === targetId)
            const edgeData = edgesById.get(edge.id) ?? (edge as GraphEdge)

            if (!sourceNode || !targetNode) {
              return null
            }

            const isHighlighted = hoveredNodeId ? highlightState.highlightedEdgeIds.has(edge.id) : true
            const isDimmed = hoveredNodeId ? !isHighlighted : false

            return (
              <g key={edge.id}>
                <line
                  x1={sourceNode.x ?? 0}
                  y1={sourceNode.y ?? 0}
                  x2={targetNode.x ?? 0}
                  y2={targetNode.y ?? 0}
                  stroke="transparent"
                  strokeWidth={12}
                  onClick={(event) => {
                    event.stopPropagation()

                    if (showTooltips) {
                      const position = getTooltipPosition(
                        ((sourceNode.x ?? 0) + (targetNode.x ?? 0)) / 2,
                        ((sourceNode.y ?? 0) + (targetNode.y ?? 0)) / 2,
                        zoomTransformRef.current,
                        width,
                        height,
                      )

                      setTooltip({
                        type: 'edge',
                        data: edgeData,
                        x: position.x,
                        y: position.y,
                        pinned: true,
                      })
                    }

                    onEdgeClick?.(edgeData)
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <line
                  className={joinClassNames(
                    'okve-edge',
                    isHighlighted && 'okve-edge--highlighted',
                    isDimmed && 'okve-edge--dimmed',
                  )}
                  x1={sourceNode.x ?? 0}
                  y1={sourceNode.y ?? 0}
                  x2={targetNode.x ?? 0}
                  y2={targetNode.y ?? 0}
                  strokeWidth={edge.weight ? 1.5 + Math.min(edge.weight, 4) * 0.75 : 1.5}
                  markerEnd={edge.directed ? `url(#${ARROWHEAD_ID})` : undefined}
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            )
          })}

          {layout.edges.map((edge) => {
            if (!edge.label) {
              return null
            }

            const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id
            const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id
            const sourceNode = layout.nodes.find((node) => node.id === sourceId)
            const targetNode = layout.nodes.find((node) => node.id === targetId)

            if (!sourceNode || !targetNode) {
              return null
            }

            return (
              <text
                key={`label-${edge.id}`}
                x={(sourceNode.x ?? 0) + ((targetNode.x ?? 0) - (sourceNode.x ?? 0)) / 2}
                y={(sourceNode.y ?? 0) + ((targetNode.y ?? 0) - (sourceNode.y ?? 0)) / 2}
                className="okve-edge-label"
                textAnchor="middle"
                dy="-4"
              >
                {edge.label}
              </text>
            )
          })}

          {layout.nodes.map((node) => {
            const sourceNode = nodesById.get(node.id) ?? node
            const isHighlighted = hoveredNodeId ? highlightState.highlightedNodeIds.has(node.id) : true
            const isDimmed = hoveredNodeId ? !isHighlighted : false
            const radius = getNodeRadius(sourceNode)
            const isSelected = selectedNodeId === node.id

            return (
              <g
                key={node.id}
                className={joinClassNames('okve-node-group', isDimmed && 'okve-node-group--dimmed')}
                transform={`translate(${node.x ?? 0}, ${node.y ?? 0})`}
                onMouseEnter={() => {
                  onNodeHover?.(node.id)

                  if (!showTooltips) {
                    return
                  }

                  const position = getTooltipPosition(
                    node.x ?? 0,
                    node.y ?? 0,
                    zoomTransformRef.current,
                    width,
                    height,
                  )

                  setTooltip((previous) => {
                    if (previous?.pinned) {
                      return previous
                    }

                    return {
                      type: 'node',
                      data: sourceNode,
                      x: position.x,
                      y: position.y,
                      pinned: false,
                    }
                  })
                }}
                onMouseLeave={() => {
                  onNodeHover?.(null)

                  if (!showTooltips) {
                    return
                  }

                  setTooltip((previous) => {
                    if (previous?.pinned) {
                      return previous
                    }

                    return null
                  })
                }}
                onClick={(event) => {
                  event.stopPropagation()

                  if (showTooltips) {
                    setTooltip((previous) => {
                      if (
                        previous?.pinned &&
                        previous.type === 'node' &&
                        (previous.data as GraphNode).id === sourceNode.id
                      ) {
                        return null
                      }

                      const position = getTooltipPosition(
                        node.x ?? 0,
                        node.y ?? 0,
                        zoomTransformRef.current,
                        width,
                        height,
                      )

                      return {
                        type: 'node',
                        data: sourceNode,
                        x: position.x,
                        y: position.y,
                        pinned: true,
                      }
                    })
                  }

                  onNodeClick?.(sourceNode)
                }}
              >
                <circle
                  r={radius}
                  className={joinClassNames(
                    'okve-node',
                    hoveredNodeId === node.id && 'okve-node--hovered',
                    isSelected && 'okve-node--selected',
                    isDimmed && 'okve-node--dimmed',
                  )}
                  fill={getGroupColor(sourceNode.group)}
                />
                <text
                  className={joinClassNames(
                    'okve-label',
                    hoveredNodeId === node.id && 'okve-label--hovered',
                    isDimmed && 'okve-label--dimmed',
                  )}
                  x={radius + 10}
                  y={0}
                  dominantBaseline="middle"
                >
                  {sourceNode.label}
                </text>
                <title>{sourceNode.label}</title>
              </g>
            )
          })}
        </g>
      </svg>
      {showTooltips && tooltip && (
        <Tooltip
          type={tooltip.type}
          data={tooltip.data}
          x={tooltip.x}
          y={tooltip.y}
          pinned={tooltip.pinned}
          options={tooltipOptions}
          onClose={() => {
            setTooltip(null)
          }}
        />
      )}
    </>
  )
}
