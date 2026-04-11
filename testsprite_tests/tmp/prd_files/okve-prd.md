# OKVE Product Requirements

## Product Overview
OKVE is a React component library and documentation site for building interactive knowledge graph experiences from JSON data.

## Primary User Flows
- Visit the homepage to understand the product and copy the install command.
- Open the docs section to read installation, API, examples, and changelog content.
- Open the live demo to explore graph layouts, selection, tooltips, and PNG export.

## Core Requirements
- The homepage must show a live KnowledgeGraph preview and a quick-start install path.
- The docs pages must be navigable through the sidebar and on-page section links.
- The demo must support layout switching across force, radial, arc, and chord modes.
- The demo must allow node selection, focus control, tooltip configuration, and PNG export.
- The site must render in dark theme on load.

## Acceptance Criteria
- Users can navigate to /, /demo, /docs/getting-started, /docs/api-reference, /docs/examples, and /docs/changelog.
- Users can interact with the graph preview and demo without backend requests.
- Users can copy the install command from the homepage.
- Users can export a PNG snapshot from the demo.
- Users can read the API reference and examples for the current KnowledgeGraph props and layout modes.
