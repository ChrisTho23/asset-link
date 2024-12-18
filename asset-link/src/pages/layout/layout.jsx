import { Outlet } from 'react-router-dom';
import './layout.css';

const Layout = () => {
    return (
        <div className="layout-container">
            <Outlet />
        </div>
    );
};

export default Layout;