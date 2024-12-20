import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import { getSession } from './functions/sessionManager';
import './home.css';

const Home = () => {
    const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [initialView, setInitialView] = useState('login');

    useEffect(() => {
        const session = getSession();
        if (session?.user) {
            navigate(`/overview/${session.user.id}`);
        }
    }, [navigate]);

    const handleAuthClick = (view) => {
        setInitialView(view);
        setIsAuthModalOpen(true);
    };

    return (
        <div className="home-container">
            <h1>
                Asset Link
                <p className="subtitle">
                    All your assets in one place
                </p>
            </h1>
            <div className="button-container">
                <button className='auth-button' onClick={() => handleAuthClick('signup')}>
                    Sign up
                </button>
                <button className='auth-button' onClick={() => handleAuthClick('login')}>
                    Log in
                </button>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView={initialView}
            />
        </div>
    );
};

export default Home;