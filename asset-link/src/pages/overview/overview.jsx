import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Welcome from './components/welcome/Welcome';
import NetWorthBox from './components/net-worth-box/NetWorthBox';
import AssetsList from './components/asset-list/AssetsList';
import AddAssetModal from './components/add-asset/AddAssetModal';
import AssetDistributionChart from './components/asset-distribution-chart/assetDistributionChart';
import fetchUserData from './functions/fetchUserData';
import fetchUserAssets from './functions/fetchUserAssets';
import calculateTotalNetWorth from "./functions/calculateTotalNetWorth";
import logNetWorthHistory from "./functions/logNetWorthHistory";
import deleteAssets from './functions/deleteAssets';
import './overview.css';
import updateAsset from './functions/updateAsset';
import updateAssetPrices from './functions/updateAssetPrices';
import NetWorthHistory from './components/net-worth-history/NetWorthHistory';
import fetchNetWorthHistory from './functions/fetchNetWorthHistory';
import calculateNetWorthChange from './functions/calculateNetWorthChange';
import { icons } from '../../assets/icons';
import BackgroundPattern from '../../components/BackgroundPattern/BackgroundPattern';
import OnboardingOverlay from './components/onboarding/OnboardingOverlay';

const Overview = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [totalNetWorth, setTotalNetWorth] = useState(0);
    const [assets, setAssets] = useState([]);
    const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
    const [netWorthHistory, setNetWorthHistory] = useState([]);
    const [activeView, setActiveView] = useState('total');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const location = useLocation();

    const loadData = async () => {
        try {
            // Fetch user, assets, and history data in parallel
            const [userData, userAssets, historyData] = await Promise.all([
                fetchUserData(id),
                fetchUserAssets(id),
                fetchNetWorthHistory(id)
            ]);

            // Update prices for assets that support real-time pricing
            const updatedAssets = await updateAssetPrices(userAssets);

            setUser(userData);
            setAssets(updatedAssets);
            setNetWorthHistory(historyData);

            const totalWorth = calculateTotalNetWorth(updatedAssets);
            setTotalNetWorth(totalWorth);

            // Log the new net worth to history
            await logNetWorthHistory(id, totalWorth);

            // Fetch updated history after logging new value
            const updatedHistory = await fetchNetWorthHistory(id);
            setNetWorthHistory(updatedHistory);

        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        // Check if user is coming from signup
        if (location.state?.showOnboarding) {
            setShowOnboarding(true);
        }
    }, [location]);

    const handleModalClose = async (success) => {
        setIsAddAssetModalOpen(false);
        if (success) {
            await loadData(); // Refresh data when asset is successfully added
        }
    };

    const handleDeleteAssets = async (assetIds) => {
        const result = await deleteAssets(assetIds);
        if (result.success) {
            await loadData(); // This already includes logging to history
        }
    };

    const handleUpdateAsset = async (updatedAsset) => {
        const result = await updateAsset(updatedAsset);
        if (result.success) {
            await loadData(); // This already includes logging to history
        }
    };

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
    };

    const renderContent = () => {
        switch (activeView) {
            case 'assets':
                return (
                    <AssetsList
                        assets={assets}
                        onAddAsset={() => setIsAddAssetModalOpen(true)}
                        onDeleteAssets={handleDeleteAssets}
                        onUpdateAsset={handleUpdateAsset}
                    />
                );
            case 'split':
                return (
                    <AssetDistributionChart
                        data={assets.map(asset => ({
                            name: asset.name,
                            value: asset.totalWorth
                        }))}
                    />
                );
            case 'history':
                return <NetWorthHistory data={netWorthHistory} />;
            default:
                return <AssetsList
                    assets={assets}
                    onAddAsset={() => setIsAddAssetModalOpen(true)}
                    onDeleteAssets={handleDeleteAssets}
                    onUpdateAsset={handleUpdateAsset}
                />
        }
    };

    return (
        <div className="overview-container">
            <BackgroundPattern />
            {user && <Welcome firstName={user.first_name} lastName={user.last_name} />}

            <div className="net-worth-section">
                <NetWorthBox
                    amount={totalNetWorth}
                    change={calculateNetWorthChange(netWorthHistory, totalNetWorth)}
                />
            </div>

            <div className="content-section">
                <div className="navigation-menu">
                    <button
                        className={`nav-button ${activeView === 'assets' ? 'active' : ''}`}
                        onClick={() => setActiveView('assets')}
                    >
                        <span className="nav-icon">{icons.find(i => i.id === 'asset-list').icon}</span>
                        Assets
                    </button>
                    <button
                        className={`nav-button ${activeView === 'split' ? 'active' : ''}`}
                        onClick={() => setActiveView('split')}
                    >
                        <span className="nav-icon">{icons.find(i => i.id === 'asset-dist').icon}</span>
                        Split
                    </button>
                    <button
                        className={`nav-button ${activeView === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveView('history')}
                    >
                        <span className="nav-icon">{icons.find(i => i.id === 'asset-hist').icon}</span>
                        History
                    </button>
                </div>

                <div className="content-container">
                    {renderContent()}
                </div>
            </div>

            <AddAssetModal
                isOpen={isAddAssetModalOpen}
                onClose={handleModalClose}
            />

            {showOnboarding && (
                <OnboardingOverlay onComplete={handleOnboardingComplete} />
            )}
        </div>
    );
};

export default Overview;