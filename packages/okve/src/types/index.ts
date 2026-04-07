export interface GraphNode {
  id: string
  label: string
  group?: string
  size?: number
  metadata?: Record<string, unknown>
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  directed?: boolean
  weight?: number
  label?: string
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
  selectedNodeId?: string
  focusNodeId?: string
  showSearch?: boolean
  showGroupFilter?: boolean
  onDeselect?: () => void
  showStats?: boolean
}

export interface KnowledgeGraphHandle {
  exportAsPNG: (filename?: string) => void
}