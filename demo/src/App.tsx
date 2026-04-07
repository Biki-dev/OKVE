import { useMemo, useRef, useState } from 'react'

import { KnowledgeGraph, type GraphNode, type KnowledgeGraphHandle } from 'okve'

import { sampleData } from './sampleData'
import './App.css'

function formatMetadataValue(value: unknown) {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  if (value && typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }

  return String(value)
}

function App() {
  const graphRef = useRef<KnowledgeGraphHandle | null>(null)
  const [selectedId, setSelectedId] = useState<string | undefined>(sampleData.nodes[1]?.id)
  const [focusNodeId, setFocusNodeId] = useState<string | undefined>(sampleData.nodes[1]?.id)

  const selectedNode = useMemo(
    () => sampleData.nodes.find((node) => node.id === selectedId) ?? null,
    [selectedId],
  )

  const selectedMetadata = useMemo(() => {
    const metadataEntries = Object.entries(selectedNode?.metadata ?? {})

    return metadataEntries.map(([key, value]) => ({
      key,
      value: formatMetadataValue(value),
    }))
  }, [selectedNode])

  const groupedNodes = useMemo(() => {
    const map = new Map<string, GraphNode[]>()

    for (const node of sampleData.nodes) {
      const groupName = node.group ?? 'ungrouped'
      const list = map.get(groupName) ?? []
      list.push(node)
      map.set(groupName, list)
    }

    return Array.from(map.entries())
  }, [])

  return (
    <main className="demo-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Open Knowledge Visualization Engine</p>
          <h1>One reusable React graph component, tuned for shipping.</h1>
          <p className="hero-text">
            Install OKVE, pass JSON data into <strong>KnowledgeGraph</strong>, and get a working interactive graph with zoom, pan, and node-level callbacks.
          </p>
          <div className="hero-stats">
            <span>{sampleData.nodes.length} nodes</span>
            <span>{sampleData.edges.length} edges</span>
            <span>Hover to highlight paths</span>
          </div>
        </div>
        <div className="hero-note">
          <p>Use this demo as the default screenshot for the README.</p>
          <p>Click a node to inspect metadata. Press Escape to trigger deselect callback.</p>
        </div>
      </section>

      <section className="control-panel" aria-label="Demo controls">
        <div className="control-copy">
          <p className="details-label">Programmatic Focus</p>
          <p className="details-copy">Pick a node and the camera will fly to it using focusNodeId.</p>
        </div>

        <div className="control-actions">
          {groupedNodes.map(([group, nodes]) => (
            <div key={group} className="focus-group">
              <span>{group}</span>
              <div className="focus-buttons">
                {nodes.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    className="focus-button"
                    onClick={() => {
                      setFocusNodeId(node.id)
                      setSelectedId(node.id)
                    }}
                  >
                    {node.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            className="export-button"
            onClick={() => {
              graphRef.current?.exportAsPNG('okve-demo-graph.png')
            }}
          >
            Export PNG
          </button>
        </div>
      </section>

      <section className="content-grid">
        <div className="graph-card">
          <KnowledgeGraph
            ref={graphRef}
            data={sampleData}
            selectedNodeId={selectedId}
            focusNodeId={focusNodeId}
            showSearch
            showGroupFilter
            showStats
            width="100%"
            height="100%"
            onNodeClick={(node) => {
              setSelectedId(node.id)
              setFocusNodeId(node.id)
            }}
            onDeselect={() => {
              setSelectedId(undefined)
              setFocusNodeId(undefined)
            }}
          />
        </div>

        <aside className="details-card">
          <p className="details-label">Selected node</p>
          {selectedNode ? (
            <>
              <h2>{selectedNode.label}</h2>
              <p className="details-id">{selectedNode.id}</p>
              <p className="details-copy">
                {formatMetadataValue(selectedNode.metadata?.description ?? 'No description provided.')}
              </p>

              <dl className="details-list">
                <div>
                  <dt>Group</dt>
                  <dd>{selectedNode.group ?? 'None'}</dd>
                </div>
                {selectedMetadata.map((entry) => (
                  <div key={entry.key}>
                    <dt>{entry.key}</dt>
                    <dd>{entry.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <p className="details-copy">Click a node to inspect its metadata.</p>
          )}
        </aside>
      </section>
    </main>
  )
}

export default App
