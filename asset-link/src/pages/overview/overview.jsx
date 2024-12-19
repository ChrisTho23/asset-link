import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Welcome from './components/welcome/Welcome';
import NetWorthBox from './components/net-worth-box/NetWorthBox';
import AssetsList from './components/asset-list/AssetsList';
import AddAssetModal from './components/add-asset/AddAssetModal';
import AssetDistributionChart from './components/asset-distribution-chart/assetDistributionChart';
import fetchUserData from './functions/fetchUserData';
import fetchUserAssets from './functions/fetchUserAssets';
import calculateTotalNetWorth from "./functions/calculateTotalNetWorth";
import logNetWorthHistory from "./functions/logNetworthHistory";
import './overview.css';

const Overview = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [totalNetWorth, setTotalNetWorth] = useState(0);
    const [assets, setAssets] = useState([]);
    const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);

    const loadData = async () => {
        try {
            // Fetch user and assets data in parallel
            const [userData, userAssets] = await Promise.all([
                fetchUserData(id),
                fetchUserAssets(id)
            ]);

            setUser(userData);
            setAssets(userAssets);

            const totalWorth = calculateTotalNetWorth(userAssets);
            setTotalNetWorth(totalWorth);

            // Log the net worth to history
            await logNetWorthHistory(id, totalWorth);

        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleModalClose = async (success) => {
        setIsAddAssetModalOpen(false);
        if (success) {
            await loadData(); // Refresh data when asset is successfully added
        }
    };

    return (
        <div className="overview-container">
            {user && <Welcome firstName={user.first_name} lastName={user.last_name} />}
            <div className="net-worth-section">
                <NetWorthBox amount={totalNetWorth} />
                <AssetDistributionChart
                    data={assets.map(asset => ({
                        name: asset.name,
                        value: asset.totalWorth
                    }))}
                />
            </div>
            <AssetsList
                assets={assets}
                onAddAsset={() => setIsAddAssetModalOpen(true)}
            />
            <button
                className="add-asset-button-main"
                onClick={() => setIsAddAssetModalOpen(true)}
            >
                Add New Asset
            </button>
            <AddAssetModal
                isOpen={isAddAssetModalOpen}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default Overview;