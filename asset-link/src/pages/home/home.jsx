import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import { getSession } from './functions/sessionManager';
import './home.css';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [initialView, setInitialView] = useState('login');

    useEffect(() => {
        const session = getSession();
        if (session?.user) {
            navigate(`/overview/${session.user.id}`);
        }
    }, [navigate]);

    // Check for auth state parameters
    useEffect(() => {
        if (location.state?.openAuth) {
            setIsAuthModalOpen(true);
            setInitialView(location.state.initialView || 'login');
        }
    }, [location]);

    const handleAuthClick = (view) => {
        setInitialView(view);
        setIsAuthModalOpen(true);
    };

    return (
        <div className="home-container">
            <h1 style={{ marginBottom: '0.5rem' }}>
                Asset Link
                <p className="subtitle">
                    All your assets in one place
                </p>
            </h1>
            <div className="about-container">
                <button className='home-about-button' onClick={() => navigate('/about')}>About</button>
            </div>
            <div className="button-container">
                <div className="auth-buttons">
                    <button className='auth-button' onClick={() => handleAuthClick('signup')}>
                        Sign up
                    </button>
                    <button className='auth-button' onClick={() => handleAuthClick('login')}>
                        Log in
                    </button>
                </div>
            </div>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView={initialView}
                initialError={location.state?.authError}
            />
        </div>
    );
};

export default Home;