import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'

import type { GraphData, KnowledgeGraphHandle, KnowledgeGraphProps } from '../../types'
import { getGroupColor } from '../../utils/colorPalette'
import { ForceLayout } from '../../layouts/ForceLayout'
import { RadialLayout } from '../../layouts/RadialLayout'
import './KnowledgeGraph.css'

const DEFAULT_WIDTH = 960
const DEFAULT_HEIGHT = 640

function useElementSize(elementRef: RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  })

  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return
    }

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect()

      setSize({
        width: width || DEFAULT_WIDTH,
        height: height || DEFAULT_HEIGHT,
      })
    }

    updateSize()

    const resizeObserver = new ResizeObserver(() => {
      updateSize()
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [elementRef])

  return size
}

function joinClassNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

export const KnowledgeGraph = forwardRef<KnowledgeGraphHandle, KnowledgeGraphProps>(
  function KnowledgeGraph(
    {
      data,
      width = '100%',
      height = 640,
      layout = 'force',
      onNodeClick,
      onEdgeClick,
      selectedNodeId,
      focusNodeId,
      showSearch = false,
      showGroupFilter = false,
      onDeselect,
      showStats = false,
      showTooltips = false,
      tooltipOptions,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [hiddenGroups, setHiddenGroups] = useState<Set<string>>(new Set())
    const [internalFocusNodeId, setInternalFocusNodeId] = useState<string | null>(null)
    const [interactionResetKey, setInteractionResetKey] = useState(0)

    const groups = useMemo(
      () =>
        Array.from(
          new Set(
            data.nodes
              .map((node) => node.group)
              .filter((group): group is string => Boolean(group && group.trim())),
          ),
        ),
      [data.nodes],
    )

    const visibleNodes = useMemo(
      () => data.nodes.filter((node) => !node.group || !hiddenGroups.has(node.group)),
      [data.nodes, hiddenGroups],
    )

    const visibleNodeIdSet = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes])

    const visibleEdges = useMemo(
      () =>
        data.edges.filter(
          (edge) => visibleNodeIdSet.has(edge.source) && visibleNodeIdSet.has(edge.target),
        ),
      [data.edges, visibleNodeIdSet],
    )

    const filteredData = useMemo<GraphData>(() => ({ nodes: visibleNodes, edges: visibleEdges }), [visibleEdges, visibleNodes])

    const { width: renderedWidth, height: renderedHeight } = useElementSize(containerRef)
    const resolvedFocusNodeId = internalFocusNodeId ?? focusNodeId

    const searchResults = useMemo(() => {
      if (!searchQuery.trim()) {
        return []
      }

      const query = searchQuery.toLowerCase()

      return visibleNodes.filter((node) => node.label.toLowerCase().includes(query)).slice(0, 8)
    }, [searchQuery, visibleNodes])

    useImperativeHandle(
      ref,
      () => ({
        exportAsPNG(filename = 'graph.png') {
          const svg = svgRef.current

          if (!svg) {
            return
          }

          const serializer = new XMLSerializer()
          const svgString = serializer.serializeToString(svg)
          const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
          const url = URL.createObjectURL(blob)

          const image = new Image()
          image.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = renderedWidth * 2
            canvas.height = renderedHeight * 2

            const context = canvas.getContext('2d')
            if (!context) {
              URL.revokeObjectURL(url)
              return
            }

            context.scale(2, 2)
            context.drawImage(image, 0, 0, renderedWidth, renderedHeight)
            URL.revokeObjectURL(url)

            try {
              const link = document.createElement('a')
              link.download = filename
              link.href = canvas.toDataURL('image/png')
              link.click()
            } catch (error) {
              console.error('Failed to export PNG:', error)
            }
          }

          image.onerror = () => {
            URL.revokeObjectURL(url)
          }

          image.src = url        },
      }),
      [renderedHeight, renderedWidth],
    )

    useEffect(() => {
      setInternalFocusNodeId(null)
    }, [focusNodeId])

    useEffect(() => {
      const handler = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') {
          return
        }

        setHoveredNodeId(null)
        setInternalFocusNodeId(null)
        setInteractionResetKey((previous) => previous + 1)
        onDeselect?.()
      }

      window.addEventListener('keydown', handler)
      return () => {
        window.removeEventListener('keydown', handler)
      }
    }, [onDeselect])

    const toggleGroup = (group: string) => {
      setHiddenGroups((previous) => {
        const next = new Set(previous)

        if (next.has(group)) {
          next.delete(group)
        } else {
          next.add(group)
        }

        return next
      })
    }

    const LayoutComponent = layout === 'radial' ? RadialLayout : ForceLayout

    return (
      <div
        ref={containerRef}
        className="okve-graph"
        style={{
          width,
          height,
        }}
      >
        {showSearch && (
          <div className="okve-search-bar">
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value)
              }}
              className="okve-search-input"
            />
            {searchResults.length > 0 && (
              <ul className="okve-search-results">
                {searchResults.map((node) => (
                  <li
                    key={node.id}
                    className="okve-search-result-item"
                    onClick={() => {
                      setInternalFocusNodeId(node.id)
                      onNodeClick?.(node)
                    }}
                  >
                    {node.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {showGroupFilter && groups.length > 0 && (
          <div className="okve-group-filter">
            {groups.map((group) => (
              <button
                key={group}
                type="button"
                className={joinClassNames(
                  'okve-group-chip',
                  hiddenGroups.has(group) && 'okve-group-chip--hidden',
                )}
                onClick={() => {
                  toggleGroup(group)
                }}
                style={{ borderColor: getGroupColor(group) }}
              >
                <span className="okve-chip-dot" style={{ background: getGroupColor(group) }} />
                {group}
              </button>
            ))}
          </div>
        )}

        {showStats && (
          <div className="okve-stats" aria-label="Graph stats">
            <span>{data.nodes.length} nodes</span>
            <span>{data.edges.length} edges</span>
          </div>
        )}

        <LayoutComponent
          layout={layout}
          data={filteredData}
          width={renderedWidth}
          height={renderedHeight}
          hoveredNodeId={hoveredNodeId}
          selectedNodeId={selectedNodeId}
          focusNodeId={resolvedFocusNodeId}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onNodeHover={setHoveredNodeId}
          showTooltips={showTooltips}
          tooltipOptions={tooltipOptions}
          svgRef={svgRef}
          interactionResetKey={interactionResetKey}
        />
      </div>
    )
  },
)

KnowledgeGraph.displayName = 'KnowledgeGraph'
