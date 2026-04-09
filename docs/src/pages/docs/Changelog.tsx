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
          <h2>v0.5.0</h2>
          <ul>
            <li>Added multi-layout support with <code>layout=&quot;force&quot;</code> and <code>layout=&quot;radial&quot;</code>.</li>
            <li>Added a radial tree renderer with automatic root selection and concentric depth rings.</li>
            <li>Added curved radial links, rotated labels, and full interaction parity with the force layout.</li>
            <li>Introduced the exported <code>GraphLayout</code> type for layout-safe TypeScript usage.</li>
          </ul>
        </section>
        <section>
          <h2>v0.4.0</h2>
          <ul>
            <li>Added built-in node tooltips with hover preview and click-to-pin behavior.</li>
            <li>Added built-in edge tooltips on click with source, target, and edge metadata.</li>
            <li>
              Added <code>showTooltips</code> and <code>tooltipOptions</code> for configurable
              tooltip content.
            </li>
            <li>Added tooltip auto-positioning so cards stay within graph bounds.</li>
            <li>Added demo controls for toggling tooltip fields and metadata keys.</li>
          </ul>
        </section>
        <section>
          <h2>v0.3.2</h2>
          <ul>
            <li>Ensured package styles are injected automatically for consumers.</li>
            <li>
              Added optional explicit stylesheet import via <code>@biki-dev/okve/styles.css</code>.
            </li>
          </ul>
        </section>
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
