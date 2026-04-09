## [0.5.0] - 2026-04-09

### Added
- Multi-layout architecture with strategy components under `packages/okve/src/layouts`.
- New `layout` prop on `KnowledgeGraph` with `force` (default) and `radial` modes.
- New exported `GraphLayout` type for TypeScript users.
- Full radial tree layout mode with automatic root selection from graph degree.
- BFS-based spanning tree conversion from `GraphData` for radial rendering.
- Curved radial links, concentric depth rings, and arc-aware label rotation.
- Radial mode parity for hover highlight, selection, callbacks, search/focus integration, and tooltips.

## [0.4.0] - 2026-04-08

### Added
- Node hover and click-to-pin tooltip showing label, group, and metadata.
- Edge click tooltip showing source, target, label, and metadata.
- `showTooltips` prop (default `false`) to opt into built-in tooltips.
- Tooltip auto-positioning to stay within graph container bounds.
- `tooltipOptions` prop to configure which fields appear in node and edge tooltips.
- Demo controls to toggle node/edge tooltip fields interactively.

## [0.3.2] - 2026-04-08

### Fixed
- Ensured `KnowledgeGraph` styles are always present for package consumers by injecting core CSS at runtime on first import.
- Prevented unstyled production/deployment renders where extracted library CSS was not automatically loaded by the host app.

### Added
- Exported optional stylesheet subpath `@biki-dev/okve/styles.css` for teams that prefer explicit CSS imports.

## [0.3.0] - 2026-04-07

### Added
- Programmatic camera focus via `focusNodeId`
- Optional in-graph search UI via `showSearch`
- Optional group filter chips via `showGroupFilter`
- Keyboard deselect callback via `onDeselect` (Escape key)
- Optional stats overlay via `showStats`
- Imperative ref handle `KnowledgeGraphHandle` with `exportAsPNG(filename?)`
- Demo controls for focus, filtering, deselect behavior, stats, and PNG export

### Notes
- PNG export quality and SVG style capture across environments will receive additional hardening in a later update.

## v0.2.0 - Richer Nodes & Edges

### Added
- Transparent edge hit targets and clickable edge handlers
- Group-based node colors and optional node sizing
- Edge labels rendered at the midpoint of each edge
- Auto-fit on first render after the simulation settles
- Controlled node selection via `selectedNodeId`
- Demo data updated to showcase labels, groups, and size differences

## [0.1.0] - 2026-04-05

### Added
- `KnowledgeGraph` React component
- Force-directed graph layout via D3
- Zoom and pan support
- Hover highlight with edge traversal
- `onNodeClick` and `onEdgeClick` callbacks
- TypeScript types exported
- MIT License
