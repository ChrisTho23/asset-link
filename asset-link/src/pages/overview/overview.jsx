import { useParams, Outlet } from "react-router-dom";

const Overview = () => {
    const { id } = useParams();

    return (
        <div className="overview-container">
            <div className="overview-header">
                <h1>Welcome back, {id}</h1>
            </div>
            <div className="overview-content">
                <Outlet />
            </div>
        </div>
    );
};

export default Overview;