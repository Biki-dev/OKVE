import okveCssText from '../components/KnowledgeGraph/KnowledgeGraph.css?inline'

const OKVE_STYLE_ID = 'okve-runtime-styles'

let hasInjectedStyles = false

export function ensureOkveStyles() {
  if (hasInjectedStyles || typeof document === 'undefined') {
    return
  }

  if (document.getElementById(OKVE_STYLE_ID)) {
    hasInjectedStyles = true
    return
  }

  const styleTag = document.createElement('style')
  styleTag.id = OKVE_STYLE_ID
  styleTag.textContent = okveCssText
  document.head.appendChild(styleTag)
  hasInjectedStyles = true
}
