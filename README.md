# OKVE
<img width="1784" height="777" alt="image" src="https://github.com/user-attachments/assets/732ee0d0-ac74-4c6e-b817-66a3f76c80c0" />

OKVE is a React component library for rendering interactive knowledge graphs from JSON data.

Current features include:
- Force-directed layout powered by D3
- Zoom and pan interactions
- Clickable nodes and edges
- Edge labels and directed arrows
- Group-based node colors and node sizing
- Controlled node selection and programmatic focus
- Optional in-graph search and group filter chips
- Optional built-in node and edge tooltips
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
        showTooltips
        tooltipOptions={{
          nodeFields: ['group', 'metadata'],
          edgeFields: ['label', 'metadata'],
          metadataKeys: ['description', 'takeaway'],
          maxRows: 4,
        }}
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
| `showTooltips` | `boolean` | Enables built-in node/edge tooltips with click-to-pin behavior. Default: `false`. |
| `tooltipOptions` | `TooltipOptions` | Selects which node/edge fields appear in built-in tooltips. |
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

See the demo in [DEMO](https://okve.vercel.app/demo) for a complete example with click details, selected state, and labeled edges.

## Known Notes

- PNG export is available in v0.3, but some environments may not fully preserve SVG-driven edge styling. A dedicated hardening pass is planned in a later release.


## License

MIT
