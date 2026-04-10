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

const radialLayoutExample = `<KnowledgeGraph
  data={data}
  layout="radial"
  showTooltips
  showSearch
  showGroupFilter
/>`

const arcLayoutExample = `<KnowledgeGraph
  data={data}
  layout="arc"
  showTooltips
  showSearch
  showStats
/>`

const chordLayoutExample = `<KnowledgeGraph
  data={gradesWithGroups}
  layout="chord"
  showTooltips
  showGroupFilter
/>`

const layoutSwitchExample = `const [layout, setLayout] = useState<'force' | 'radial' | 'arc' | 'chord'>('force')

<button onClick={() => setLayout((prev) => {
  const layouts = ['force', 'radial', 'arc', 'chord'] as const
  return layouts[(layouts.indexOf(prev) + 1) % layouts.length]
})}>
  Switch layout
</button>

<KnowledgeGraph
  data={data}
  layout={layout}
  selectedNodeId={selectedId}
  onNodeClick={(node) => setSelectedId(node.id)}
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
      <section id="radial-layout">
        <h2>Radial layout</h2>
        <p>
          Use radial mode when you want to present hierarchical or clustered relationships from
          the same graph data model.
        </p>
        <CodeBlock code={radialLayoutExample} lang="tsx" />
        <p>
          The radial renderer picks the most connected node as the root and places neighbors in
          concentric rings.
        </p>
      </section>
      <section id="arc-layout">
        <h2>Arc layout</h2>
        <p>
          Use arc mode to show connection density across a linear sequence or timeline. Highly
          connected nodes automatically move toward the center, making it easy to spot hubs.
        </p>
        <CodeBlock code={arcLayoutExample} lang="tsx" />
        <p>
          Nodes sit on a horizontal baseline with arcs showing edge connections. Edge weight
          affects arc thickness. This layout works well with search and stats overlay.
        </p>
      </section>
      <section id="chord-layout">
        <h2>Chord layout</h2>
        <p>
          Use chord mode to visualize flow and volume between group segments. Each group becomes
          a segment on a circle, and ribbon thickness represents edge weight aggregated by group.
        </p>
        <CodeBlock code={chordLayoutExample} lang="tsx" />
        <p>
          The chord layout requires nodes to have a <code>group</code> field for meaningful
          visualization. Hover a group segment to highlight connected ribbons.
        </p>
      </section>
      <section id="layout-switching">
        <h2>Switch layouts at runtime</h2>
        <CodeBlock code={layoutSwitchExample} lang="tsx" />
        <p>
          Keep selection and surrounding UI controlled in React state, then swap between{' '}
          <code>force</code>, <code>radial</code>, <code>arc</code>, and <code>chord</code> depending on the story you want to tell.
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
