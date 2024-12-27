import { useNavigate, useLocation } from 'react-router-dom';
import { getSession } from '../../pages/home/functions/sessionManager';
import { icons } from '../../assets/icons';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const session = getSession();

    const handleLogoClick = () => {
        if (session?.user) {
            navigate(`/overview/${session.user.id}`);
        } else {
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
                {session?.user && (
                    <button
                        className="user-button"
                        onClick={() => navigate(`/user/${session.user.id}`)}
                    >
                        <span className="user-icon">
                            {icons.find(i => i.id === 'user-icon').icon}
                        </span>
                    </button>
                )}
                <button className="about-button" onClick={() => navigate('/about')}>About</button>
            </div>
        </header>
    );
};

export default Header; 