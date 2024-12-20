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

            if (!loginData.user?.email_confirmed_at) {
                setError("Email not yet confirmed. Please check your inbox.");
                return;
            }

            // register user 
            await registerUser(loginData, userData);

            // redirect to onboarding
            navigate(`/overview/${loginData.user.id}/onboarding`);
        } catch (error) {
            setError(error.message);
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
