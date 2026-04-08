export function Changelog() {
  return (
    <article className="doc-article">
      <h1>Changelog</h1>
      <section id="overview">
        <p>
          Release notes for the OKVE package and docs site. This page highlights the most relevant
          graph and developer-experience changes by version.
        </p>
      </section>
      <section id="schema" className="timeline">
        <section>
          <h2>v0.3.0</h2>
          <ul>
            <li>Added controlled node selection and programmatic focus.</li>
            <li>Added optional search, group filters, and stats overlays.</li>
            <li>
              Added <code>exportAsPNG</code> ref API for asset export.
            </li>
            <li>Expanded graph data support with richer node and edge metadata.</li>
          </ul>
        </section>
        <section>
          <h2>v0.2.0</h2>
          <ul>
            <li>Improved edge labels, arrows, and hover readability.</li>
            <li>Stabilized force-layout defaults for denser graphs.</li>
            <li>Refined the visual style of connected nodes and edge routes.</li>
          </ul>
        </section>
        <section>
          <h2>v0.1.0</h2>
          <ul>
            <li>Initial public release with a reusable React knowledge-graph component.</li>
          </ul>
        </section>
      </section>
      <section id="faq">
        <h2>Community</h2>
        <p>
          Follow GitHub releases for tagged updates, migration notes, and future API additions.
        </p>
      </section>
    </article>
  )
}
