import { useParams, useLocation, useSearchParams } from "react-router-dom";
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
import { convertCurrency, needsConversion } from "../../utils/currencyConverter";
import { currencies } from "./components/currency-selector/CurrencySelector";
import CurrencySelector from './components/currency-selector/CurrencySelector';

const Overview = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [totalNetWorth, setTotalNetWorth] = useState(0);
    const [assets, setAssets] = useState([]);
    const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
    const [netWorthHistory, setNetWorthHistory] = useState([]);
    const [activeView, setActiveView] = useState('total');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(() => {
        const savedCurrency = localStorage.getItem('selectedCurrency');
        return savedCurrency ? JSON.parse(savedCurrency) : currencies[0];
    });
    const location = useLocation();
    const [convertedAssets, setConvertedAssets] = useState([]);
    const [convertedNetWorth, setConvertedNetWorth] = useState(0);
    const [convertedHistory, setConvertedHistory] = useState([]);
    const [isConverting, setIsConverting] = useState(false);
    const [searchParams] = useSearchParams();
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        localStorage.setItem('selectedCurrency', JSON.stringify(selectedCurrency));
    }, [selectedCurrency]);

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
        // Check both URL parameters and location state
        const urlParams = new URLSearchParams(window.location.search);
        const shouldShowOnboarding = urlParams.get('showOnboarding') === 'true' ||
            location.state?.showOnboarding;

        if (shouldShowOnboarding) {
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
        const result = await updateAsset(updatedAsset, selectedCurrency);
        if (result.success) {
            await loadData();
        }
    };

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
    };

    const convertAllAmounts = async () => {
        if (selectedCurrency.code === 'USD') {
            // If USD, no conversion needed
            setConvertedAssets(assets);
            setConvertedNetWorth(totalNetWorth);
            setConvertedHistory(netWorthHistory);
            return;
        }

        // Check if we need to fetch new rates
        if (!needsConversion('USD', selectedCurrency.code)) {
            // Use cached rates
            try {
                const convertedWorth = await convertCurrency(totalNetWorth, 'USD', selectedCurrency.code);
                setConvertedNetWorth(convertedWorth);

                const newAssets = await Promise.all(assets.map(async (asset) => ({
                    ...asset,
                    current_price: await convertCurrency(asset.current_price, 'USD', selectedCurrency.code),
                    value: await convertCurrency(asset.value, 'USD', selectedCurrency.code),
                })));
                setConvertedAssets(newAssets);

                const newHistory = await Promise.all(netWorthHistory.map(async (entry) => ({
                    ...entry,
                    total_value: await convertCurrency(entry.total_value, 'USD', selectedCurrency.code),
                })));
                setConvertedHistory(newHistory);
                return;
            } catch (error) {
                console.error('Error converting with cached rates:', error);
            }
        }

        // If we need new rates or cached conversion failed
        setIsConverting(true);
        try {
            const convertedWorth = await convertCurrency(totalNetWorth, 'USD', selectedCurrency.code);
            setConvertedNetWorth(convertedWorth);

            const newAssets = await Promise.all(assets.map(async (asset) => ({
                ...asset,
                current_price: await convertCurrency(asset.current_price, 'USD', selectedCurrency.code),
                value: await convertCurrency(asset.value, 'USD', selectedCurrency.code),
            })));
            setConvertedAssets(newAssets);

            const newHistory = await Promise.all(netWorthHistory.map(async (entry) => ({
                ...entry,
                total_value: await convertCurrency(entry.total_value, 'USD', selectedCurrency.code),
            })));
            setConvertedHistory(newHistory);
        } catch (error) {
            console.error('Error converting currencies:', error);
        } finally {
            setIsConverting(false);
        }
    };

    useEffect(() => {
        convertAllAmounts();
    }, [selectedCurrency, totalNetWorth, assets, netWorthHistory]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await loadData();
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            loadData();
        }, 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const renderContent = () => {
        switch (activeView) {
            case 'assets':
                return (
                    <AssetsList
                        assets={convertedAssets}
                        onAddAsset={() => setIsAddAssetModalOpen(true)}
                        onDeleteAssets={handleDeleteAssets}
                        onUpdateAsset={handleUpdateAsset}
                        selectedCurrency={selectedCurrency}
                        isConverting={isConverting}
                    />
                );
            case 'split':
                return (
                    <AssetDistributionChart
                        data={convertedAssets.map(asset => ({
                            name: asset.name,
                            value: asset.value
                        }))}
                        selectedCurrency={selectedCurrency}
                        isConverting={isConverting}
                    />
                );
            case 'history':
                return (
                    <NetWorthHistory
                        data={convertedHistory}
                        selectedCurrency={selectedCurrency}
                        isConverting={isConverting}
                    />
                );
            default:
                return <AssetsList
                    assets={convertedAssets}
                    onAddAsset={() => setIsAddAssetModalOpen(true)}
                    onDeleteAssets={handleDeleteAssets}
                    onUpdateAsset={handleUpdateAsset}
                    selectedCurrency={selectedCurrency}
                    isConverting={isConverting}
                />
        }
    };

    return (
        <div className="overview-container">
            <BackgroundPattern />
            <div className="overview-header">
                {user && <Welcome firstName={user.first_name} lastName={user.last_name} />}
                <div className="header-controls">
                    <CurrencySelector
                        selectedCurrency={selectedCurrency}
                        onCurrencyChange={setSelectedCurrency}
                    />
                </div>
            </div>

            <div className="net-worth-section">
                <NetWorthBox
                    amount={convertedNetWorth}
                    change={calculateNetWorthChange(convertedHistory, convertedNetWorth)}
                    selectedCurrency={selectedCurrency}
                    isConverting={isConverting}
                    onRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
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
                selectedCurrency={selectedCurrency}
            />

            {showOnboarding && <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />}
        </div>
    );
};

export default Overview;