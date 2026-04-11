# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** OKVE
- **Date:** 2026-04-11
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

### Requirement: Homepage overview and quick start
- **Description:** Introduce the product, show the live KnowledgeGraph preview, and provide a primary path into the docs.

#### Test TC001 Evaluate homepage preview and reach Getting Started docs
- **Test Code:** [TC001_Evaluate_homepage_preview_and_reach_Getting_Started_docs.py](./TC001_Evaluate_homepage_preview_and_reach_Getting_Started_docs.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/82269e6b-b9cb-43ab-bc82-874e71b0b0f1
- **Status:** ✅ Passed
- **Analysis / Findings:** The homepage rendered its live preview successfully and the Get Started action navigated to the Getting Started docs page.

#### Test TC004 Homepage KnowledgeGraph preview renders without crashing
- **Test Code:** [TC004_Homepage_KnowledgeGraph_preview_renders_without_crashing.py](./TC004_Homepage_KnowledgeGraph_preview_renders_without_crashing.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/c22984f4-a9ac-4f6e-9cc9-674d1a0c5a5d
- **Status:** ✅ Passed
- **Analysis / Findings:** The hero KnowledgeGraph preview rendered from static sample data and remained interactive without crashing.

### Requirement: Documentation browser
- **Description:** Provide navigable docs pages with sidebar navigation, in-page section links, and reference content.

#### Test TC002 Docs index redirects to Getting Started
- **Test Code:** [TC002_Docs_index_redirects_to_Getting_Started.py](./TC002_Docs_index_redirects_to_Getting_Started.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/8e62b0f5-e01f-4c20-a502-aff2a8e56d3c
- **Status:** ✅ Passed
- **Analysis / Findings:** Visiting /docs redirected into the Getting Started page and showed the expected installation guidance.

#### Test TC015 Navigate docs via sidebar from Getting Started to API Reference
- **Test Code:** [TC015_Navigate_docs_via_sidebar_from_Getting_Started_to_API_Reference.py](./TC015_Navigate_docs_via_sidebar_from_Getting_Started_to_API_Reference.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/2f45a33a-e9b2-4906-9702-1fd684efd6ed
- **Status:** ✅ Passed
- **Analysis / Findings:** The sidebar navigation worked and the API Reference page displayed the expected prop documentation.

### Requirement: Dark theme initialization
- **Description:** Apply and persist dark theme across the site on load and during navigation.

#### Test TC003 Homepage renders in dark theme by default
- **Test Code:** [TC003_Homepage_renders_in_dark_theme_by_default.py](./TC003_Homepage_renders_in_dark_theme_by_default.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/58dabdf4-2b2f-4eff-b22e-ff08c19a996c
- **Status:** ✅ Passed
- **Analysis / Findings:** The homepage loaded with dark theme applied automatically.

#### Test TC005 Demo page renders in dark theme by default
- **Test Code:** [TC005_Demo_page_renders_in_dark_theme_by_default.py](./TC005_Demo_page_renders_in_dark_theme_by_default.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/b97f1b04-c0ca-4536-a17c-df2f1916e3c3
- **Status:** ✅ Passed
- **Analysis / Findings:** The demo page loaded with the dark theme already applied.

#### Test TC006 Docs Getting Started renders in dark theme by default
- **Test Code:** [TC006_Docs_Getting_Started_renders_in_dark_theme_by_default.py](./TC006_Docs_Getting_Started_renders_in_dark_theme_by_default.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/c42a6f7e-16d6-4715-a03a-68819923f0cf
- **Status:** ✅ Passed
- **Analysis / Findings:** The Getting Started page rendered in dark theme as expected.

#### Test TC012 Dark theme persists when navigating from homepage to demo
- **Test Code:** [TC012_Dark_theme_persists_when_navigating_from_homepage_to_demo.py](./TC012_Dark_theme_persists_when_navigating_from_homepage_to_demo.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/28452aed-40e9-4716-a33b-0f2531b79a2e
- **Status:** ✅ Passed
- **Analysis / Findings:** Dark theme remained applied after moving from the homepage into the demo route.

#### Test TC014 Dark theme persists when navigating between docs pages
- **Test Code:** [TC014_Dark_theme_persists_when_navigating_between_docs_pages.py](./TC014_Dark_theme_persists_when_navigating_between_docs_pages.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/24b89751-8550-4619-ba58-a91821482fb1
- **Status:** ✅ Passed
- **Analysis / Findings:** Dark theme stayed consistent while navigating inside the docs section.

### Requirement: Interactive demo playground
- **Description:** Let users switch layouts, inspect node state, tune tooltip behavior, filter by group, and export a graph snapshot.

#### Test TC007 Switch layouts across all modes without losing interactivity
- **Test Code:** [TC007_Switch_layouts_across_all_modes_without_losing_interactivity.py](./TC007_Switch_layouts_across_all_modes_without_losing_interactivity.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/4dccebe1-fe76-42d8-b5f1-bfb34cd13b8e
- **Status:** ✅ Passed
- **Analysis / Findings:** The graph updated correctly across force, radial, arc, and chord layouts without becoming unresponsive.

#### Test TC008 Force layout renders and settles in demo
- **Test Code:** [TC008_Force_layout_renders_and_settles_in_demo.py](./TC008_Force_layout_renders_and_settles_in_demo.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/1f8606d0-340b-436f-beeb-0374db85505c
- **Status:** ✅ Passed
- **Analysis / Findings:** The force layout rendered and settled into an interactive state as expected.

#### Test TC009 Select a node updates the selected node panel
- **Test Code:** [TC009_Select_a_node_updates_the_selected_node_panel.py](./TC009_Select_a_node_updates_the_selected_node_panel.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/7c68496c-84c0-4730-b8fa-87d6cf905c40
- **Status:** ✅ Passed
- **Analysis / Findings:** Clicking a node updated the selected node inspection panel with the chosen node details.

#### Test TC010 Export PNG downloads a graph snapshot
- **Test Code:** [TC010_Export_PNG_downloads_a_graph_snapshot.py](./TC010_Export_PNG_downloads_a_graph_snapshot.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/ea0d6f2e-053b-4ed5-b2cd-9210aa67fece
- **Status:** BLOCKED
- **Analysis / Findings:** The export action was triggered, but the test could not verify the resulting file download because browser download handling is not visible through the app UI.

#### Test TC011 Toggle tooltip fields changes tooltip content
- **Test Code:** [TC011_Toggle_tooltip_fields_changes_tooltip_content.py](./TC011_Toggle_tooltip_fields_changes_tooltip_content.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/557a762f-1224-4f50-8afe-0d3ef96c01fd
- **Status:** ❌ Failed
- **Analysis / Findings:** Toggling the "description" metadata key off did not remove metadata from the selected-node display or tooltip content, so the UI did not reflect the updated tooltip configuration.

#### Test TC013 Filter or highlight nodes by selecting a group chip
- **Test Code:** [TC013_Filter_or_highlight_nodes_by_selecting_a_group_chip.py](./TC013_Filter_or_highlight_nodes_by_selecting_a_group_chip.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/b501dac2-2601-41fa-b7f7-0d49e619a383
- **Status:** ✅ Passed
- **Analysis / Findings:** Selecting a group chip changed the graph display as expected and preserved interactivity.

---

## 3️⃣ Coverage & Matching Metrics

- **Total tests:** 15
- **Passed:** 13
- **Failed:** 1
- **Blocked:** 1
- **Pass rate:** 86.67%

| Requirement | Total Tests | ✅ Passed | ❌ Failed | ⛔ Blocked |
|---|---:|---:|---:|---:|
| Homepage overview and quick start | 2 | 2 | 0 | 0 |
| Documentation browser | 2 | 2 | 0 | 0 |
| Dark theme initialization | 5 | 5 | 0 | 0 |
| Interactive demo playground | 6 | 4 | 1 | 1 |

---

## 4️⃣ Key Gaps / Risks
- The demo’s tooltip configuration does not appear to update the visible content when metadata keys are toggled, which is the clearest functional regression in this run.
- PNG export could not be fully verified because the browser download itself is not exposed in the UI, so the app has no confirmation state for that action.
- The app relies on static sample data for the preview and demo, so this run validates UI behavior and local state only, not backend or persistence flows.
