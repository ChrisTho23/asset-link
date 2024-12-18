import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logIn from './logIn.js';
import passwordSignUp from './passwordSignUp.js';
import oAuthSignUp from './oAuthSignUp.js';
import './auth.css';

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(location.state?.isLogin ?? true)
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (credentials.email && credentials.password) {
                if (isLogin) {
                    const data = await logIn(credentials);
                    navigate(`/overview/${data.user?.id}`);
                } else {
                    const data = await passwordSignUp(credentials);
                    navigate(`/overview/${data.user?.id}/onboarding`);
                };
            } else {
                throw new Error("Both password and email must both be provided!");
            };
        } catch (error) {
            setError(error.message)
        };
    };

    const handleOAuthSignIn = async (provider) => {
        try {
            const data = await oAuthSignUp(provider);
            navigate(`/overview/${data.user?.id}/onboarding`);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Log In' : 'Create Account'}</h2>
            <form className='auth-form' onSubmit={handleSubmit}>
                <input
                    type='email'
                    placeholder='Email'
                    className='auth-input'
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className='auth-input'
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
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
                <button className='auth-toggle-button' onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Sign Up' : 'Log In'}
                </button>
            </p>
        </div>
    );
};

export default Auth;