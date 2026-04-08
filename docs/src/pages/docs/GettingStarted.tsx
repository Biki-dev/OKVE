import { CodeBlock } from '../../components/ui/CodeBlock'

const installCode = `npm install @biki-dev/okve`
const usageCode = `import { KnowledgeGraph } from '@biki-dev/okve'

const data = {
  nodes: [{ id: 'n1', label: 'React' }],
  edges: []
}

<KnowledgeGraph data={data} showSearch showGroupFilter />`

export function GettingStarted() {
  return (
    <article className="doc-article">
      <h1>Getting Started</h1>
      <section id="overview">
        <h2>Overview</h2>
        <p>
          OKVE is a React component library for rendering interactive knowledge graphs from JSON
          data. It is designed to give you the core graph behaviors you need without building the
          interaction layer from scratch.
        </p>
        <p>
          The package focuses on force-directed layout, zoom and pan, clickable nodes and edges,
          group-based styling, controlled selection, and image export.
        </p>
      </section>

      <section id="features">
        <h2>Built-in features</h2>
        <ul>
          <li>Force-directed layout powered by D3.</li>
          <li>Zoom and pan interactions for dense graphs.</li>
          <li>Clickable nodes and edges with labels and arrows.</li>
          <li>Group-based node colors and node sizing.</li>
          <li>Search, group filters, stats overlay, and Escape-to-deselect.</li>
          <li>Imperative PNG export through a React ref.</li>
        </ul>
      </section>

      <section id="installation">
        <h2>Installation</h2>
        <p>
          Install OKVE into your React or TypeScript project.
        </p>
        <CodeBlock code={installCode} lang="bash" />
        <p>
          The package ships with typed definitions and is built for modern bundlers like Vite.
        </p>
      </section>

      <section id="quick-start">
        <h2>Quick Start</h2>
        <p>
          Pass your <code>GraphData</code> object into <code>KnowledgeGraph</code>, then opt into
          the built-in helpers you need for search, filtering, selection, and camera focus.
        </p>
        <CodeBlock code={usageCode} lang="tsx" />
        <p>
          The recommended pattern is to keep selected node state in your React app and pass it
          back into the graph as controlled props.
        </p>
      </section>

      <section id="schema">
        <h2>Data schema</h2>
        <p>
          Each node requires <code>id</code> and <code>label</code>. Optional <code>group</code>,{' '}
          <code>size</code>, and metadata fields help shape the graph experience and provide richer
          detail in the UI.
        </p>
        <p>
          Each edge requires <code>id</code>, <code>source</code>, and <code>target</code>.
          Optional <code>label</code>, <code>directed</code>, <code>weight</code>, and metadata
          fields can be used to describe relationship strength and meaning.
        </p>
      </section>

      <section id="faq">
        <h2>Community</h2>
        <p>
          If you need help, open a GitHub issue or discussion with a minimal sample of your graph
          data and the interaction you want to build.
        </p>
      </section>
    </article>
  )
}
