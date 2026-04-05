import type { GraphData } from 'okve'

export const sampleData: GraphData = {
	nodes: [
		{
			id: 'react',
			label: 'React',
			group: 'ui',
			metadata: {
				description: 'Component-driven UI library used to build the graph demo shell.',
				takeaway: 'The core library should feel native to React developers.',
			},
		},
		{
			id: 'hooks',
			label: 'Hooks',
			group: 'ui',
			metadata: {
				description: 'The state and lifecycle primitive used to connect user interactions.',
				takeaway: 'Clicking a node should feel like a normal React event.',
			},
		},
		{
			id: 'typescript',
			label: 'TypeScript',
			group: 'infra',
			metadata: {
				description: 'Defines the graph schema and keeps consumers honest at compile time.',
				takeaway: 'The package should export clean, useful types.',
			},
		},
		{
			id: 'd3',
			label: 'D3 Force Layout',
			group: 'layout',
			metadata: {
				description: 'Handles graph positioning, linking, and interactive zoom/pan behavior.',
				takeaway: 'Force layout beats hard-coded positions for v0.1.',
			},
		},
		{
			id: 'svg',
			label: 'SVG Rendering',
			group: 'rendering',
			metadata: {
				description: 'Keeps the graph crisp, inspectable, and easy to theme with CSS.',
				takeaway: 'SVG is a better first pass than canvas for this library.',
			},
		},
		{
			id: 'publish',
			label: 'npm Publish',
			group: 'release',
			metadata: {
				description: 'The packaging target for v0.1 and the reason the repo exists.',
				takeaway: 'If the demo looks good and the build is clean, the package is usable.',
			},
		},
	],
	edges: [
		{ id: 'react-hooks', source: 'react', target: 'hooks', directed: true, weight: 3 },
		{ id: 'react-svg', source: 'react', target: 'svg', directed: true, weight: 2 },
		{ id: 'react-typescript', source: 'react', target: 'typescript', directed: true, weight: 2 },
		{ id: 'hooks-d3', source: 'hooks', target: 'd3', directed: true, weight: 2 },
		{ id: 'typescript-svg', source: 'typescript', target: 'svg', directed: true, weight: 1 },
		{ id: 'd3-svg', source: 'd3', target: 'svg', directed: true, weight: 3 },
		{ id: 'svg-publish', source: 'svg', target: 'publish', directed: true, weight: 2 },
		{ id: 'typescript-publish', source: 'typescript', target: 'publish', directed: true, weight: 3 },
	],
}
