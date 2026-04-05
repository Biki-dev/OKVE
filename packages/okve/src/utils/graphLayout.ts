import type { SimulationNodeDatum } from 'd3'

import type { GraphData, GraphNode } from '../types'

export type PositionedGraphNode = GraphNode & SimulationNodeDatum

export interface HighlightState {
  highlightedNodeIds: Set<string>
  highlightedEdgeIds: Set<string>
}

export function seedNodePositions(
  nodes: GraphNode[],
  width: number,
  height: number,
): PositionedGraphNode[] {
  const nodeCount = Math.max(nodes.length, 1)
  const radius = Math.max(Math.min(width, height) * 0.28, 120)
  const centerX = width / 2
  const centerY = height / 2

  return nodes.map((node, index) => {
    const angle = (index / nodeCount) * Math.PI * 2 - Math.PI / 2

    return {
      ...node,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
    }
  })
}

export function buildHighlightState(
  data: GraphData,
  hoveredNodeId: string | null,
): HighlightState {
  const highlightedNodeIds = new Set<string>()
  const highlightedEdgeIds = new Set<string>()

  if (!hoveredNodeId) {
    data.nodes.forEach((node) => highlightedNodeIds.add(node.id))
    data.edges.forEach((edge) => highlightedEdgeIds.add(edge.id))
    return { highlightedNodeIds, highlightedEdgeIds }
  }

  highlightedNodeIds.add(hoveredNodeId)

  data.edges.forEach((edge) => {
    if (edge.source === hoveredNodeId || edge.target === hoveredNodeId) {
      highlightedEdgeIds.add(edge.id)
      highlightedNodeIds.add(edge.source)
      highlightedNodeIds.add(edge.target)
    }
  })

  return { highlightedNodeIds, highlightedEdgeIds }
}