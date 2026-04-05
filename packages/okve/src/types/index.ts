export interface GraphNode {
  id: string
  label: string
  group?: string
  metadata?: Record<string, unknown>
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  directed?: boolean
  weight?: number
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface KnowledgeGraphProps {
  data: GraphData
  width?: number | string
  height?: number | string
  onNodeClick?: (node: GraphNode) => void
  onEdgeClick?: (edge: GraphEdge) => void
}