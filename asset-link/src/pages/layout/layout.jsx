import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './layout.css';

const Layout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="layout-container">
            {!isHomePage && <Header />}
            <div className={`content ${!isHomePage ? 'with-header' : ''}`}>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;