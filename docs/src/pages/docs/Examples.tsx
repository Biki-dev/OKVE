import { CodeBlock } from '../../components/ui/CodeBlock'

const controlledExample = `const [selectedId, setSelectedId] = useState<string>()
const [focusNodeId, setFocusNodeId] = useState<string>()

<KnowledgeGraph
  data={data}
  selectedNodeId={selectedId}
  focusNodeId={focusNodeId}
  onNodeClick={(node) => {
    setSelectedId(node.id)
    setFocusNodeId(node.id)
  }}
/>`

const tooltipExample = `<KnowledgeGraph
  data={data}
  showTooltips
  onNodeClick={(node) => console.log('Node:', node.label)}
  onEdgeClick={(edge) => console.log('Edge:', edge.source, '->', edge.target)}
/>`

const tooltipFieldsExample = `<KnowledgeGraph
  data={data}
  showTooltips
  tooltipOptions={{
    nodeFields: ['group', 'metadata'],
    edgeFields: ['label', 'metadata'],
    metadataKeys: ['description', 'takeaway'],
    maxRows: 4,
  }}
/>`

export function Examples() {
  return (
    <article className="doc-article">
      <h1>Examples</h1>
      <section id="overview">
        <h2>Controlled selection and focus</h2>
        <p>
          Keep graph state in your app and drive interaction from outside the component. This is
          the recommended pattern when you want selection, camera focus, and side panels to stay
          in sync.
        </p>
        <p>
          The same approach is used in the docs demo route: selection updates the graph, and the
          selected node details panel updates alongside it.
        </p>
      </section>
      <section id="quick-start">
        <h2>Minimal controlled setup</h2>
        <CodeBlock code={controlledExample} lang="tsx" />
        <p>
          Use <code>selectedNodeId</code> for selection state and <code>focusNodeId</code> when you
          want the camera to center on a specific node from outside the graph.
        </p>
      </section>
      <section id="tooltips">
        <h2>Enable built-in tooltips</h2>
        <CodeBlock code={tooltipExample} lang="tsx" />
        <p>
          With <code>showTooltips</code> enabled, node hover shows an unpinned tooltip, node click
          pins it, and edge click opens a pinned edge tooltip.
        </p>
        <CodeBlock code={tooltipFieldsExample} lang="tsx" />
        <p>
          Use <code>tooltipOptions</code> when you want users to see only selected fields such as
          group, label, or a subset of metadata keys.
        </p>
      </section>
      <section id="workflow">
        <h2>Recommended workflow</h2>
        <ul>
          <li>Start with your raw node and edge JSON.</li>
          <li>
            Pass the data into <code>KnowledgeGraph</code>.
          </li>
          <li>Enable search, group chips, and stats when you need them.</li>
          <li>Store selection in your own React state for richer surrounding UI.</li>
          <li>
            Call <code>exportAsPNG</code> through a ref when you need a snapshot.
          </li>
        </ul>
      </section>
      <section id="faq">
        <h2>Community</h2>
        <p>Share edge cases and layout ideas in discussions so the examples can grow with real use.</p>
      </section>
    </article>
  )
}
