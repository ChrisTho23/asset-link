import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
    const navigate = useNavigate();

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
                <button className='auth-button' onClick={() => navigate('/auth', { state: { isLogin: false } })}>
                    Sign up
                </button>
                <button className='auth-button' onClick={() => navigate('/auth', { state: { isLogin: true } })}>
                    Log in
                </button>
            </div>
        </div>
    );
};

export default Home;