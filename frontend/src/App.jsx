import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Users from './pages/Users'
import Forms from './pages/Forms'
import LoadingStates from './pages/LoadingStates'

function Navigation() {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path ? 'active' : ''
  
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li>QA Testbed</li>
        <li><Link to="/" className={isActive('/')}>Home</Link></li>
        <li><Link to="/users" className={isActive('/users')}>Users Table</Link></li>
        <li><Link to="/forms" className={isActive('/forms')}>Forms</Link></li>
        <li><Link to="/loading" className={isActive('/loading')}>Loading/Errors</Link></li>
      </ul>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/loading" element={<LoadingStates />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
