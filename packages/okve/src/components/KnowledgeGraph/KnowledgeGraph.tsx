import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

import type { GraphEdge, GraphNode, KnowledgeGraphProps } from '../../types'
import { buildHighlightState, seedNodePositions } from '../../utils/graphLayout'
import { getGroupColor } from '../../utils/colorPalette'
import './KnowledgeGraph.css'

type LayoutNode = GraphNode & d3.SimulationNodeDatum
type LayoutEdge = Omit<GraphEdge, 'source' | 'target'> &
  d3.SimulationLinkDatum<LayoutNode> & {
    source: string | LayoutNode
    target: string | LayoutNode
  }

const DEFAULT_WIDTH = 960
const DEFAULT_HEIGHT = 640
const NODE_BASE_RADIUS = 8
const ARROWHEAD_ID = 'okve-arrowhead'

function getNodeRadius(node: GraphNode) {
  return NODE_BASE_RADIUS * (node.size ?? 1)
}

function useElementSize(elementRef: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  })

  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return
    }

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect()

      setSize({
        width: width || DEFAULT_WIDTH,
        height: height || DEFAULT_HEIGHT,
      })
    }

    updateSize()

    const resizeObserver = new ResizeObserver(() => {
      updateSize()
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [elementRef])

  return size
}

function useZoomPan(
  svgRef: React.RefObject<SVGSVGElement | null>,
  contentRef: React.RefObject<SVGGElement | null>,
) {
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
        d3.select(contentElement).attr('transform', event.transform.toString())
      })

    const selection = d3.select(svgElement)
    selection.call(zoomBehavior)

    return () => {
      selection.on('.zoom', null)
    }
  }, [contentRef, svgRef])
}

function useGraphSimulation(data: KnowledgeGraphProps['data'], width: number, height: number) {
  const [layout, setLayout] = useState<{ nodes: LayoutNode[]; edges: LayoutEdge[] }>({
    nodes: [],
    edges: [],
  })

  useEffect(() => {
    if (data.nodes.length === 0) {
      setLayout({ nodes: [], edges: [] })
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
    updateLayout()

    return () => {
      simulation.stop()
    }
  }, [data, height, width])

  return layout
}

function joinClassNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

export function KnowledgeGraph({
  data,
  width = '100%',
  height = 640,
  onNodeClick,
  onEdgeClick,
}: KnowledgeGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const contentRef = useRef<SVGGElement | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  const { width: renderedWidth, height: renderedHeight } = useElementSize(containerRef)
  const layout = useGraphSimulation(data, renderedWidth, renderedHeight)
  const highlightState = useMemo(
    () => buildHighlightState(data, hoveredNodeId),
    [data, hoveredNodeId],
  )

  const nodesById = useMemo(
    () => new Map(data.nodes.map((node) => [node.id, node] as const)),
    [data.nodes],
  )

  const edgesById = useMemo(
    () => new Map(data.edges.map((edge) => [edge.id, edge] as const)),
    [data.edges],
  )

  useZoomPan(svgRef, contentRef)

  return (
    <div
      ref={containerRef}
      className="okve-graph"
      style={{
        width,
        height,
      }}
    >
      <svg
        ref={svgRef}
        className="okve-graph__svg"
        width="100%"
        height="100%"
        viewBox={`0 0 ${renderedWidth} ${renderedHeight}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Interactive knowledge graph"
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
                  onClick={() => {
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
                  onClick={() => {
                    onEdgeClick?.(edgeData)
                  }}
                  style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                />
              </g>
            )
          })}

          {layout.nodes.map((node) => {
            const sourceNode = nodesById.get(node.id) ?? node
            const isHighlighted = hoveredNodeId ? highlightState.highlightedNodeIds.has(node.id) : true
            const isDimmed = hoveredNodeId ? !isHighlighted : false
            const radius = getNodeRadius(sourceNode)

            return (
              <g
                key={node.id}
                className={joinClassNames('okve-node-group', isDimmed && 'okve-node-group--dimmed')}
                transform={`translate(${node.x ?? 0}, ${node.y ?? 0})`}
                onMouseEnter={() => {
                  setHoveredNodeId(node.id)
                }}
                onMouseLeave={() => {
                  setHoveredNodeId(null)
                }}
                onClick={() => {
                  onNodeClick?.(sourceNode)
                }}
              >
                <circle
                  r={radius}
                  className={joinClassNames(
                    'okve-node',
                    hoveredNodeId === node.id && 'okve-node--hovered',
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
    </div>
  )
}