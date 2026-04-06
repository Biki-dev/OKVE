# OKVE

OKVE is a small React component library for rendering interactive knowledge graphs from JSON data.

It supports force-directed layout, zoom and pan, clickable nodes and edges, edge labels, group-based node colors, node sizing, and controlled selection.

## Install

```bash
npm install @biki-dev/okve
```

## Usage

```tsx
import { useState } from 'react'
import { KnowledgeGraph } from '@biki-dev/okve'

const [selectedId, setSelectedId] = useState<string | undefined>()

<KnowledgeGraph
  data={graphData}
  width="100%"
  height={640}
  selectedNodeId={selectedId}
  onNodeClick={(node) => setSelectedId(node.id)}
  onEdgeClick={(edge) => console.log(edge)}
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
| `selectedNodeId` | `string` | Highlights the selected node when provided. |

## Data Schema

```ts
type GraphNode = {
  id: string
  label: string
  group?: string
  size?: number
  metadata?: Record<string, unknown>
}

type GraphEdge = {
  id: string
  source: string
  target: string
  directed?: boolean
  weight?: number
  label?: string
}

type GraphData = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
```

## Demo

See the Vite demo in [demo/src/App.tsx](demo/src/App.tsx) for a complete example with click details, selected state, and labeled edges.

## Contributing

Use the workspace demo to verify graph behavior, then run the package build before publishing.

## License

MIT
