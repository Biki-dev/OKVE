import { useMemo, useRef, useState } from 'react'
import { KnowledgeGraph, type GraphNode, type KnowledgeGraphHandle } from '@biki-dev/okve'
import { sampleData } from '../../data/sampleData'

function formatMetadataValue(value: unknown) {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.join(', ')
  if (value && typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

export function DemoPage() {
  const graphRef = useRef<KnowledgeGraphHandle | null>(null)
  const [selectedId, setSelectedId] = useState<string | undefined>(sampleData.nodes[0]?.id)
  const [focusNodeId, setFocusNodeId] = useState<string | undefined>(sampleData.nodes[0]?.id)

  const selectedNode = useMemo(
    () => sampleData.nodes.find((node) => node.id === selectedId) ?? null,
    [selectedId],
  )

  const groupedNodes = useMemo(() => {
    const map = new Map<string, GraphNode[]>()
    for (const node of sampleData.nodes) {
      const group = node.group ?? 'ungrouped'
      const list = map.get(group) ?? []
      list.push(node)
      map.set(group, list)
    }
    return Array.from(map.entries())
  }, [])

  return (
    <main className="home demo-page">
      <section className="hero-section demo-hero">
        <div className="demo-hero-copy reveal-y">
          <p className="hero-kicker">Interactive Playground</p>
          <h1>Live Demo</h1>
          <p>
            Explore the graph experience in real time. Filter nodes by group, focus connections,
            inspect metadata, and export snapshots for sharing.
          </p>
        </div>
        <div className="demo-hero-stats reveal-y-delay">
          <article>
            <span>Nodes</span>
            <strong>{sampleData.nodes.length}</strong>
          </article>
          <article>
            <span>Edges</span>
            <strong>{sampleData.edges.length}</strong>
          </article>
          <article>
            <span>Groups</span>
            <strong>{groupedNodes.length}</strong>
          </article>
        </div>
      </section>

      <section className="panel demo-controls">
        <div className="panel-title">Focus Controls</div>
        <div className="demo-controls-body">
        {groupedNodes.map(([group, nodes]) => (
          <div key={group} className="control-group">
            <p className="control-group-title">{group}</p>
            <div className="chip-row">
              {nodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className="chip"
                  onClick={() => {
                    setSelectedId(node.id)
                    setFocusNodeId(node.id)
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
            className="demo-export"
            onClick={() => graphRef.current?.exportAsPNG('okve-demo-graph.png')}
          >
            Export PNG
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">Graph Canvas</div>
        <div className="graph-preview">
          <KnowledgeGraph
            ref={graphRef}
            data={sampleData}
            selectedNodeId={selectedId}
            focusNodeId={focusNodeId}
            showSearch
            showGroupFilter
            showStats
            height={520}
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
      </section>

      <section className="panel demo-selected-panel">
        <div className="panel-title">Selected Node</div>
        <div className="selected-node">
        {selectedNode ? (
          <>
            <p className="selected-node-head">
              <strong>{selectedNode.label}</strong>
              <span>{selectedNode.group ?? 'none'}</span>
            </p>
            <pre>{formatMetadataValue(selectedNode.metadata ?? 'No metadata')}</pre>
          </>
        ) : (
          <p>No node selected.</p>
        )}
        </div>
      </section>
    </main>
  )
}
