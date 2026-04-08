import { ensureOkveStyles } from './styles/ensureStyles'

ensureOkveStyles()

export { KnowledgeGraph } from './components/KnowledgeGraph'
export type {
	EdgeTooltipField,
	GraphData,
	GraphEdge,
	GraphNode,
	KnowledgeGraphHandle,
	KnowledgeGraphProps,
	NodeTooltipField,
	TooltipOptions,
} from './types'
