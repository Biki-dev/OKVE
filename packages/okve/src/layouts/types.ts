import type { RefObject } from 'react'

import type { GraphData, GraphEdge, GraphNode, GraphLayout, TooltipOptions } from '../types'

export interface LayoutProps {
  data: GraphData
  width: number
  height: number
  hoveredNodeId: string | null
  selectedNodeId?: string
  onNodeClick?: (node: GraphNode) => void
  onEdgeClick?: (edge: GraphEdge) => void
  onNodeHover?: (nodeId: string | null) => void
  showTooltips?: boolean
  tooltipOptions?: TooltipOptions
}

export interface InternalLayoutProps extends LayoutProps {
  svgRef: RefObject<SVGSVGElement | null>
  layout?: GraphLayout
  focusNodeId?: string
  interactionResetKey?: number
}
