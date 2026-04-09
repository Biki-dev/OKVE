import { useMemo, useRef, useState } from 'react'
import {
  KnowledgeGraph,
  type EdgeTooltipField,
  type GraphLayout,
  type GraphNode,
  type KnowledgeGraphHandle,
  type NodeTooltipField,
  type TooltipOptions,
} from '@biki-dev/okve'
import { sampleData } from '../../data/sampleData'

const NODE_FIELDS: NodeTooltipField[] = ['id', 'group', 'size', 'metadata']
const EDGE_FIELDS: EdgeTooltipField[] = ['id', 'label', 'weight', 'directed', 'metadata']
const METADATA_KEYS = Array.from(
  new Set([
    ...sampleData.nodes.flatMap((node) => Object.keys(node.metadata ?? {})),
    ...sampleData.edges.flatMap((edge) => Object.keys(edge.metadata ?? {})),
  ]),
)

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
  const [layout, setLayout] = useState<GraphLayout>('force')
  const [nodeTooltipFields, setNodeTooltipFields] = useState<NodeTooltipField[]>(NODE_FIELDS)
  const [edgeTooltipFields, setEdgeTooltipFields] = useState<EdgeTooltipField[]>(EDGE_FIELDS)
  const [metadataKeys, setMetadataKeys] = useState<string[]>(METADATA_KEYS)

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

  const tooltipOptions = useMemo<TooltipOptions>(
    () => ({
      nodeFields: nodeTooltipFields,
      edgeFields: edgeTooltipFields,
      metadataKeys,
      maxRows: 6,
    }),
    [edgeTooltipFields, metadataKeys, nodeTooltipFields],
  )

  const toggleNodeField = (field: NodeTooltipField) => {
    setNodeTooltipFields((previous) =>
      previous.includes(field) ? previous.filter((value) => value !== field) : [...previous, field],
    )
  }

  const toggleEdgeField = (field: EdgeTooltipField) => {
    setEdgeTooltipFields((previous) =>
      previous.includes(field) ? previous.filter((value) => value !== field) : [...previous, field],
    )
  }

  const toggleMetadataKey = (key: string) => {
    setMetadataKeys((previous) =>
      previous.includes(key) ? previous.filter((value) => value !== key) : [...previous, key],
    )
  }

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
        <div className="panel-title">Focus and Tooltip Controls</div>
        <div className="demo-controls-body">
          <div className="control-group">
            <p className="control-group-title">Layout</p>
            <div className="chip-row">
              {(['force', 'radial'] as const).map((layoutOption) => (
                <button
                  key={layoutOption}
                  type="button"
                  className={`chip ${layout === layoutOption ? 'chip--active' : ''}`}
                  onClick={() => {
                    setLayout(layoutOption)
                  }}
                >
                  {layoutOption}
                </button>
              ))}
            </div>
          </div>
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

          <div className="tooltip-controls">
            <p className="tooltip-controls-title">Node tooltip fields</p>
            <div className="chip-row">
              {NODE_FIELDS.map((field) => (
                <button
                  key={`node-${field}`}
                  type="button"
                  className={`chip ${nodeTooltipFields.includes(field) ? 'chip--active' : ''}`}
                  onClick={() => {
                    toggleNodeField(field)
                  }}
                >
                  {field}
                </button>
              ))}
            </div>

            <p className="tooltip-controls-title">Edge tooltip fields</p>
            <div className="chip-row">
              {EDGE_FIELDS.map((field) => (
                <button
                  key={`edge-${field}`}
                  type="button"
                  className={`chip ${edgeTooltipFields.includes(field) ? 'chip--active' : ''}`}
                  onClick={() => {
                    toggleEdgeField(field)
                  }}
                >
                  {field}
                </button>
              ))}
            </div>

            <p className="tooltip-controls-title">Metadata keys</p>
            <div className="chip-row">
              {METADATA_KEYS.map((key) => (
                <button
                  key={`metadata-${key}`}
                  type="button"
                  className={`chip ${metadataKeys.includes(key) ? 'chip--active' : ''}`}
                  onClick={() => {
                    toggleMetadataKey(key)
                  }}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">Graph Canvas</div>
        <div className="graph-preview">
          <KnowledgeGraph
            ref={graphRef}
            data={sampleData}
            layout={layout}
            selectedNodeId={selectedId}
            focusNodeId={focusNodeId}
            showSearch
            showGroupFilter
            showStats
            showTooltips
            tooltipOptions={tooltipOptions}
            height={520}
            onNodeClick={(node: GraphNode) => {
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
