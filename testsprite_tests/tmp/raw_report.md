
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** OKVE
- **Date:** 2026-04-16
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Evaluate homepage with live preview graph rendering
- **Test Code:** [TC001_Evaluate_homepage_with_live_preview_graph_rendering.py](./TC001_Evaluate_homepage_with_live_preview_graph_rendering.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/3035a4d4-a1f8-4d55-867a-43de852b637f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Dark theme applies on homepage load
- **Test Code:** [TC002_Dark_theme_applies_on_homepage_load.py](./TC002_Dark_theme_applies_on_homepage_load.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/3588b50f-0882-475b-afe3-0892996f6570
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Dark theme applies on demo page entry
- **Test Code:** [TC003_Dark_theme_applies_on_demo_page_entry.py](./TC003_Dark_theme_applies_on_demo_page_entry.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/70d37c01-e10c-4a9e-87a6-025301626341
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Dark theme applies on docs getting started entry
- **Test Code:** [TC004_Dark_theme_applies_on_docs_getting_started_entry.py](./TC004_Dark_theme_applies_on_docs_getting_started_entry.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/2d396c44-63a7-4cba-9a5b-f84e62f73e48
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Switch between all demo graph layouts
- **Test Code:** [TC005_Switch_between_all_demo_graph_layouts.py](./TC005_Switch_between_all_demo_graph_layouts.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/df22532f-7a2a-4099-a4ac-8b8e947081fa
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Dark theme persists after navigating between routes
- **Test Code:** [TC006_Dark_theme_persists_after_navigating_between_routes.py](./TC006_Dark_theme_persists_after_navigating_between_routes.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/9bf97969-e1ad-42a3-bba3-b9de2aac4faf
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Select a node updates the Selected Node panel
- **Test Code:** [TC007_Select_a_node_updates_the_Selected_Node_panel.py](./TC007_Select_a_node_updates_the_Selected_Node_panel.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/8aa869e3-ccfb-4706-bbcf-f47a337597bb
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Enter docs from homepage via Get Started
- **Test Code:** [TC008_Enter_docs_from_homepage_via_Get_Started.py](./TC008_Enter_docs_from_homepage_via_Get_Started.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/b09ccb21-2fed-4b66-8cb3-88f33607aeaa
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Dark theme remains after a page reload on demo
- **Test Code:** [TC009_Dark_theme_remains_after_a_page_reload_on_demo.py](./TC009_Dark_theme_remains_after_a_page_reload_on_demo.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/f260be5a-c248-4029-a8c3-b12b1acfaec9
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Export demo graph as PNG
- **Test Code:** [TC010_Export_demo_graph_as_PNG.py](./TC010_Export_demo_graph_as_PNG.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/0e3d7e8a-2bac-4816-942f-0e12179991cb
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Filter and highlight nodes by group chip
- **Test Code:** [TC011_Filter_and_highlight_nodes_by_group_chip.py](./TC011_Filter_and_highlight_nodes_by_group_chip.py)
- **Test Error:** TEST FAILURE

Selecting the 'language' group chip did not filter or highlight the graph nodes for that group as expected.

Observations:
- The 'language' chip shows a selected visual state but no related change in the graph canvas.
- The node list still displays all nodes (no nodes hidden or visually de-emphasized).
- The graph canvas still emphasizes the React node (frontend) instead of highlighting the TypeScript node (language).
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/bc278227-f92b-4133-bd05-22e4f1b70c67
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Redirect /docs to Getting Started
- **Test Code:** [TC012_Redirect_docs_to_Getting_Started.py](./TC012_Redirect_docs_to_Getting_Started.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/230a8389-7a43-4ed5-aefc-e972aebaa84d
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Toggle tooltip fields changes tooltip content
- **Test Code:** [TC013_Toggle_tooltip_fields_changes_tooltip_content.py](./TC013_Toggle_tooltip_fields_changes_tooltip_content.py)
- **Test Error:** TEST FAILURE

Toggling the tooltip field and metadata key did not change the tooltip preview as expected.

Observations:
- After clicking the 'size' node tooltip field toggle and the 'reason' metadata key toggle and re-selecting the React node, the tooltip preview still shows: id, group, description, takeaway, strength.
- The field 'size' is not present in the visible tooltip preview.
- The metadata key 'reason' is listed under Metadata keys but does not appear in the React node's tooltip preview.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/e4ed8587-b7a8-4f71-bb35-ec2a7dc794ae
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Browse Examples and copy an embedded snippet
- **Test Code:** [TC014_Browse_Examples_and_copy_an_embedded_snippet.py](./TC014_Browse_Examples_and_copy_an_embedded_snippet.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/0f998c90-a71d-4a1e-9434-55d6dcb2d887
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Copy install command from homepage
- **Test Code:** [TC015_Copy_install_command_from_homepage.py](./TC015_Copy_install_command_from_homepage.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/db48d1ad-48bd-4dca-9441-1101ee533ba9
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 Navigate from Getting Started to API Reference via sidebar
- **Test Code:** [TC016_Navigate_from_Getting_Started_to_API_Reference_via_sidebar.py](./TC016_Navigate_from_Getting_Started_to_API_Reference_via_sidebar.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/c478b760-4be2-46c6-8932-148a4f5579e1
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 Use API Reference table of contents jump to a section
- **Test Code:** [TC017_Use_API_Reference_table_of_contents_jump_to_a_section.py](./TC017_Use_API_Reference_table_of_contents_jump_to_a_section.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/b8f9fe0f-b118-427a-a457-447100ac6fa3
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018 Experience homepage hero parallax motion
- **Test Code:** [TC018_Experience_homepage_hero_parallax_motion.py](./TC018_Experience_homepage_hero_parallax_motion.py)
- **Test Error:** TEST BLOCKED

Pointer movement across the hero visual could not be simulated through the available interactive elements and actions.

Observations:
- The page displays the 'Live Demo' hero area, but there is no interactive element index corresponding to the hero visual that would allow injecting/triggering pointer-move or hover events.
- The available actions allow clicking indexed elements and scrolling, but no way to synthesize arbitrary mousemove/hover across the hero to observe parallax.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/b69375ea-1d75-4b1a-bf9e-b088799bef4b
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019 Open and read Changelog via sidebar navigation
- **Test Code:** [TC019_Open_and_read_Changelog_via_sidebar_navigation.py](./TC019_Open_and_read_Changelog_via_sidebar_navigation.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/850efb16-d74d-4c3c-ac38-3b14f0f83a17
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020 Open project repository link from homepage
- **Test Code:** [TC020_Open_project_repository_link_from_homepage.py](./TC020_Open_project_repository_link_from_homepage.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa45cc65-176b-4f18-998c-5dd31f71df5c/f41c33cc-365d-4a76-99b7-4a6740e2100f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **85.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---