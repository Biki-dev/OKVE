import { ensureOkveStyles } from './styles/ensureStyles'

ensureOkveStyles()

export { KnowledgeGraph } from './components/KnowledgeGraph'
export type {
	GraphData,
	GraphEdge,
	GraphNode,
	KnowledgeGraphHandle,
	KnowledgeGraphProps,
} from './types'
