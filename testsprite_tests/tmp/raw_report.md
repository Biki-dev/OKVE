
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** OKVE
- **Date:** 2026-04-11
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Evaluate homepage preview and reach Getting Started docs
- **Test Code:** [TC001_Evaluate_homepage_preview_and_reach_Getting_Started_docs.py](./TC001_Evaluate_homepage_preview_and_reach_Getting_Started_docs.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/82269e6b-b9cb-43ab-bc82-874e71b0b0f1
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Docs index redirects to Getting Started
- **Test Code:** [TC002_Docs_index_redirects_to_Getting_Started.py](./TC002_Docs_index_redirects_to_Getting_Started.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/8e62b0f5-e01f-4c20-a502-aff2a8e56d3c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Homepage renders in dark theme by default
- **Test Code:** [TC003_Homepage_renders_in_dark_theme_by_default.py](./TC003_Homepage_renders_in_dark_theme_by_default.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/58dabdf4-2b2f-4eff-b22e-ff08c19a996c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Homepage KnowledgeGraph preview renders without crashing
- **Test Code:** [TC004_Homepage_KnowledgeGraph_preview_renders_without_crashing.py](./TC004_Homepage_KnowledgeGraph_preview_renders_without_crashing.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/c22984f4-a9ac-4f6e-9cc9-674d1a0c5a5d
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Demo page renders in dark theme by default
- **Test Code:** [TC005_Demo_page_renders_in_dark_theme_by_default.py](./TC005_Demo_page_renders_in_dark_theme_by_default.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/b97f1b04-c0ca-4536-a17c-df2f1916e3c3
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Docs Getting Started renders in dark theme by default
- **Test Code:** [TC006_Docs_Getting_Started_renders_in_dark_theme_by_default.py](./TC006_Docs_Getting_Started_renders_in_dark_theme_by_default.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/c42a6f7e-16d6-4715-a03a-68819923f0cf
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Switch layouts across all modes without losing interactivity
- **Test Code:** [TC007_Switch_layouts_across_all_modes_without_losing_interactivity.py](./TC007_Switch_layouts_across_all_modes_without_losing_interactivity.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/4dccebe1-fe76-42d8-b5f1-bfb34cd13b8e
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Force layout renders and settles in demo
- **Test Code:** [TC008_Force_layout_renders_and_settles_in_demo.py](./TC008_Force_layout_renders_and_settles_in_demo.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/1f8606d0-340b-436f-beeb-0374db85505c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Select a node updates the selected node panel
- **Test Code:** [TC009_Select_a_node_updates_the_selected_node_panel.py](./TC009_Select_a_node_updates_the_selected_node_panel.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/7c68496c-84c0-4730-b8fa-87d6cf905c40
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Export PNG downloads a graph snapshot
- **Test Code:** [TC010_Export_PNG_downloads_a_graph_snapshot.py](./TC010_Export_PNG_downloads_a_graph_snapshot.py)
- **Test Error:** TEST BLOCKED

The test cannot confirm that clicking 'Export PNG' produced a file because browser download handling is outside the app UI and there is no visible download feedback.

Observations:
- The Export PNG button (index 445) was clicked but no new tab or image appeared.
- The page showed no download link or UI message indicating a PNG was created.
- Browser download history is not accessible to this test agent, so file save cannot be verified.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/ea0d6f2e-053b-4ed5-b2cd-9210aa67fece
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Toggle tooltip fields changes tooltip content
- **Test Code:** [TC011_Toggle_tooltip_fields_changes_tooltip_content.py](./TC011_Toggle_tooltip_fields_changes_tooltip_content.py)
- **Test Error:** TEST FAILURE

Toggling the "description" metadata key off did not remove metadata from the Selected Node panel or tooltip.

Observations:
- After turning 'description' off and reselecting TypeScript, the Selected Node panel still displays the description field and takeaway.
- The demo controls (node tooltip fields and metadata keys) are present and clickable, but the tooltip/Selected Node content did not reflect the change.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/557a762f-1224-4f50-8afe-0d3ef96c01fd
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Dark theme persists when navigating from homepage to demo
- **Test Code:** [TC012_Dark_theme_persists_when_navigating_from_homepage_to_demo.py](./TC012_Dark_theme_persists_when_navigating_from_homepage_to_demo.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/28452aed-40e9-4716-a33b-0f2531b79a2e
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Filter or highlight nodes by selecting a group chip
- **Test Code:** [TC013_Filter_or_highlight_nodes_by_selecting_a_group_chip.py](./TC013_Filter_or_highlight_nodes_by_selecting_a_group_chip.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/b501dac2-2601-41fa-b7f7-0d49e619a383
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Dark theme persists when navigating between docs pages
- **Test Code:** [TC014_Dark_theme_persists_when_navigating_between_docs_pages.py](./TC014_Dark_theme_persists_when_navigating_between_docs_pages.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/24b89751-8550-4619-ba58-a91821482fb1
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Navigate docs via sidebar from Getting Started to API Reference
- **Test Code:** [TC015_Navigate_docs_via_sidebar_from_Getting_Started_to_API_Reference.py](./TC015_Navigate_docs_via_sidebar_from_Getting_Started_to_API_Reference.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b2670279-9015-4e54-9a68-e0445328eeb5/2f45a33a-e9b2-4906-9702-1fd684efd6ed
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **86.67** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---