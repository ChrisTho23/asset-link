import { useNavigate, useLocation } from 'react-router-dom';
import signOut from '../../pages/home/functions/signOut';
import { getSession } from '../../pages/home/functions/sessionManager';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isOverviewPage = location.pathname.includes('/overview');

    const handleLogoClick = () => {
        const session = getSession();
        if (session?.user) {
            navigate(`/overview/${session.user.id}`);
        } else {
            navigate('/');
        }
    };

    const handleSignOut = async () => {
        const result = await signOut();
        if (result.success) {
            navigate('/');
        }
    };

    return (
        <header className="header">
            <div className="header-left" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                <img width="32" height="32" src="https://img.icons8.com/color/96/asset.png" alt="asset" />
                <h2 className="header-title">Asset Link</h2>
            </div>
            <div className="header-right">
                {isOverviewPage && (
                    <button className="sign-out-button" onClick={handleSignOut}>
                        Sign Out
                    </button>
                )}
                <button className="about-button" onClick={() => navigate('/about')}>About</button>
            </div>
        </header>
    );
};

export default Header; 