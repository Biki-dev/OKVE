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
  metadata?: Record<string, unknown>
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export type GraphLayout = 'force' | 'radial' | 'arc' | 'chord'

export type NodeTooltipField = 'id' | 'group' | 'size' | 'metadata'
export type EdgeTooltipField = 'id' | 'label' | 'weight' | 'directed' | 'metadata'

export interface TooltipOptions {
  nodeFields?: NodeTooltipField[]
  edgeFields?: EdgeTooltipField[]
  metadataKeys?: string[]
  maxRows?: number
}

export interface KnowledgeGraphProps {
  data: GraphData
  width?: number | string
  height?: number | string
  layout?: GraphLayout
  onNodeClick?: (node: GraphNode) => void
  onEdgeClick?: (edge: GraphEdge) => void
  selectedNodeId?: string
  focusNodeId?: string
  showSearch?: boolean
  showGroupFilter?: boolean
  onDeselect?: () => void
  showStats?: boolean
  showTooltips?: boolean
  tooltipOptions?: TooltipOptions
}

export interface KnowledgeGraphHandle {
  exportAsPNG: (filename?: string) => void
}