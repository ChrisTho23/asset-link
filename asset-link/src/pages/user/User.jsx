import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import signOut from '../home/functions/signOut';
import fetchUserData from '../overview/functions/fetchUserData';
import BackgroundPattern from '../../components/BackgroundPattern/BackgroundPattern';
import './User.css';

const User = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await fetchUserData(id);
                setUser(userData);
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };
        loadUserData();
    }, [id]);

    const handleSignOut = async () => {
        const result = await signOut();
        if (result.success) {
            navigate('/');
        }
    };

    if (!user) return null;

    return (
        <div className="user-page">
            <BackgroundPattern />
            <div className="user-container">
                <h1>User Profile</h1>
                <div className="user-info">
                    <div className="info-row">
                        <label>First Name:</label>
                        <span>{user.first_name}</span>
                    </div>
                    <div className="info-row">
                        <label>Last Name:</label>
                        <span>{user.last_name}</span>
                    </div>
                    <div className="info-row">
                        <label>Email:</label>
                        <span>{user.email}</span>
                    </div>
                </div>
                <button className="sign-out-button" onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default User; 