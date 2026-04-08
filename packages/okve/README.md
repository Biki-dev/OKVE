# OKVE

OKVE is a React component library for rendering interactive knowledge graphs from JSON data.

Current features include:
- Force-directed layout powered by D3
- Zoom and pan interactions
- Clickable nodes and edges
- Edge labels and directed arrows
- Group-based node colors and node sizing
- Controlled node selection and programmatic focus
- Optional in-graph search and group filter chips
- Escape-to-deselect callback and stats overlay
- Imperative PNG export API

## Install

```bash
npm install @biki-dev/okve
```

## Usage

```tsx
import { useRef, useState } from 'react'
import { KnowledgeGraph, type KnowledgeGraphHandle } from '@biki-dev/okve'

export function GraphScreen() {
  const graphRef = useRef<KnowledgeGraphHandle | null>(null)
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const [focusNodeId, setFocusNodeId] = useState<string | undefined>()

  return (
    <>
      <button
        type="button"
        onClick={() => {
          graphRef.current?.exportAsPNG('graph.png')
        }}
      >
        Export PNG
      </button>

      <KnowledgeGraph
        ref={graphRef}
        data={graphData}
        width="100%"
        height={640}
        selectedNodeId={selectedId}
        focusNodeId={focusNodeId}
        showSearch
        showGroupFilter
        showStats
        onNodeClick={(node) => {
          setSelectedId(node.id)
          setFocusNodeId(node.id)
        }}
        onEdgeClick={(edge) => console.log(edge)}
        onDeselect={() => {
          setSelectedId(undefined)
          setFocusNodeId(undefined)
        }}
      />
    </>
  )
}
```

Styles are auto-injected when the package is imported.

If you prefer explicit style loading, you can also import:

```ts
import '@biki-dev/okve/styles.css'
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
| `focusNodeId` | `string` | Animates and centers the camera on the provided node id. |
| `showSearch` | `boolean` | Shows a built-in search input and search results list. Default: `false`. |
| `showGroupFilter` | `boolean` | Shows toggle chips for node groups. Default: `false`. |
| `onDeselect` | `() => void` | Called when Escape is pressed to clear active selection state. |
| `showStats` | `boolean` | Shows a subtle overlay with node and edge counts. Default: `false`. |

## Ref API

Use a React ref to call imperative actions.

```ts
type KnowledgeGraphHandle = {
  exportAsPNG: (filename?: string) => void
}
```

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

## Known Notes

- PNG export is available in v0.3, but some environments may not fully preserve SVG-driven edge styling. A dedicated hardening pass is planned in a later release.

## Contributing

Use the workspace demo to verify graph behavior, then run the package build before publishing.

## License

MIT
