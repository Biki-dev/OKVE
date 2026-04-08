import type {
  EdgeTooltipField,
  GraphEdge,
  GraphNode,
  NodeTooltipField,
  TooltipOptions,
} from '../../types'

const DEFAULT_NODE_FIELDS: NodeTooltipField[] = ['id', 'group', 'size', 'metadata']
const DEFAULT_EDGE_FIELDS: EdgeTooltipField[] = ['id', 'label', 'weight', 'directed', 'metadata']

type TooltipProps = {
  type: 'node' | 'edge'
  data: GraphNode | GraphEdge
  x: number
  y: number
  pinned: boolean
  options?: TooltipOptions
  onClose: () => void
}

type MetadataRow = {
  key: string
  value: string
}

function truncateValue(value: unknown) {
  const asString =
    typeof value === 'string'
      ? value
      : Array.isArray(value)
        ? value.join(', ')
        : value && typeof value === 'object'
          ? JSON.stringify(value)
          : String(value)

  if (asString.length <= 40) {
    return asString
  }

  return `${asString.slice(0, 37)}...`
}

function getMetadataRows(
  type: 'node' | 'edge',
  data: GraphNode | GraphEdge,
  options?: TooltipOptions,
): MetadataRow[] {
  const maxRows = Math.max(1, options?.maxRows ?? 6)
  const metadataKeys = options?.metadataKeys

  if (type === 'node') {
    const node = data as GraphNode
    const nodeFields = options?.nodeFields ?? DEFAULT_NODE_FIELDS
    const rows: MetadataRow[] = []

    if (nodeFields.includes('id') && node.id) {
      rows.push({ key: 'id', value: truncateValue(node.id) })
    }

    if (nodeFields.includes('size') && typeof node.size === 'number') {
      rows.push({ key: 'size', value: truncateValue(node.size) })
    }

    if (nodeFields.includes('metadata') && node.metadata) {
      for (const [key, value] of Object.entries(node.metadata)) {
        if (metadataKeys && metadataKeys.length > 0 && !metadataKeys.includes(key)) {
          continue
        }

        rows.push({ key, value: truncateValue(value) })
      }
    }

    return rows.slice(0, maxRows)
  }

  const edge = data as GraphEdge
  const edgeFields = options?.edgeFields ?? DEFAULT_EDGE_FIELDS
  const rows: MetadataRow[] = []

  if (edgeFields.includes('id')) {
    rows.push({ key: 'id', value: truncateValue(edge.id) })
  }

  if (edgeFields.includes('label') && edge.label) {
    rows.push({ key: 'label', value: truncateValue(edge.label) })
  }

  if (edgeFields.includes('weight') && typeof edge.weight === 'number') {
    rows.push({ key: 'weight', value: truncateValue(edge.weight) })
  }

  if (edgeFields.includes('directed') && typeof edge.directed === 'boolean') {
    rows.push({ key: 'directed', value: edge.directed ? 'true' : 'false' })
  }

  if (edgeFields.includes('metadata') && edge.metadata) {
    for (const [key, value] of Object.entries(edge.metadata)) {
      if (metadataKeys && metadataKeys.length > 0 && !metadataKeys.includes(key)) {
        continue
      }

      rows.push({ key, value: truncateValue(value) })
    }
  }

  return rows.slice(0, maxRows)
}

export function Tooltip({ type, data, x, y, pinned, options, onClose }: TooltipProps) {
  const title =
    type === 'node'
      ? (data as GraphNode).label
      : `${(data as GraphEdge).source} -> ${(data as GraphEdge).target}`
  const nodeFields = options?.nodeFields ?? DEFAULT_NODE_FIELDS
  const group =
    type === 'node' && nodeFields.includes('group') ? (data as GraphNode).group : undefined
  const rows = getMetadataRows(type, data, options)

  return (
    <div
      className={`okve-tooltip${pinned ? ' okve-tooltip--pinned' : ''}`}
      style={{ left: `${x}px`, top: `${y}px` }}
      role="status"
      aria-live="polite"
    >
      <div className="okve-tooltip__header">
        <strong className="okve-tooltip__title">{title}</strong>
        {pinned && (
          <button
            type="button"
            className="okve-tooltip__close"
            onClick={onClose}
            aria-label="Close tooltip"
          >
            &times;
          </button>
        )}
      </div>
      {group && <span className="okve-tooltip__badge">{group}</span>}
      <dl className="okve-tooltip__meta">
        {rows.map((row, index) => (
          <div key={`${row.key}-${index}`} className="okve-tooltip__meta-row">
            <dt>{row.key}</dt>
            <dd title={row.value}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
