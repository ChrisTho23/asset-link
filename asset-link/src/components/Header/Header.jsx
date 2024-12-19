import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-left" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <img width="32" height="32" src="https://img.icons8.com/color/96/asset.png" alt="asset" />
                <h2 className="header-title">Asset Link</h2>
            </div>
            <div className="header-right">
                <button className="about-button" onClick={() => navigate('/about')}>About</button>
            </div>
        </header>
    );
};

export default Header; 