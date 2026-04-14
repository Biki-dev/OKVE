# TestSprite AI Testing Report (MCP)

## 1️⃣ Document Metadata
- Project Name: OKVE
- Date: 2026-04-14
- Execution Mode: Frontend tests in production preview
- Base URL used by TestSprite: http://localhost:5173 (proxied)
- Prepared by: TestSprite + GitHub Copilot

## 2️⃣ Requirement Validation Summary
### Requirement A: Navigation and Route Stability
- Covered by: TC001, TC008, TC012
- Result: 3/3 passed
- Finding: Route entry points and redirects are stable.

### Requirement B: Theme Consistency (Dark Theme)
- Covered by: TC002, TC003, TC004, TC006, TC009
- Result: 5/5 passed
- Finding: Dark theme behavior remains consistent across homepage, demo, docs, and route transitions.

### Requirement C: Demo Interaction and Layout Workflow
- Covered by: TC005, TC007, TC011, TC013
- Result: 3 passed, 1 blocked
- Passed:
  - TC005: Switching force/radial/arc/chord works.
  - TC007: Selecting node updates Selected Node panel.
  - TC011: Group chip filtering/highlighting works.
- Blocked:
  - TC013: Reported blank/0-interactive-elements state during run, so tooltip field toggle validation was not completed.
- Finding: Core demo interactions required by the new left-editor/right-canvas organization are working in executed checks.

### Requirement D: Export/Clipboard Feedback
- Covered by: TC010, TC014, TC015
- Result: 1 passed, 2 failed
- Passed:
  - TC014: Copy from docs examples works.
- Failed:
  - TC010: Export PNG did not produce expected confirmation and run observed a non-interactive state afterward.
  - TC015: Homepage install-command copy action did not show expected visible confirmation text.
- Finding: Regressions/expectation mismatches remain in export and copy-feedback UX.

## 3️⃣ Coverage & Matching Metrics
- Total tests executed: 15
- Passed: 12
- Failed: 2
- Blocked: 1
- Pass rate: 80.00%

| Requirement | Total | Passed | Failed | Blocked |
|---|---:|---:|---:|---:|
| A. Navigation and Route Stability | 3 | 3 | 0 | 0 |
| B. Theme Consistency (Dark Theme) | 5 | 5 | 0 | 0 |
| C. Demo Interaction and Layout Workflow | 4 | 3 | 0 | 1 |
| D. Export/Clipboard Feedback | 3 | 1 | 2 | 0 |

## 4️⃣ Key Gaps / Risks
- TC010 indicates PNG export flow can lead to non-interactive app state in automation; this is high impact because it affects demo reliability.
- TC013 was blocked due to a runtime blank-state observation during that scenario; tooltip-control behavior should be re-run after stabilizing export/runtime state.
- TC015 indicates missing visible clipboard feedback on homepage copy action; if copy still succeeds silently, this is UX/accessibility debt.
- For the specific layout refactor request (organized editing panel + live graph panel), no direct failure was observed in node selection, layout switching, or group filtering checks.
