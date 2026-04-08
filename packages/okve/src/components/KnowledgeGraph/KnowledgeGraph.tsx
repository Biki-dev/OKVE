import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

import type { GraphEdge, GraphNode, KnowledgeGraphHandle, KnowledgeGraphProps } from '../../types'
import { buildHighlightState, seedNodePositions } from '../../utils/graphLayout'
import { getGroupColor } from '../../utils/colorPalette'
import { Tooltip } from './Tooltip'
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

type TooltipState = {
  type: 'node' | 'edge'
  data: GraphNode | GraphEdge
  x: number
  y: number
  pinned: boolean
}

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
  transformRef: React.MutableRefObject<d3.ZoomTransform>,
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

function useGraphSimulation(data: KnowledgeGraphProps['data'], width: number, height: number) {
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

export const KnowledgeGraph = forwardRef<KnowledgeGraphHandle, KnowledgeGraphProps>(
  function KnowledgeGraph(
    {
      data,
      width = '100%',
      height = 640,
      onNodeClick,
      onEdgeClick,
      selectedNodeId,
      focusNodeId,
      showSearch = false,
      showGroupFilter = false,
      onDeselect,
      showStats = false,
      showTooltips = false,
      tooltipOptions,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const svgRef = useRef<SVGSVGElement | null>(null)
    const contentRef = useRef<SVGGElement | null>(null)
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [hiddenGroups, setHiddenGroups] = useState<Set<string>>(new Set())
    const [internalFocusNodeId, setInternalFocusNodeId] = useState<string | null>(null)
    const [tooltip, setTooltip] = useState<TooltipState | null>(null)
    const hasFitToScreenRef = useRef(false)
    const lastAnimatedFocusNodeIdRef = useRef<string | null>(null)
    const zoomTransformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity)

    const groups = useMemo(
      () =>
        Array.from(
          new Set(
            data.nodes
              .map((node) => node.group)
              .filter((group): group is string => Boolean(group && group.trim())),
          ),
        ),
      [data.nodes],
    )

    const visibleNodes = useMemo(
      () => data.nodes.filter((node) => !node.group || !hiddenGroups.has(node.group)),
      [data.nodes, hiddenGroups],
    )

    const visibleNodeIdSet = useMemo(
      () => new Set(visibleNodes.map((node) => node.id)),
      [visibleNodes],
    )

    const visibleEdges = useMemo(
      () =>
        data.edges.filter(
          (edge) => visibleNodeIdSet.has(edge.source) && visibleNodeIdSet.has(edge.target),
        ),
      [data.edges, visibleNodeIdSet],
    )

    const filteredData = useMemo(
      () => ({ nodes: visibleNodes, edges: visibleEdges }),
      [visibleEdges, visibleNodes],
    )

    const { width: renderedWidth, height: renderedHeight } = useElementSize(containerRef)
    const zoomBehaviorRef = useZoomPan(svgRef, contentRef, zoomTransformRef)
    const { layout, isSimulationSettled } = useGraphSimulation(filteredData, renderedWidth, renderedHeight)
    const highlightState = useMemo(
      () => buildHighlightState(filteredData, hoveredNodeId),
      [filteredData, hoveredNodeId],
    )
    const resolvedFocusNodeId = internalFocusNodeId ?? focusNodeId

    const searchResults = useMemo(() => {
      if (!searchQuery.trim()) {
        return []
      }

      const query = searchQuery.toLowerCase()

      return visibleNodes
        .filter((node) => node.label.toLowerCase().includes(query))
        .slice(0, 8)
    }, [searchQuery, visibleNodes])

    const nodesById = useMemo(
      () => new Map(filteredData.nodes.map((node) => [node.id, node] as const)),
      [filteredData.nodes],
    )

    const edgesById = useMemo(
      () => new Map(filteredData.edges.map((edge) => [edge.id, edge] as const)),
      [filteredData.edges],
    )

    useImperativeHandle(ref, () => ({
      exportAsPNG(filename = 'graph.png') {
        const svg = svgRef.current

        if (!svg) {
          return
        }

        const serializer = new XMLSerializer()
        const svgString = serializer.serializeToString(svg)
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)

        const image = new Image()
        image.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = renderedWidth * 2
          canvas.height = renderedHeight * 2

          const context = canvas.getContext('2d')
          if (!context) {
            URL.revokeObjectURL(url)
            return
          }

          context.scale(2, 2)
          context.drawImage(image, 0, 0, renderedWidth, renderedHeight)
          URL.revokeObjectURL(url)

          const link = document.createElement('a')
          link.download = filename
          link.href = canvas.toDataURL('image/png')
          link.click()
        }

        image.onerror = () => {
          URL.revokeObjectURL(url)
        }

        image.src = url
      },
    }), [renderedHeight, renderedWidth])

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

      fitToScreen(svgElement, zoomBehavior, layout.nodes, renderedWidth, renderedHeight)
      hasFitToScreenRef.current = true
    }, [isSimulationSettled, layout.nodes, renderedHeight, renderedWidth, zoomBehaviorRef])

    useEffect(() => {
      setInternalFocusNodeId(null)
    }, [focusNodeId])

    useEffect(() => {
      const handler = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') {
          return
        }

        setHoveredNodeId(null)
        setInternalFocusNodeId(null)
        setTooltip(null)
        onDeselect?.()
      }

      window.addEventListener('keydown', handler)
      return () => {
        window.removeEventListener('keydown', handler)
      }
    }, [onDeselect])

    useEffect(() => {
      if (!showTooltips) {
        setTooltip(null)
      }
    }, [showTooltips])

    useEffect(() => {
      const svgElement = svgRef.current
      const zoomBehavior = zoomBehaviorRef.current

      if (!resolvedFocusNodeId || !svgElement || !zoomBehavior) {
        if (!resolvedFocusNodeId) {
          lastAnimatedFocusNodeIdRef.current = null
        }

        return
      }

      const node = layout.nodes.find((layoutNode) => layoutNode.id === resolvedFocusNodeId)

      if (!node || node.x == null || node.y == null) {
        return
      }

      if (lastAnimatedFocusNodeIdRef.current === resolvedFocusNodeId) {
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
            .translate(renderedWidth / 2, renderedHeight / 2)
            .scale(scale)
            .translate(-node.x, -node.y),
        )

      lastAnimatedFocusNodeIdRef.current = resolvedFocusNodeId
    }, [layout.nodes, renderedHeight, renderedWidth, resolvedFocusNodeId, zoomBehaviorRef])

    const toggleGroup = (group: string) => {
      setHiddenGroups((previous) => {
        const next = new Set(previous)

        if (next.has(group)) {
          next.delete(group)
        } else {
          next.add(group)
        }

        return next
      })
    }

    return (
      <div
        ref={containerRef}
        className="okve-graph"
        style={{
          width,
          height,
        }}
      >
        {showSearch && (
          <div className="okve-search-bar">
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value)
              }}
              className="okve-search-input"
            />
            {searchResults.length > 0 && (
              <ul className="okve-search-results">
                {searchResults.map((node) => (
                  <li
                    key={node.id}
                    className="okve-search-result-item"
                    onClick={() => {
                      setInternalFocusNodeId(node.id)
                      onNodeClick?.(node)
                    }}
                  >
                    {node.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {showGroupFilter && groups.length > 0 && (
          <div className="okve-group-filter">
            {groups.map((group) => (
              <button
                key={group}
                type="button"
                className={joinClassNames(
                  'okve-group-chip',
                  hiddenGroups.has(group) && 'okve-group-chip--hidden',
                )}
                onClick={() => {
                  toggleGroup(group)
                }}
                style={{ borderColor: getGroupColor(group) }}
              >
                <span className="okve-chip-dot" style={{ background: getGroupColor(group) }} />
                {group}
              </button>
            ))}
          </div>
        )}
        {showStats && (
          <div className="okve-stats" aria-label="Graph stats">
            <span>{data.nodes.length} nodes</span>
            <span>{data.edges.length} edges</span>
          </div>
        )}
        <svg
          ref={svgRef}
          className="okve-graph__svg"
          width="100%"
          height="100%"
          viewBox={`0 0 ${renderedWidth} ${renderedHeight}`}
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
                        renderedWidth,
                        renderedHeight,
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
                  setHoveredNodeId(node.id)

                  if (!showTooltips) {
                    return
                  }

                  const position = getTooltipPosition(
                    node.x ?? 0,
                    node.y ?? 0,
                    zoomTransformRef.current,
                    renderedWidth,
                    renderedHeight,
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
                  setHoveredNodeId(null)

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
                        renderedWidth,
                        renderedHeight,
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
      </div>
    )
  },
)

KnowledgeGraph.displayName = 'KnowledgeGraph'