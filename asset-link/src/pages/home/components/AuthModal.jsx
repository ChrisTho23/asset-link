import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logIn from '../functions/logIn.js';
import oAuthSignUp from '../functions/oAuthSignUp.js';
import signUp from '../functions/signUp.js';
import registerUser from '../functions/registerUser.js';
import checkEmailExists from '../functions/checkEmailExists.js';
import signOut from '../functions/signOut.js';
import './auth.css';

const AuthModal = ({ isOpen, onClose, initialView = 'login', initialError = null }) => {
    const navigate = useNavigate();
    const [view, setView] = useState(initialView);
    const isLogin = view === 'login';
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    useEffect(() => {
        if (initialError) {
            setError(initialError);
        }
    }, [initialError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (isLogin) {
                if (credentials.email && credentials.password) {
                    try {
                        const data = await logIn(credentials);
                        navigate(`/overview/${data.user?.id}`);
                    } catch (error) {
                        if (error.message.includes('Invalid login credentials')) {
                            setError('Incorrect password. Please try again.');
                        } else {
                            setError(error.message);
                        }
                    }
                } else {
                    throw new Error("Both password and email must be provided!");
                }
            } else {
                if (!credentials.email || !credentials.password ||
                    !user.firstName || !user.lastName) {
                    throw new Error("All fields must be filled out!");
                }

                const { exists } = await checkEmailExists(credentials.email);
                if (exists) {
                    setError("An account with this email already exists. Please log in instead.");
                    setView('login');
                    return;
                }

                const authData = await signUp(credentials);
                navigate('/confirm-email', {
                    state: {
                        email: credentials.email,
                        password: credentials.password,
                        userData: { ...user, email: credentials.email },
                        userId: authData.user.id
                    }
                });
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleOAuthSignIn = async (provider) => {
        try {
            setError(null);
            await oAuthSignUp(provider);
            localStorage.setItem('authView', view);
        } catch (error) {
            console.error('OAuth error:', error);
            setError('Failed to sign in with Google. Please try again.');
        }
    };

    useEffect(() => {
        const handleRedirect = async () => {
            try {
                const loginData = await logIn();
                const previousView = localStorage.getItem('authView');

                if (previousView === 'signup' && loginData.session?.user?.user_metadata?.full_name
                    && loginData.session?.user?.user_metadata?.email) {
                    try {
                        const { exists } = await checkEmailExists(loginData.session.user.email);
                        if (exists && previousView === 'signup') {
                            await signOut();
                            navigate('/', {
                                state: {
                                    openAuth: true,
                                    authError: "An account with this email already exists. Please log in instead.",
                                    initialView: 'login'
                                }
                            });
                            return;
                        }
                    } catch (emailCheckError) {
                        console.error('Error checking email:', emailCheckError);
                        setError('An error occurred during sign up. Please try again.');
                        return;
                    }

                    console.log("Updating user")
                    await registerUser(
                        loginData.session.user.id,
                        {
                            firstName: loginData.session.user.user_metadata.full_name?.split(' ')[0] || '',
                            lastName: loginData.session.user.user_metadata.full_name?.split(' ').slice(1).join(' ') || '',
                            email: loginData.session?.user?.user_metadata?.email
                        }
                    );
                }

                // Clean up and navigate
                localStorage.removeItem('authView');
                navigate(`/overview/${loginData.session.user.id}`);
            } catch (error) {
                console.error('Redirect handling error:', error);
                setError(error.message || 'An error occurred during authentication.');
            }
        };

        // check if returning from OAuth redirect
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
            handleRedirect();
        }
    }, [navigate]);

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