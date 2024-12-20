import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home/home.jsx';
import About from './pages/about/about.jsx';
import Layout from './pages/layout/layout.jsx';
import Overview from './pages/overview/overview.jsx';
import EmailConfirmation from './pages/confirm-email/emailConfirmation.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='confirm-email' element={<EmailConfirmation />} />
          <Route path='overview/:id' element={<Overview />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
