import { useEffect, useMemo, useRef, useState } from 'react'
import {
  KnowledgeGraph,
  type EdgeTooltipField,
  type GraphData,
  type GraphEdge,
  type GraphLayout,
  type GraphNode,
  type KnowledgeGraphHandle,
  type NodeTooltipField,
  type TooltipOptions,
} from '@biki-dev/okve'
import { sampleData } from '../../data/sampleData'

type EditorStatus = {
  tone: 'success' | 'error'
  message: string
}

type NodeDraft = {
  id: string
  label: string
  group: string
  size: string
}

type EdgeDraft = {
  id: string
  source: string
  target: string
  label: string
  directed: boolean
}

const NODE_FIELDS: NodeTooltipField[] = ['id', 'group', 'size', 'metadata']
const EDGE_FIELDS: EdgeTooltipField[] = ['id', 'label', 'weight', 'directed', 'metadata']

function cloneGraphData(data: GraphData): GraphData {
  return {
    nodes: data.nodes.map((node) => ({
      ...node,
      metadata: node.metadata ? { ...node.metadata } : undefined,
    })),
    edges: data.edges.map((edge) => ({
      ...edge,
      metadata: edge.metadata ? { ...edge.metadata } : undefined,
    })),
  }
}

function getMetadataKeys(data: GraphData) {
  return Array.from(
    new Set([
      ...data.nodes.flatMap((node) => Object.keys(node.metadata ?? {})),
      ...data.edges.flatMap((edge) => Object.keys(edge.metadata ?? {})),
    ]),
  )
}

function createNodeDraft(nodes: GraphNode[]): NodeDraft {
  return {
    id: `node-${nodes.length + 1}`,
    label: '',
    group: '',
    size: '1',
  }
}

function createEdgeDraft(data: GraphData): EdgeDraft {
  const [firstNode, secondNode] = data.nodes

  return {
    id: `edge-${data.edges.length + 1}`,
    source: firstNode?.id ?? '',
    target: secondNode?.id ?? firstNode?.id ?? '',
    label: '',
    directed: true,
  }
}

function parsePositiveNumber(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function formatMetadataValue(value: unknown) {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.join(', ')
  if (value && typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

function formatTimestampForFilename(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}-${hours}${minutes}${seconds}`
}

export function DemoPage() {
  const graphRef = useRef<KnowledgeGraphHandle | null>(null)
  const [graphData, setGraphData] = useState<GraphData>(() => cloneGraphData(sampleData))
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(sampleData.nodes[0]?.id)
  const [focusNodeId, setFocusNodeId] = useState<string | undefined>(sampleData.nodes[0]?.id)
  const [layout, setLayout] = useState<GraphLayout>('force')
  const [nodeTooltipFields, setNodeTooltipFields] = useState<NodeTooltipField[]>(NODE_FIELDS)
  const [edgeTooltipFields, setEdgeTooltipFields] = useState<EdgeTooltipField[]>(EDGE_FIELDS)
  const [metadataKeys, setMetadataKeys] = useState<string[]>(() => getMetadataKeys(sampleData))
  const [selectedNodeDraft, setSelectedNodeDraft] = useState<NodeDraft | null>(null)
  const [newNodeDraft, setNewNodeDraft] = useState<NodeDraft>(() => createNodeDraft(sampleData.nodes))
  const [newEdgeDraft, setNewEdgeDraft] = useState<EdgeDraft>(() => createEdgeDraft(sampleData))
  const [exportStatus, setExportStatus] = useState<{ tone: 'success' | 'error'; message: string }>({
    tone: 'success',
    message: 'No export attempted yet.',
  })
  const [editorStatus, setEditorStatus] = useState<EditorStatus>({
    tone: 'success',
    message: 'Start by adding a node, or select one to edit it live.',
  })

  const selectedNode = useMemo(
    () => graphData.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [graphData.nodes, selectedNodeId],
  )

  const groupedNodes = useMemo(() => {
    const map = new Map<string, GraphNode[]>()
    for (const node of graphData.nodes) {
      const group = node.group ?? 'ungrouped'
      const list = map.get(group) ?? []
      list.push(node)
      map.set(group, list)
    }
    return Array.from(map.entries())
  }, [graphData.nodes])

  const availableMetadataKeys = useMemo(() => getMetadataKeys(graphData), [graphData])

  const tooltipOptions = useMemo<TooltipOptions>(
    () => ({
      nodeFields: nodeTooltipFields,
      edgeFields: edgeTooltipFields,
      metadataKeys,
      maxRows: 6,
    }),
    [edgeTooltipFields, metadataKeys, nodeTooltipFields],
  )

  useEffect(() => {
    setMetadataKeys((previous) => previous.filter((key) => availableMetadataKeys.includes(key)))
  }, [availableMetadataKeys])

  useEffect(() => {
    if (graphData.nodes.length === 0) {
      setSelectedNodeId(undefined)
      setFocusNodeId(undefined)
      return
    }

    if (selectedNodeId && graphData.nodes.some((node) => node.id === selectedNodeId)) {
      return
    }

    const fallbackId = graphData.nodes[0]?.id
    setSelectedNodeId(fallbackId)
    setFocusNodeId(fallbackId)
  }, [graphData.nodes, selectedNodeId])

  useEffect(() => {
    if (!selectedNode) {
      setSelectedNodeDraft(null)
      return
    }

    setSelectedNodeDraft({
      id: selectedNode.id,
      label: selectedNode.label,
      group: selectedNode.group ?? '',
      size: String(selectedNode.size ?? 1),
    })
  }, [selectedNode])

  useEffect(() => {
    setNewEdgeDraft((previous) => {
      if (graphData.nodes.length === 0) {
        return {
          ...previous,
          source: '',
          target: '',
        }
      }

      const sourceExists = graphData.nodes.some((node) => node.id === previous.source)
      const targetExists = graphData.nodes.some((node) => node.id === previous.target)

      if (sourceExists && targetExists) {
        return previous
      }

      return createEdgeDraft(graphData)
    })
  }, [graphData])

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

  const showEditorStatus = (tone: EditorStatus['tone'], message: string) => {
    setEditorStatus({ tone, message })
  }

  const resetGraph = () => {
    const nextGraph = cloneGraphData(sampleData)
    setGraphData(nextGraph)
    setSelectedNodeId(nextGraph.nodes[0]?.id)
    setFocusNodeId(nextGraph.nodes[0]?.id)
    setNewNodeDraft(createNodeDraft(nextGraph.nodes))
    setNewEdgeDraft(createEdgeDraft(nextGraph))
    setEditorStatus({ tone: 'success', message: 'Graph reset to the sample dataset.' })
  }

  const addNode = () => {
    const id = newNodeDraft.id.trim()
    const label = newNodeDraft.label.trim()
    const group = newNodeDraft.group.trim()

    if (!id) {
      showEditorStatus('error', 'Node ID is required.')
      return
    }

    if (!label) {
      showEditorStatus('error', 'Node label cannot be empty.')
      return
    }

    if (graphData.nodes.some((node) => node.id === id)) {
      showEditorStatus('error', `Node ID ${id} already exists.`)
      return
    }

    const nextNode: GraphNode = {
      id,
      label,
      group: group || undefined,
      size: parsePositiveNumber(newNodeDraft.size),
    }

    const nextGraph = {
      nodes: [...graphData.nodes, nextNode],
      edges: graphData.edges,
    }

    setGraphData(nextGraph)
    setSelectedNodeId(id)
    setFocusNodeId(id)
    setNewNodeDraft(createNodeDraft(nextGraph.nodes))
    showEditorStatus('success', `Added node ${label}.`)
  }

  const saveSelectedNode = () => {
    if (!selectedNodeDraft) {
      return
    }

    const label = selectedNodeDraft.label.trim()
    const group = selectedNodeDraft.group.trim()

    if (!label) {
      showEditorStatus('error', 'Node label cannot be empty.')
      return
    }

    setGraphData((previous) => ({
      nodes: previous.nodes.map((node) =>
        node.id === selectedNodeDraft.id
          ? {
              ...node,
              label,
              group: group || undefined,
              size: parsePositiveNumber(selectedNodeDraft.size),
            }
          : node,
      ),
      edges: previous.edges,
    }))

    showEditorStatus('success', `Updated node ${selectedNodeDraft.id}.`)
  }

  const deleteNode = (nodeId: string) => {
    const removedEdges = graphData.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId)

    setGraphData((previous) => ({
      nodes: previous.nodes.filter((node) => node.id !== nodeId),
      edges: previous.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    }))

    showEditorStatus('success', `Deleted node ${nodeId} and ${removedEdges.length} connected edge(s).`)
  }

  const addEdge = () => {
    const id = newEdgeDraft.id.trim()
    const source = newEdgeDraft.source.trim()
    const target = newEdgeDraft.target.trim()
    const label = newEdgeDraft.label.trim()

    if (graphData.nodes.length < 2) {
      showEditorStatus('error', 'Add at least two nodes before creating an edge.')
      return
    }

    if (!id) {
      showEditorStatus('error', 'Edge ID is required.')
      return
    }

    if (!source || !target) {
      showEditorStatus('error', 'Choose both edge endpoints.')
      return
    }

    if (source === target) {
      showEditorStatus('error', 'Edge source and target must be different nodes.')
      return
    }

    if (graphData.edges.some((edge) => edge.id === id)) {
      showEditorStatus('error', `Edge ID ${id} already exists.`)
      return
    }

    if (!graphData.nodes.some((node) => node.id === source) || !graphData.nodes.some((node) => node.id === target)) {
      showEditorStatus('error', 'Edge endpoints must reference existing nodes.')
      return
    }

    const nextEdge: GraphEdge = {
      id,
      source,
      target,
      label: label || undefined,
      directed: newEdgeDraft.directed,
    }

    const nextGraph = {
      nodes: graphData.nodes,
      edges: [...graphData.edges, nextEdge],
    }

    setGraphData(nextGraph)
    setNewEdgeDraft(createEdgeDraft(nextGraph))
    showEditorStatus('success', `Added edge ${source} → ${target}.`)
  }

  const updateEdge = (edgeId: string, patch: Partial<GraphEdge>) => {
    const currentEdge = graphData.edges.find((edge) => edge.id === edgeId)

    if (!currentEdge) {
      return
    }

    const nextEdge = { ...currentEdge, ...patch }

    if (!graphData.nodes.some((node) => node.id === nextEdge.source) || !graphData.nodes.some((node) => node.id === nextEdge.target)) {
      showEditorStatus('error', 'Edge endpoints must reference existing nodes.')
      return
    }

    if (nextEdge.source === nextEdge.target) {
      showEditorStatus('error', 'Edge source and target must be different nodes.')
      return
    }

    setGraphData((previous) => ({
      nodes: previous.nodes,
      edges: previous.edges.map((edge) => (edge.id === edgeId ? nextEdge : edge)),
    }))
  }

  const deleteEdge = (edgeId: string) => {
    setGraphData((previous) => ({
      nodes: previous.nodes,
      edges: previous.edges.filter((edge) => edge.id !== edgeId),
    }))

    showEditorStatus('success', `Deleted edge ${edgeId}.`)
  }

  const nodeCount = graphData.nodes.length
  const edgeCount = graphData.edges.length

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

  const handleExportJson = () => {
    try {
      const now = new Date()
      const fileName = `okve-demo-state-${formatTimestampForFilename(now)}.json`
      const payload = {
        exportedAt: now.toISOString(),
        ...cloneGraphData(graphData),
        settings: {
          layout,
          selectedNodeId,
          focusNodeId,
          tooltip: {
            nodeFields: [...nodeTooltipFields],
            edgeFields: [...edgeTooltipFields],
            metadataKeys: [...metadataKeys],
            maxRows: tooltipOptions.maxRows,
          },
        },
      }

      const json = JSON.stringify(payload, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      URL.revokeObjectURL(url)

      showExportStatus('success', `JSON export complete: ${fileName}`)
    } catch {
      showExportStatus('error', 'JSON export failed. Please try again.')
    }
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
            Explore the graph experience in real time. Add nodes and edges, edit labels in place,
            delete connected structure, and export snapshots for sharing.
          </p>
        </div>
        <div className="demo-hero-stats reveal-y-delay">
          <article>
            <span>Nodes</span>
            <strong>{nodeCount}</strong>
          </article>
          <article>
            <span>Edges</span>
            <strong>{edgeCount}</strong>
          </article>
          <article>
            <span>Groups</span>
            <strong>{groupedNodes.length}</strong>
          </article>
        </div>
      </section>

      <div className="demo-workspace-grid">
        <section className="panel demo-controls demo-editor-panel">
          <div className="panel-title">Live Graph Editor</div>
          <div className="demo-controls-body">
            <div className="demo-editor-grid">
            <form
              className="demo-form demo-form--accent"
              onSubmit={(event) => {
                event.preventDefault()
                addNode()
              }}
            >
              <div className="control-group">
                <p className="control-group-title">Add node</p>
                <div className="demo-form-grid">
                  <label className="demo-field">
                    <span>ID</span>
                    <input
                      className="demo-input"
                      value={newNodeDraft.id}
                      onChange={(event) => {
                        setNewNodeDraft((previous) => ({ ...previous, id: event.target.value }))
                      }}
                      placeholder="node-6"
                    />
                  </label>
                  <label className="demo-field">
                    <span>Label</span>
                    <input
                      className="demo-input"
                      value={newNodeDraft.label}
                      onChange={(event) => {
                        setNewNodeDraft((previous) => ({ ...previous, label: event.target.value }))
                      }}
                      placeholder="New concept"
                    />
                  </label>
                  <label className="demo-field">
                    <span>Group</span>
                    <input
                      className="demo-input"
                      value={newNodeDraft.group}
                      onChange={(event) => {
                        setNewNodeDraft((previous) => ({ ...previous, group: event.target.value }))
                      }}
                      placeholder="frontend"
                    />
                  </label>
                  <label className="demo-field">
                    <span>Size</span>
                    <input
                      className="demo-input"
                      inputMode="decimal"
                      value={newNodeDraft.size}
                      onChange={(event) => {
                        setNewNodeDraft((previous) => ({ ...previous, size: event.target.value }))
                      }}
                      placeholder="1"
                    />
                  </label>
                </div>
              </div>
              <div className="demo-form-actions">
                <button type="submit" className="demo-export">
                  Add node
                </button>
              </div>
            </form>

            <form
              className="demo-form"
              onSubmit={(event) => {
                event.preventDefault()
                addEdge()
              }}
            >
              <div className="control-group">
                <p className="control-group-title">Add edge</p>
                <div className="demo-form-grid demo-form-grid--edge">
                  <label className="demo-field">
                    <span>ID</span>
                    <input
                      className="demo-input"
                      value={newEdgeDraft.id}
                      onChange={(event) => {
                        setNewEdgeDraft((previous) => ({ ...previous, id: event.target.value }))
                      }}
                      placeholder="edge-5"
                    />
                  </label>
                  <label className="demo-field">
                    <span>Source</span>
                    <select
                      className="demo-input demo-select"
                      value={newEdgeDraft.source}
                      disabled={nodeCount < 2}
                      onChange={(event) => {
                        setNewEdgeDraft((previous) => ({ ...previous, source: event.target.value }))
                      }}
                    >
                      {graphData.nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="demo-field">
                    <span>Target</span>
                    <select
                      className="demo-input demo-select"
                      value={newEdgeDraft.target}
                      disabled={nodeCount < 2}
                      onChange={(event) => {
                        setNewEdgeDraft((previous) => ({ ...previous, target: event.target.value }))
                      }}
                    >
                      {graphData.nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="demo-field">
                    <span>Label</span>
                    <input
                      className="demo-input"
                      value={newEdgeDraft.label}
                      onChange={(event) => {
                        setNewEdgeDraft((previous) => ({ ...previous, label: event.target.value }))
                      }}
                      placeholder="depends on"
                    />
                  </label>
                  <label className="demo-toggle">
                    <input
                      type="checkbox"
                      checked={newEdgeDraft.directed}
                      onChange={(event) => {
                        setNewEdgeDraft((previous) => ({ ...previous, directed: event.target.checked }))
                      }}
                    />
                    <span>Directed edge</span>
                  </label>
                </div>
              </div>
              <div className="demo-form-actions">
                <button type="submit" className="demo-export" disabled={nodeCount < 2}>
                  Add edge
                </button>
              </div>
            </form>

            <div className="demo-library">
              <div className="control-group">
                <p className="control-group-title">Nodes</p>
                <div className="demo-list" data-testid="node-list">
                  {graphData.nodes.length > 0 ? (
                    graphData.nodes.map((node) => (
                      <article key={node.id} className="demo-list-item">
                        <button
                          type="button"
                          className="demo-list-item__select"
                          onClick={() => {
                            setSelectedNodeId(node.id)
                            setFocusNodeId(node.id)
                          }}
                        >
                          <strong>{node.label}</strong>
                          <span>{node.group ?? 'ungrouped'}</span>
                        </button>
                        <button
                          type="button"
                          className="demo-list-item__delete"
                          onClick={() => {
                            deleteNode(node.id)
                          }}
                        >
                          Delete
                        </button>
                      </article>
                    ))
                  ) : (
                    <p className="demo-list-empty">No nodes yet. Add one to bring the graph back.</p>
                  )}
                </div>
              </div>

              <div className="control-group">
                <p className="control-group-title">Edges</p>
                <div className="demo-list demo-list--edges" data-testid="edge-list">
                  {graphData.edges.length > 0 ? (
                    graphData.edges.map((edge) => (
                      <article key={edge.id} className="demo-list-item demo-list-item--edge">
                        <div className="demo-list-item__header">
                          <strong>{edge.id}</strong>
                          <button
                            type="button"
                            className="demo-list-item__delete"
                            onClick={() => {
                              deleteEdge(edge.id)
                            }}
                          >
                            Delete
                          </button>
                        </div>
                        <div className="demo-form-grid demo-form-grid--edge demo-form-grid--edge-edit">
                          <label className="demo-field">
                            <span>Source</span>
                            <select
                              className="demo-input demo-select"
                              value={edge.source}
                              onChange={(event) => {
                                updateEdge(edge.id, { source: event.target.value })
                              }}
                            >
                              {graphData.nodes.map((node) => (
                                <option key={node.id} value={node.id}>
                                  {node.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="demo-field">
                            <span>Target</span>
                            <select
                              className="demo-input demo-select"
                              value={edge.target}
                              onChange={(event) => {
                                updateEdge(edge.id, { target: event.target.value })
                              }}
                            >
                              {graphData.nodes.map((node) => (
                                <option key={node.id} value={node.id}>
                                  {node.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="demo-field demo-field--full">
                            <span>Label</span>
                            <input
                              className="demo-input"
                              value={edge.label ?? ''}
                              onChange={(event) => {
                                updateEdge(edge.id, { label: event.target.value })
                              }}
                              placeholder="relationship label"
                            />
                          </label>
                          <label className="demo-toggle demo-toggle--inline">
                            <input
                              type="checkbox"
                              checked={edge.directed ?? false}
                              onChange={(event) => {
                                updateEdge(edge.id, { directed: event.target.checked })
                              }}
                            />
                            <span>Directed</span>
                          </label>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="demo-list-empty">No edges yet. Connect two nodes to create one.</p>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="demo-export demo-export--secondary"
                onClick={resetGraph}
              >
                Reset sample graph
              </button>

              <button type="button" className="demo-export demo-export--secondary" onClick={handleExportPng}>
                Export PNG
              </button>

              <button type="button" className="demo-export demo-export--secondary" onClick={handleExportJson}>
                Export JSON
              </button>
              <p
                className={`demo-export-status demo-export-status--${exportStatus.tone}`}
                role="status"
                aria-live="polite"
                data-testid="export-status"
              >
                {exportStatus.message}
              </p>
            </div>

            <div className="tooltip-controls">
              <p className="tooltip-controls-title">Layout</p>
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
                {availableMetadataKeys.length > 0 ? (
                  availableMetadataKeys.map((key) => (
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
                  ))
                ) : (
                  <span className="demo-inline-hint">No metadata keys are available.</span>
                )}
              </div>
            </div>

            <p
              className={`demo-editor-status demo-editor-status--${editorStatus.tone}`}
              role="status"
              aria-live="polite"
              data-testid="editor-status"
            >
              {editorStatus.message}
            </p>

            <div className="demo-library demo-library--inspectors">
              <div className="control-group">
                <p className="control-group-title">Selected node</p>
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
                  {selectedNode && selectedNodeDraft ? (
                    <div className="demo-selected-editor" data-testid="selected-node-editor">
                      <div className="demo-form-grid demo-form-grid--selected">
                        <label className="demo-field">
                          <span>ID</span>
                          <input className="demo-input" value={selectedNodeDraft.id} disabled />
                        </label>
                        <label className="demo-field">
                          <span>Label</span>
                          <input
                            className="demo-input"
                            value={selectedNodeDraft.label}
                            onChange={(event) => {
                              setSelectedNodeDraft((previous) =>
                                previous ? { ...previous, label: event.target.value } : previous,
                              )
                            }}
                          />
                        </label>
                        <label className="demo-field">
                          <span>Group</span>
                          <input
                            className="demo-input"
                            value={selectedNodeDraft.group}
                            onChange={(event) => {
                              setSelectedNodeDraft((previous) =>
                                previous ? { ...previous, group: event.target.value } : previous,
                              )
                            }}
                          />
                        </label>
                        <label className="demo-field">
                          <span>Size</span>
                          <input
                            className="demo-input"
                            inputMode="decimal"
                            value={selectedNodeDraft.size}
                            onChange={(event) => {
                              setSelectedNodeDraft((previous) =>
                                previous ? { ...previous, size: event.target.value } : previous,
                              )
                            }}
                          />
                        </label>
                      </div>

                      <div className="demo-form-actions">
                        <button type="button" className="demo-export" onClick={saveSelectedNode}>
                          Save node
                        </button>
                        <button
                          type="button"
                          className="demo-export demo-export--secondary"
                          onClick={() => {
                            deleteNode(selectedNode.id)
                          }}
                        >
                          Delete node
                        </button>
                      </div>

                      <p className="demo-inline-hint">Click a node on the canvas or in the list to edit it here.</p>
                      <pre>{selectedNodeDetails}</pre>
                    </div>
                  ) : (
                    <p>{graphData.nodes.length === 0 ? 'Add a node to start editing.' : 'No node selected.'}</p>
                  )}
                </div>
              </div>

              <div className="control-group">
                <p className="control-group-title">Node tooltip preview</p>
                <div className="selected-node">
                  {selectedNode ? (
                    <div
                      className="okve-tooltip okve-tooltip--pinned okve-tooltip--preview"
                      data-testid="node-tooltip-preview"
                    >
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
              </div>
            </div>
          </div>
          </div>
        </section>

        <section className="panel demo-canvas-panel">
          <div className="panel-title">Graph Canvas</div>
          <div className="graph-preview graph-preview--editor">
            {graphData.nodes.length === 0 ? (
              <div className="demo-empty-state" data-testid="graph-empty-state">
                <p className="demo-empty-state__eyebrow">Empty graph</p>
                <h2>All nodes have been deleted.</h2>
                <p>Add a node to restore the graph and reconnect it with edges.</p>
                <button type="button" className="demo-export" onClick={resetGraph}>
                  Restore sample graph
                </button>
              </div>
            ) : null}
            <KnowledgeGraph
              ref={graphRef}
              data={graphData}
              layout={layout}
              selectedNodeId={selectedNodeId}
              focusNodeId={focusNodeId}
              showSearch
              showGroupFilter
              showStats
              showTooltips
              tooltipOptions={tooltipOptions}
              height={520}
              onNodeClick={(node: GraphNode) => {
                setSelectedNodeId(node.id)
                setFocusNodeId(node.id)
              }}
              onDeselect={() => {
                setSelectedNodeId(undefined)
                setFocusNodeId(undefined)
              }}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
