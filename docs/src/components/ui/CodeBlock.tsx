import { useEffect, useMemo, useState } from 'react'
import { createHighlighter } from 'shiki'

type CodeBlockProps = {
  code: string
  lang?: string
  
}

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null
const supportedLangs = ['tsx', 'ts', 'javascript', 'json', 'bash'] as const

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['dracula'],
      langs: [...supportedLangs],
    })
  }
  return highlighterPromise
}

export function CodeBlock({ code, lang = 'tsx' }: CodeBlockProps) {
  const [html, setHtml] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const safeLang = useMemo(() => {
    return supportedLangs.includes(lang as (typeof supportedLangs)[number])
      ? lang
      : 'tsx'
  }, [lang])

  useEffect(() => {
    let mounted = true

    getHighlighter().then((highlighter) => {
      if (!mounted) return
      const rendered = highlighter.codeToHtml(code, {
        lang: safeLang,
        theme: 'dracula',
      })
      setHtml(rendered)
    })

    return () => {
      mounted = false
    }
  }, [code, safeLang])

  const onCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="code-block-shell">
      <div className="code-block-toolbar">
        <span>{safeLang}</span>
        <button type="button" className="copy-button" onClick={onCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div
        className="code-block shiki-container"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
