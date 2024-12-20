import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home/home.jsx';
import About from './pages/about/about.jsx';
import Layout from './pages/layout/layout.jsx';
import Auth from './pages/auth/auth.jsx';
import EmailConfirmation from './pages/auth/confirm-email/emailConfirmation.jsx';
import Overview from './pages/overview/overview.jsx';
import Onboarding from './pages/overview/onboarding/onboarding.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='auth' element={<Auth />} />
          <Route path='auth/confirm-email' element={<EmailConfirmation />} />
          <Route path='overview/:id' element={<Overview />}>
            <Route path='onboarding' element={<Onboarding />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
