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
  const [exportStatus, setExportStatus] = useState<{ tone: 'success' | 'error'; message: string }>({
    tone: 'success',
    message: 'No export attempted yet.',
  })

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

  const selectedNodeDetails = useMemo(() => {
    if (!selectedNode) {
      return 'No node selected.'
    }

    if (!nodeTooltipFields.includes('metadata')) {
      return 'Metadata is hidden by the current tooltip field settings.'
    }

    const metadata = selectedNode.metadata ?? {}
    const filteredMetadata = Object.fromEntries(
      Object.entries(metadata).filter(([key]) => metadataKeys.length === 0 || metadataKeys.includes(key)),
    )

    if (Object.keys(filteredMetadata).length > 0) {
      return formatMetadataValue(filteredMetadata)
    }

    if (Object.keys(metadata).length === 0) {
      return 'No metadata for this node.'
    }

    return 'No metadata matches the selected metadata keys.'
  }, [metadataKeys, nodeTooltipFields, selectedNode])

  const tooltipPreviewRows = useMemo(() => {
    if (!selectedNode) {
      return [] as Array<{ key: string; value: string }>
    }

    const rows: Array<{ key: string; value: string }> = []

    if (nodeTooltipFields.includes('id')) {
      rows.push({ key: 'id', value: selectedNode.id })
    }

    if (nodeTooltipFields.includes('group') && selectedNode.group) {
      rows.push({ key: 'group', value: selectedNode.group })
    }

    if (nodeTooltipFields.includes('size') && typeof selectedNode.size === 'number') {
      rows.push({ key: 'size', value: String(selectedNode.size) })
    }

    if (nodeTooltipFields.includes('metadata') && selectedNode.metadata) {
      for (const [key, value] of Object.entries(selectedNode.metadata)) {
        if (metadataKeys.length > 0 && !metadataKeys.includes(key)) {
          continue
        }

        rows.push({ key, value: formatMetadataValue(value) })
      }
    }

    return rows.slice(0, 6)
  }, [metadataKeys, nodeTooltipFields, selectedNode])

  const showExportStatus = (tone: 'success' | 'error', message: string) => {
    setExportStatus({ tone, message })
  }

  const handleExportPng = () => {
    if (!graphRef.current) {
      showExportStatus('error', 'Export failed. Graph is not ready yet.')
      return
    }

    graphRef.current.exportAsPNG('okve-demo-graph.png')
    showExportStatus('success', 'PNG export started. Check your downloads.')
  }

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
              {(['force', 'radial', 'arc', 'chord'] as const).map((layoutOption) => (
                <button
                  key={layoutOption}
                  type="button"
                  className={`chip ${layout === layoutOption ? 'chip--active' : ''}`}
                  onClick={() => {
                    setLayout(layoutOption as GraphLayout)
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
            onClick={handleExportPng}
          >
            Export PNG
          </button>
          <p
            className={`demo-export-status demo-export-status--${exportStatus.tone}`}
            role="status"
            aria-live="polite"
            data-testid="export-status"
          >
            {exportStatus.message}
          </p>

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
        <div className="panel-title">Node Tooltip Preview</div>
        <div className="selected-node">
          {selectedNode ? (
            <div className="okve-tooltip okve-tooltip--pinned okve-tooltip--preview" data-testid="node-tooltip-preview">
              <div className="okve-tooltip__header">
                <strong className="okve-tooltip__title">{selectedNode.label}</strong>
              </div>
              {nodeTooltipFields.includes('group') && selectedNode.group ? (
                <span className="okve-tooltip__badge">{selectedNode.group}</span>
              ) : null}
              <dl className="okve-tooltip__meta">
                {tooltipPreviewRows.length > 0 ? (
                  tooltipPreviewRows.map((row) => (
                    <div key={`${row.key}-${row.value}`} className="okve-tooltip__meta-row">
                      <dt>{row.key}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))
                ) : (
                  <div className="okve-tooltip__meta-row">
                    <dt>state</dt>
                    <dd>No tooltip fields selected</dd>
                  </div>
                )}
              </dl>
            </div>
          ) : (
            <p>No node selected.</p>
          )}
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
            <pre>{selectedNodeDetails}</pre>
          </>
        ) : (
          <p>No node selected.</p>
        )}
        </div>
      </section>
    </main>
  )
}
