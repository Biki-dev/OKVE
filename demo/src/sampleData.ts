import type { GraphData } from 'okve'

export const sampleData: GraphData = {
	nodes: [
		{
			id: '1',
			label: 'React',
			group: 'frontend',
			size: 2.0,
			metadata: {
				description: 'Component-driven UI library used to build the graph demo shell.',
				takeaway: 'The core library should feel native to React developers.',
			},
		},
		{
			id: '2',
			label: 'TypeScript',
			group: 'language',
			size: 1.5,
			metadata: {
				description: 'Defines the graph schema and keeps consumers honest at compile time.',
				takeaway: 'The package should export clean, useful types.',
			},
		},
		{
			id: '3',
			label: 'D3.js',
			group: 'frontend',
			size: 1.2,
			metadata: {
				description: 'Handles graph positioning, linking, and interactive zoom/pan behavior.',
				takeaway: 'Force layout beats hard-coded positions for v0.1.',
			},
		},
		{
			id: '4',
			label: 'Vite',
			group: 'tooling',
			size: 1.0,
			metadata: {
				description: 'Keeps the graph crisp, inspectable, and easy to theme with CSS.',
				takeaway: 'SVG is a better first pass than canvas for this library.',
			},
		},
		{
			id: '5',
			label: 'Node.js',
			group: 'backend',
			size: 1.8,
			metadata: {
				description: 'The runtime that builds and ships the package.',
				takeaway: 'If the build is clean, the package is ready to publish.',
			},
		},
		{
			id: '6',
			label: 'GraphQL',
			group: 'backend',
			size: 1.3,
			metadata: {
				description: 'A schema-driven API style that pairs well with graph data.',
				takeaway: 'Edge labels help explain the relationship between systems.',
			},
		},
	],
	edges: [
		{ id: 'e1', source: '1', target: '2', label: 'uses', directed: true },
		{ id: 'e2', source: '1', target: '3', label: 'renders', directed: true },
		{ id: 'e3', source: '4', target: '1', label: 'builds', directed: true },
		{ id: 'e4', source: '5', target: '6', label: 'serves', directed: true },
		{ id: 'e5', source: '2', target: '5', label: 'runs on', directed: false },
	],
}
