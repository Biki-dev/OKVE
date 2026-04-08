import { NavLink } from 'react-router-dom'

export function Header() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `top-nav-link${isActive ? ' top-nav-link--active' : ''}`

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-start">
          <NavLink to="/" className="brand">
            <img className="brand-logo" src="/textlogo.png" alt="OKVE" />
          </NavLink>
          <div className="top-nav-shell" role="presentation">
            <nav className="top-nav" aria-label="Primary">
              <NavLink to="/docs/getting-started" className={navClass}>
                Guide
              </NavLink>
              <NavLink to="/demo" className={navClass}>
                Demo
              </NavLink>
            </nav>
          </div>
          <button type="button" className="version-pill">
            v{__OKVE_VERSION__}
          </button>
        </div>
        <div className="header-actions">
          <a
            href="https://www.npmjs.com/package/@biki-dev/okve"
            target="_blank"
            rel="noreferrer"
            className="icon-button"
            aria-label="npm package page"
            title="npm package"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="2" y="5" width="20" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <text
                x="12"
                y="14.6"
                textAnchor="middle"
                fontSize="7.2"
                fontWeight="700"
                fontFamily="ui-monospace, Menlo, Consolas, monospace"
                fill="currentColor"
              >
                npm
              </text>
            </svg>
          </a>
          <a
            href="https://github.com/Biki-dev/OKVE"
            target="_blank"
            rel="noreferrer"
            className="icon-button"
            aria-label="GitHub repo"
            title="GitHub repository"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.72.5.09.68-.22.68-.48v-1.68c-2.78.62-3.37-1.38-3.37-1.38-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1.01.07 1.54 1.06 1.54 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 7.95c.85 0 1.72.12 2.53.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.57 5.08.36.32.68.94.68 1.9v2.82c0 .27.18.58.69.48A10.06 10.06 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
