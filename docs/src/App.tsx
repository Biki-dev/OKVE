import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { DocsLayout } from './components/layout/Sidebar'
import { useTheme } from './hooks/useTheme'
import { ApiReference } from './pages/docs/ApiReference'
import { Changelog } from './pages/docs/Changelog'
import { Examples } from './pages/docs/Examples'
import { GettingStarted } from './pages/docs/GettingStarted'
import { Home } from './pages/Home'
import { DemoPage } from './pages/demo/DemoPage'

function App() {
  useTheme()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="site-shell">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<Navigate to="getting-started" replace />} />
          <Route path="getting-started" element={<GettingStarted />} />
          <Route path="api-reference" element={<ApiReference />} />
          <Route path="examples" element={<Examples />} />
          <Route path="changelog" element={<Changelog />} />
        </Route>
      </Routes>
      {isHomePage ? <Footer /> : null}
    </div>
  )
}

export default App
