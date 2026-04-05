# OKVE

OKVE is a small React component library for rendering interactive knowledge graphs from JSON data.

## Install

```bash
npm install okve
```

## Usage

```tsx
import { KnowledgeGraph } from 'okve'

<KnowledgeGraph
  data={graphData}
  width="100%"
  height={640}
  onNodeClick={(node) => console.log(node)}
/>
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `data` | `GraphData` | Graph nodes and edges to render. |
| `width` | `number | string` | Graph width, defaults to `100%`. |
| `height` | `number | string` | Graph height, defaults to `640`. |
| `onNodeClick` | `(node: GraphNode) => void` | Called when a node is clicked. |
| `onEdgeClick` | `(edge: GraphEdge) => void` | Called when an edge is clicked. |

## Data Schema

```ts
type GraphNode = {
  id: string
  label: string
  group?: string
  metadata?: Record<string, unknown>
}

type GraphEdge = {
  id: string
  source: string
  target: string
  directed?: boolean
  weight?: number
}

type GraphData = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
```

## Demo

See the Vite demo in [demo/src/App.tsx](demo/src/App.tsx) for a complete example with click details.

## Contributing

Use the workspace demo to verify graph behavior, then run the package build before publishing.

## License

MIT
