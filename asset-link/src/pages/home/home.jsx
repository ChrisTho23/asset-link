import { useState } from 'react';
import AuthModal from './components/AuthModal';
import './home.css';

const Home = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [initialView, setInitialView] = useState('login');

    const handleAuthClick = (view) => {
        setInitialView(view);
        setIsAuthModalOpen(true);
    };

    return (
        <div className="home-container">
            <div className="logo-container">
                <img width="96" height="96" src="https://img.icons8.com/color/96/asset.png" alt="asset" />
            </div>
            <h1 style={{ color: '#89CFF0' }}>
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