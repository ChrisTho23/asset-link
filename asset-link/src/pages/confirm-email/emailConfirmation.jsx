import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logIn from '../home/functions/logIn.js';
import registerUser from '../home/functions/registerUser.js';

const EmailConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const { email, password, userData, userId } = location.state || {};

    useEffect(() => {
        if (!email || !password || !userData || !userId) {
            navigate('/auth');
        }
    }, [email, password, userData, userId, navigate]);

    const handleEmailConfirmed = async () => {
        try {
            const loginData = await logIn({ email, password });

            if (!loginData.user) {
                setError("Account not found. Please make sure you've clicked the confirmation link in your email first.");
                return;
            }

            if (!loginData.user?.email_confirmed_at) {
                setError("Email not yet confirmed. Please click the confirmation link in your email first.");
                return;
            }

            // register user 
            await registerUser(loginData.user?.id, userData);

            // redirect to overview with showOnboarding state
            navigate(`/overview/${loginData.user.id}`, {
                state: { showOnboarding: true }
            });
        } catch (error) {
            setError("Unable to verify email confirmation. Please make sure you've clicked the confirmation link in your email first.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Please Confirm Your Email</h2>
            <p>We've sent a confirmation email to {email}.</p>
            <p>Please check your inbox and click the confirmation link to continue.</p>

            {error && <p className="error-message">{error}</p>}

            <button
                className="auth-submit"
                onClick={handleEmailConfirmed}
            >
                I've Confirmed My Email
            </button>
        </div>
    );
};

export default EmailConfirmation;
