import { KnowledgeGraph } from '@biki-dev/okve'
import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { CodeBlock } from '../components/ui/CodeBlock'
import { sampleData } from '../data/sampleData'

const quickStart = `import { KnowledgeGraph } from '@biki-dev/okve'

const data = { nodes: [...], edges: [...] }

export function GraphView() {
  return (
    <KnowledgeGraph
      data={data}
      showSearch
      showGroupFilter
      showStats
      height={520}
    />
  )
}`

export function Home() {
  const heroVisualRef = useRef<HTMLDivElement | null>(null)
  const [copied, setCopied] = useState(false)
  const terminalCode = 'npm i @biki-dev/okve'

  const handleCopyTerminal = async () => {
    try {
      await navigator.clipboard.writeText(terminalCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleHeroMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    event.currentTarget.style.setProperty('--cursor-x', x.toFixed(3))
    event.currentTarget.style.setProperty('--cursor-y', y.toFixed(3))
  }

  const resetHeroParallax = () => {
    heroVisualRef.current?.style.setProperty('--cursor-x', '0')
    heroVisualRef.current?.style.setProperty('--cursor-y', '0')
  }

  return (
    <main className="home">
      <section className="hero-section hero-split">
        <div className="hero-copy reveal-y">
          <p className="hero-kicker">Biki-dev</p>
          <h1>The Build Tool for Graph Interfaces</h1>
          <p>
            OKVE is a blazing fast front-end toolkit for building production knowledge
            graph experiences with smooth interactions and composable controls.
          </p>
          <div className="hero-actions">
            <Link to="/docs/getting-started" className="button button--primary">
              Get Started
            </Link>
            <a
              href="https://github.com/Biki-dev/OKVE"
              target="_blank"
              rel="noreferrer"
              className="button button--secondary"
            >
              View on GitHub
            </a>
          </div>
          <div className="hero-terminal">
            <div className="hero-terminal-tabs">
              <span>npm</span>
            </div>
            <div className="hero-terminal-content">
              <code>{terminalCode}</code>
              <button
                onClick={handleCopyTerminal}
                className="hero-terminal-copy"
                title={copied ? 'Copied!' : 'Copy to clipboard'}
                aria-label="Copy command"
              >
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          ref={heroVisualRef}
          className="hero-visual reveal-y-delay"
          aria-hidden="true"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={resetHeroParallax}
        >
          <div className="hero-graph">
            <svg className="hero-graph-lines" viewBox="0 0 460 320" fill="none" preserveAspectRatio="none">
              <path className="hero-edge hero-edge-soft" d="M84 70 L196 106" />
              <path className="hero-edge hero-edge-main" d="M196 106 L320 80" />
              <path className="hero-edge hero-edge-main" d="M196 106 L256 172" />
              <path className="hero-edge hero-edge-soft" d="M256 172 L354 224" />
              <path className="hero-edge hero-edge-soft" d="M128 236 L256 172" />

              <circle className="hero-joint hero-joint-sm" cx="84" cy="70" r="5" />
              <circle className="hero-joint hero-joint-md" cx="196" cy="106" r="6.5" />
              <circle className="hero-joint hero-joint-sm" cx="320" cy="80" r="5" />
              <circle className="hero-joint hero-joint-md" cx="256" cy="172" r="6.5" />
              <circle className="hero-joint hero-joint-sm" cx="354" cy="224" r="5" />
              <circle className="hero-joint hero-joint-sm" cx="128" cy="236" r="5" />
            </svg>

            <div className="hero-node node-origin">Input</div>
            <div className="hero-node node-core">Core</div>
            <div className="hero-node node-hub">Resolver</div>
            <div className="hero-node node-leaf">Render</div>
            <div className="hero-node node-cache">Cache</div>

            <div className="hero-ping ping-core" />
            <div className="hero-ping ping-hub" />
          </div>
        </div>
      </section>

     

      <section className="panel panel-preview reveal-y">
        <div className="panel-title">Live Preview</div>
        <div className="graph-preview animate-fade-in">
          <KnowledgeGraph data={sampleData} height={440} showSearch showStats />
        </div>
      </section>

      <section className="section-intro reveal-y">
        <h2>Built for interactive knowledge graphs</h2>
        <p>
          OKVE gives you the graph behaviors that matter in production: D3-powered layout,
          zooming, labeled edges, controlled selection, and export tools.
        </p>
      </section>

      <section className="feature-grid feature-grid-2col">
        <article className="feature-card">
          <h3>Force-Directed Layout</h3>
          <p>
            D3 drives the layout so your graph can spread naturally, stay readable, and handle
            denser data without hand-positioning every node.
          </p>
         
        </article>
        <article className="feature-card">
          <h3>Zoom, Pan, and Focus</h3>
          <p>
            The graph supports smooth zooming, panning, controlled selection, and programmatic
            focus so the parent app can guide the view.
          </p>
        
        </article>
        <article className="feature-card">
          <h3>Search, Groups, and Stats</h3>
          <p>
            Enable built-in search input, group filter chips, and the subtle node/edge stats
            overlay when you want a richer exploratory experience.
          </p>
         
        </article>
        <article className="feature-card">
          <h3>PNG Export and Typed Data</h3>
          <p>
            Use the ref API to export a PNG snapshot, while TypeScript keeps your graph schema and
            event handlers honest at compile time.
          </p>
          
        </article>
      </section>

      <section className="section-intro reveal-y">
        <h2>A shared foundation to build on</h2>
      </section>

      <section className="feature-grid feature-grid-2col">
        <article className="feature-card">
          <h3>Flexible Plugin System</h3>
          <p>
            The component is designed to fit into your app state, with controlled props for
            selection and focus, plus room to compose surrounding UI.
          </p>
         
        </article>
        <article className="feature-card">
          <h3>Fully Typed API</h3>
          <p>
            Graph nodes, edges, and handlers are typed, so your data model stays predictable as
            your graph grows.
          </p>
          
        </article>
      </section>

      <section className="panel reveal-y">
        <div className="panel-title">Quick Usage</div>
        <CodeBlock code={quickStart} lang="tsx"/>
      </section>

    
      <section className="panel cta-strip reveal-y">
        <div>
          <h2>Start building with OKVE</h2>
          <p>
            Install the package, pass in JSON graph data, and build an interactive knowledge graph
            experience that matches your product.
          </p>
        </div>
        <Link to="/docs/getting-started" className="button button--primary">
          Get Started
        </Link>
      </section>
    </main>
  )
}
