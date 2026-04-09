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

type TreeDatum = {
  node: GraphNode
  children: TreeDatum[]
  parentEdge?: GraphEdge
}

type RadialNode = {
  id: string
  data: GraphNode
  x: number
  y: number
  absX: number
  absY: number
  angle: number
  depth: number
}

type RadialEdge = {
  id: string
  data: GraphEdge
  sourceId: string
  targetId: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourceAbsX: number
  sourceAbsY: number
  targetAbsX: number
  targetAbsY: number
  path: string
}

type RadialLayoutData = {
  nodes: RadialNode[]
  edges: RadialEdge[]
  focusMap: Map<string, { x: number; y: number }>
}

const NODE_BASE_RADIUS = 8
const ARROWHEAD_ID = 'okve-arrowhead-radial'

function getNodeRadius(node: GraphNode) {
  return NODE_BASE_RADIUS * (node.size ?? 1)
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

function joinClassNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

function radialPoint(angle: number, radius: number): [number, number] {
  return [radius * Math.cos(angle - Math.PI / 2), radius * Math.sin(angle - Math.PI / 2)]
}

function findRootId(data: GraphData): string | null {
  if (data.nodes.length === 0) {
    return null
  }

  const degree = new Map<string, number>()
  for (const node of data.nodes) {
    degree.set(node.id, 0)
  }

  for (const edge of data.edges) {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1)
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1)
  }

  return [...degree.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? data.nodes[0].id
}

function buildForest(data: GraphData, preferredRootId: string): TreeDatum {
  const nodeById = new Map(data.nodes.map((node) => [node.id, node] as const))
  const adjacency = new Map<string, Array<{ neighborId: string; edge: GraphEdge }>>()

  for (const node of data.nodes) {
    adjacency.set(node.id, [])
  }

  for (const edge of data.edges) {
    if (!nodeById.has(edge.source) || !nodeById.has(edge.target)) {
      continue
    }

    adjacency.get(edge.source)?.push({ neighborId: edge.target, edge })
    adjacency.get(edge.target)?.push({ neighborId: edge.source, edge })
  }

  const degree = new Map<string, number>()
  for (const node of data.nodes) {
    degree.set(node.id, adjacency.get(node.id)?.length ?? 0)
  }

  const traversalOrder = [
    preferredRootId,
    ...data.nodes
      .map((node) => node.id)
      .filter((id) => id !== preferredRootId)
      .sort((a, b) => (degree.get(b) ?? 0) - (degree.get(a) ?? 0)),
  ]

  const visited = new Set<string>()
  const components: TreeDatum[] = []

  for (const startId of traversalOrder) {
    if (visited.has(startId)) {
      continue
    }

    const rootNode = nodeById.get(startId)
    if (!rootNode) {
      continue
    }

    const componentRoot: TreeDatum = {
      node: rootNode,
      children: [],
    }

    const queue: TreeDatum[] = [componentRoot]
    visited.add(startId)

    while (queue.length > 0) {
      const current = queue.shift()
      if (!current) {
        continue
      }

      const neighbors = adjacency.get(current.node.id) ?? []
      for (const { neighborId, edge } of neighbors) {
        if (visited.has(neighborId)) {
          continue
        }

        const neighborNode = nodeById.get(neighborId)
        if (!neighborNode) {
          continue
        }

        const child: TreeDatum = {
          node: neighborNode,
          children: [],
          parentEdge: edge,
        }

        current.children.push(child)
        visited.add(neighborId)
        queue.push(child)
      }
    }

    components.push(componentRoot)
  }

  return {
    node: {
      id: '__okve_radial_root__',
      label: '__okve_radial_root__',
      metadata: { virtual: true },
    },
    children: components,
  }
}

function computeRadialLayout(data: GraphData, width: number, height: number): RadialLayoutData {
  if (data.nodes.length === 0) {
    return {
      nodes: [],
      edges: [],
      focusMap: new Map(),
    }
  }

  const rootId = findRootId(data)
  if (!rootId) {
    return {
      nodes: [],
      edges: [],
      focusMap: new Map(),
    }
  }

  const treeData = buildForest(data, rootId)
  const hierarchyRoot = d3.hierarchy<TreeDatum>(treeData, (datum) => datum.children)
  const radialTree = d3
    .tree<TreeDatum>()
    .size([2 * Math.PI, Math.max(48, Math.min(width, height) / 2 - 80)])
    .separation((a, b) => (a.parent === b.parent ? 1 : 1.7) / Math.max(1, a.depth))

  const laidOutRoot = radialTree(hierarchyRoot)
  const linkPath = d3
    .linkRadial<d3.HierarchyPointLink<TreeDatum>, d3.HierarchyPointNode<TreeDatum>>()
    .angle((linkNode) => linkNode.x)
    .radius((linkNode) => linkNode.y)

  const centerX = width / 2
  const centerY = height / 2
  const nodes: RadialNode[] = []
  const edges: RadialEdge[] = []
  const focusMap = new Map<string, { x: number; y: number }>()

  laidOutRoot.descendants().forEach((pointNode) => {
    if (pointNode.depth === 0) {
      return
    }

    const [x, y] = radialPoint(pointNode.x, pointNode.y)
    const absX = centerX + x
    const absY = centerY + y

    nodes.push({
      id: pointNode.data.node.id,
      data: pointNode.data.node,
      x,
      y,
      absX,
      absY,
      angle: pointNode.x,
      depth: Math.max(0, pointNode.depth - 1),
    })

    focusMap.set(pointNode.data.node.id, { x: absX, y: absY })

    if (!pointNode.parent || pointNode.depth <= 1 || !pointNode.data.parentEdge) {
      return
    }

    const parent = pointNode.parent
    const [sourceX, sourceY] = radialPoint(parent.x, parent.y)
    const [targetX, targetY] = radialPoint(pointNode.x, pointNode.y)

    edges.push({
      id: pointNode.data.parentEdge.id,
      data: pointNode.data.parentEdge,
      sourceId: parent.data.node.id,
      targetId: pointNode.data.node.id,
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourceAbsX: centerX + sourceX,
      sourceAbsY: centerY + sourceY,
      targetAbsX: centerX + targetX,
      targetAbsY: centerY + targetY,
      path: linkPath({ source: parent, target: pointNode }) ?? '',
    })
  })

  return {
    nodes,
    edges,
    focusMap,
  }
}

function fitToScreen(
  svg: SVGSVGElement,
  zoom: d3.ZoomBehavior<SVGSVGElement, unknown>,
  nodes: Array<{ absX: number; absY: number }>,
  width: number,
  height: number,
) {
  if (nodes.length === 0) {
    return
  }

  const xs = nodes.map((node) => node.absX)
  const ys = nodes.map((node) => node.absY)
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

export function RadialLayout({
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
  const radial = useMemo(() => computeRadialLayout(data, width, height), [data, width, height])
  const highlightData = useMemo(
    () => ({
      nodes: radial.nodes.map((node) => node.data),
      edges: radial.edges.map((edge) => edge.data),
    }),
    [radial.edges, radial.nodes],
  )
  const highlightState = useMemo(
    () => buildHighlightState(highlightData, hoveredNodeId),
    [highlightData, hoveredNodeId],
  )

  useEffect(() => {
    hasFitToScreenRef.current = false
  }, [data])

  useEffect(() => {
    if (hasFitToScreenRef.current) {
      return
    }

    const svgElement = svgRef.current
    const zoomBehavior = zoomBehaviorRef.current

    if (!svgElement || !zoomBehavior || radial.nodes.length === 0) {
      return
    }

    fitToScreen(svgElement, zoomBehavior, radial.nodes, width, height)
    hasFitToScreenRef.current = true
  }, [height, radial.nodes, svgRef, width, zoomBehaviorRef])

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

    const target = radial.focusMap.get(focusNodeId)

    if (!target) {
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
          .translate(-target.x, -target.y),
      )

    lastAnimatedFocusNodeIdRef.current = focusNodeId
  }, [focusNodeId, height, radial.focusMap, svgRef, width, zoomBehaviorRef])

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
        aria-label="Interactive radial knowledge graph"
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
          <g transform={`translate(${width / 2}, ${height / 2})`}>
            {radial.edges.map((edge) => {
              const isHighlighted = hoveredNodeId ? highlightState.highlightedEdgeIds.has(edge.id) : true
              const isDimmed = hoveredNodeId ? !isHighlighted : false

              return (
                <g key={edge.id}>
                  <path
                    d={edge.path}
                    stroke="transparent"
                    strokeWidth={12}
                    fill="none"
                    onClick={(event) => {
                      event.stopPropagation()

                      if (showTooltips) {
                        const midAbsX = (edge.sourceAbsX + edge.targetAbsX) / 2
                        const midAbsY = (edge.sourceAbsY + edge.targetAbsY) / 2
                        const position = getTooltipPosition(
                          midAbsX,
                          midAbsY,
                          zoomTransformRef.current,
                          width,
                          height,
                        )

                        setTooltip({
                          type: 'edge',
                          data: edge.data,
                          x: position.x,
                          y: position.y,
                          pinned: true,
                        })
                      }

                      onEdgeClick?.(edge.data)
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  <path
                    d={edge.path}
                    className={joinClassNames(
                      'okve-edge',
                      isHighlighted && 'okve-edge--highlighted',
                      isDimmed && 'okve-edge--dimmed',
                    )}
                    fill="none"
                    strokeWidth={edge.data.weight ? 1.5 + Math.min(edge.data.weight, 4) * 0.75 : 1.5}
                    markerEnd={edge.data.directed ? `url(#${ARROWHEAD_ID})` : undefined}
                    style={{ pointerEvents: 'none' }}
                  />
                </g>
              )
            })}

            {radial.edges.map((edge) => {
              if (!edge.data.label) {
                return null
              }

              return (
                <text
                  key={`label-${edge.id}`}
                  x={edge.sourceX + (edge.targetX - edge.sourceX) / 2}
                  y={edge.sourceY + (edge.targetY - edge.sourceY) / 2}
                  className="okve-edge-label"
                  textAnchor="middle"
                  dy="-4"
                >
                  {edge.data.label}
                </text>
              )
            })}

            {radial.nodes.map((node) => {
              const isHighlighted = hoveredNodeId ? highlightState.highlightedNodeIds.has(node.id) : true
              const isDimmed = hoveredNodeId ? !isHighlighted : false
              const isSelected = selectedNodeId === node.id
              const radius = getNodeRadius(node.data)
              const angleDeg = (node.angle * 180) / Math.PI - 90
              const isFlipped = node.angle >= Math.PI

              return (
                <g
                  key={node.id}
                  className={joinClassNames('okve-node-group', isDimmed && 'okve-node-group--dimmed')}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => {
                    onNodeHover?.(node.id)

                    if (!showTooltips) {
                      return
                    }

                    const position = getTooltipPosition(
                      node.absX,
                      node.absY,
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
                        data: node.data,
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
                          (previous.data as GraphNode).id === node.id
                        ) {
                          return null
                        }

                        const position = getTooltipPosition(
                          node.absX,
                          node.absY,
                          zoomTransformRef.current,
                          width,
                          height,
                        )

                        return {
                          type: 'node',
                          data: node.data,
                          x: position.x,
                          y: position.y,
                          pinned: true,
                        }
                      })
                    }

                    onNodeClick?.(node.data)
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
                    fill={getGroupColor(node.data.group)}
                  />
                  <text
                    className={joinClassNames(
                      'okve-label',
                      hoveredNodeId === node.id && 'okve-label--hovered',
                      isDimmed && 'okve-label--dimmed',
                    )}
                    transform={`rotate(${angleDeg}) translate(${radius + 10}, 0) ${
                      isFlipped ? 'rotate(180)' : ''
                    }`}
                    textAnchor={isFlipped ? 'end' : 'start'}
                    dominantBaseline="middle"
                  >
                    {node.data.label}
                  </text>
                  <title>{node.data.label}</title>
                </g>
              )
            })}
          </g>
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
