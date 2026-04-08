import { PropsTable } from '../../components/ui/PropsTable'

const propRows = [
  { name: 'data', type: 'GraphData', description: 'Nodes and edges to render in the graph.' },
  { name: 'width', type: 'number | string', defaultValue: '100%', description: 'Width of the graph viewport.' },
  { name: 'height', type: 'number | string', defaultValue: '640', description: 'Height of the graph viewport.' },
  { name: 'selectedNodeId', type: 'string', description: 'Keeps a node selected from outside the graph.' },
  { name: 'focusNodeId', type: 'string', description: 'Programmatically centers the camera on a node id.' },
  { name: 'showSearch', type: 'boolean', defaultValue: 'false', description: 'Shows the built-in search input and results.' },
  { name: 'showGroupFilter', type: 'boolean', defaultValue: 'false', description: 'Shows chips for node group filtering.' },
  { name: 'showStats', type: 'boolean', defaultValue: 'false', description: 'Shows a subtle node and edge count overlay.' },
  { name: 'onNodeClick', type: '(node: GraphNode) => void', description: 'Called when a node is clicked.' },
  { name: 'onEdgeClick', type: '(edge: GraphEdge) => void', description: 'Called when an edge is clicked.' },
  { name: 'onDeselect', type: '() => void', description: 'Called when Escape clears the current selection.' },
]

export function ApiReference() {
  return (
    <article className="doc-article">
      <h1>API Reference</h1>
      <section id="overview">
        <p>
          This reference follows the current package types and the feature set described in the
          package README.
        </p>
        <p>
          The component is designed for controlled React usage: keep selection in your app state,
          pass graph data in as JSON, and enable the built-in helpers you need.
        </p>
      </section>
      <section id="installation">
        <h2>KnowledgeGraphProps</h2>
        <PropsTable rows={propRows} />
      </section>
      <section id="schema">
        <h2>Type Summary</h2>
        <p>
          <code>GraphNode</code> supports <code>id</code>, <code>label</code>, optional{' '}
          <code>group</code>, optional <code>size</code>, and freeform metadata.{' '}
          <code>GraphEdge</code> supports <code>id</code>, <code>source</code>,{' '}
          <code>target</code>, optional <code>directed</code>, optional <code>weight</code>,{' '}
          optional <code>label</code>, and freeform metadata.
        </p>
        <p>
          <code>KnowledgeGraphHandle</code> exposes <code>exportAsPNG(filename?)</code> so you can
          generate image snapshots from a ref.
        </p>
      </section>
      <section id="faq">
        <h2>Community</h2>
        <p>
          If you need a prop that is not listed here, open a GitHub issue with a reproducible use
          case and the graph shape you are working with.
        </p>
      </section>
    </article>
  )
}
