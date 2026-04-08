import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const docsSections = [
  {
    title: 'Introduction',
    links: [
      { to: '/docs/getting-started', label: 'Getting Started' },
      { to: '/docs/examples', label: 'Examples' },
    ],
  },
  {
    title: 'Guide',
    links: [
      { to: '/docs/getting-started', label: 'Installation' },
      { to: '/docs/api-reference', label: 'API Reference' },
      { to: '/docs/examples', label: 'Examples' },
      { to: '/docs/changelog', label: 'Changelog' },
    ],
  },
]

export function DocsLayout() {
  const location = useLocation()
  const [sectionIds, setSectionIds] = useState<string[]>([])
  const [activeSectionId, setActiveSectionId] = useState<string>('')

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar-link${isActive ? ' sidebar-link--active' : ''}`

  const sectionLabelMap = useMemo(
    () => ({
      overview: 'Overview',
      installation: 'Installation',
      'quick-start': 'Quick Start',
      schema: 'Data Schema',
      faq: 'Community',
    }),
    [],
  )

  useEffect(() => {
    // Wait for route content to mount, then read section IDs in document order.
    const timer = window.setTimeout(() => {
      const ids = Array.from(document.querySelectorAll<HTMLElement>('.doc-article section[id]')).map(
        (section) => section.id,
      )
      setSectionIds(ids)
      setActiveSectionId(ids[0] ?? '')
    }, 0)

    return () => window.clearTimeout(timer)
  }, [location.pathname])

  useEffect(() => {
    if (sectionIds.length === 0) {
      setActiveSectionId('')
      return
    }

    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    const updateActiveSection = () => {
      const offset = 126
      let current = sectionIds[0]

      for (const section of sectionElements) {
        if (section.getBoundingClientRect().top - offset <= 0) {
          current = section.id
        } else {
          break
        }
      }

      setActiveSectionId(current)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [sectionIds])

  return (
    <div className="docs-layout">
      <aside className="docs-sidebar">
        {docsSections.map((section) => (
          <div key={section.title} className="sidebar-group">
            <p className="sidebar-title">{section.title}</p>
            <nav className="sidebar-links">
              {section.links.map((item) => (
                <NavLink key={`${section.title}-${item.label}`} to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </aside>
      <main className="docs-content">
        <Outlet />
      </main>
      <aside className="docs-right">
        <p className="right-title">On this page</p>
        <nav className="right-links">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSectionId === id ? 'right-link-active' : undefined}
            >
              {sectionLabelMap[id as keyof typeof sectionLabelMap] ?? id}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  )
}
