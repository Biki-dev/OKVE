export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-card">
        <div className="footer-top">
          <div className="footer-brand-copy">
            <p className="footer-kicker">OKVE</p>
            <h2>Your product design partner</h2>
          </div>

          <a
            className="footer-contact footer-github"
            href="https://github.com/Biki-dev/OKVE"
            target="_blank"
            rel="noreferrer"
            aria-label="View OKVE on GitHub"
            title="View OKVE on GitHub"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.72.5.09.68-.22.68-.48v-1.68c-2.78.62-3.37-1.38-3.37-1.38-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1.01.07 1.54 1.06 1.54 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 7.95c.85 0 1.72.12 2.53.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.57 5.08.36.32.68.94.68 1.9v2.82c0 .27.18.58.69.48A10.06 10.06 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
            </svg>
          </a>
        </div>

        <div className="footer-wordmark" aria-hidden="true">
          OKVE
        </div>

        <div className="footer-bottom">Copyright 2026. Powered by OKVE.</div>
      </div>
    </footer>
  )
}
