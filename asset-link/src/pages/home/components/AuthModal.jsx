import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logIn from '../functions/logIn.js';
import passwordSignUp from '../functions/passwordSignUp.js';
import oAuthSignUp from '../functions/oAuthSignUp.js';
import './auth.css';

const AuthModal = ({ isOpen, onClose, initialView = 'login' }) => {
    const navigate = useNavigate();
    const [view, setView] = useState(initialView);
    const isLogin = view === 'login';
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        birthDate: ''
    });
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (isLogin) {
                if (credentials.email && credentials.password) {
                    const data = await logIn(credentials);
                    navigate(`/overview/${data.user?.id}`);
                } else {
                    throw new Error("Both password and email must be provided!");
                }
            } else {
                if (!credentials.email || !credentials.password ||
                    !user.firstName || !user.lastName || !user.birthDate) {
                    throw new Error("All fields must be filled out!");
                }

                // create user account
                const authData = await passwordSignUp(credentials);

                // redirect to email confirmation page
                navigate('/confirm-email', {
                    state: {
                        email: credentials.email,
                        password: credentials.password,
                        userData: user,
                        userId: authData.user.id
                    }
                });
            }
        } catch (error) {
            console.error('Auth error:', error);
            setError(error.message);
        }
    };

    const handleOAuthSignIn = async (provider) => {
        try {
            const data = await oAuthSignUp(provider);
            navigate(`/overview/${data.user?.id}/onboarding`);
        } catch (error) {
            setError(error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="auth-modal">
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>{isLogin ? 'Log In' : 'Create Account'}</h2>

                <form className='auth-form' onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <input
                                type='text'
                                placeholder='First Name'
                                className='auth-input'
                                value={user.firstName}
                                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                            />
                            <input
                                type='text'
                                placeholder='Last Name'
                                className='auth-input'
                                value={user.lastName}
                                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                            />
                            <input
                                type='date'
                                placeholder='Birth Date'
                                className='auth-input'
                                value={user.birthDate}
                                onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
                            />
                        </>
                    )}
                    <input
                        type='email'
                        placeholder='Email'
                        className='auth-input'
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        className='auth-input'
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type='submit' className='auth-submit'>
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <div className="oauth-container">
                    <p>Or continue with:</p>
                    <div className="oauth-buttons">
                        <button
                            className="oauth-button google"
                            onClick={() => handleOAuthSignIn('google')}
                        >
                            Google
                        </button>
                    </div>
                </div>

                <p className='auth-toggle'>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        className='auth-toggle-button'
                        onClick={() => setView(isLogin ? 'signup' : 'login')}
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthModal; 