import { useState, useEffect } from 'react';
import './AddAssetModal.css';
import addAsset from '../../functions/addAsset';
import searchSymbol from '../../functions/searchSymbol';

const AddAssetModal = ({ isOpen, onClose }) => {
    const [assetData, setAssetData] = useState({
        name: '',
        ticker: '',
        units: '',
        currentPrice: '',
        type: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const searchTimeout = setTimeout(async () => {
            if (searchQuery && searchQuery.length >= 2) {
                setIsSearching(true);
                const results = await searchSymbol(searchQuery);
                setSearchResults(results);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(searchTimeout);
    }, [searchQuery]);

    const handleSymbolSelect = (result) => {
        setAssetData({
            ...assetData,
            ticker: result.symbol,
            name: result.name
        });
        setSearchResults([]);
        setSearchQuery(result.symbol);
    };

    const assetTypes = [
        { value: 'stock', label: 'Stock' },
        { value: 'crypto', label: 'Cryptocurrency' },
        { value: 'precious_metals', label: 'Precious Metals' },
        { value: 'real_estate', label: 'Real Estate' },
        { value: 'equity', label: 'Private Equity' },
        { value: 'cash', label: 'Cash' }
    ];

    const handleTypeSelect = (type) => {
        setAssetData({
            ...assetData,
            type,
            units: type === 'real_estate' ? '1' : '',
            ...(type === 'cash' && { name: 'Cash', currentPrice: '1' })
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = {
            ...assetData,
            units: parseFloat(assetData.units),
            currentPrice: assetData.currentPrice ? parseFloat(assetData.currentPrice) : null
        };
        const result = await addAsset(submitData);
        setAssetData({ type: '', name: '', units: '', currentPrice: '', ticker: '' });
        setSearchQuery('');
        setSearchResults([]);
        onClose(result.success);
    };

    const handleClose = () => {
        setSearchQuery('');
        setSearchResults([]);
        setAssetData({ type: '', name: '', units: '', currentPrice: '', ticker: '' });
        onClose(false);
    };

    const needsTickerSymbol = ['stock', 'crypto', 'precious_metals'].includes(assetData.type);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={handleClose}>×</button>
                <h2>Add New Asset</h2>

                <div className="asset-type-selection">
                    <h3>Select Asset Type</h3>
                    <div className="type-buttons">
                        {assetTypes.map((type) => (
                            <button
                                key={type.value}
                                className={`type-button ${assetData.type === type.value ? 'active' : ''}`}
                                onClick={() => handleTypeSelect(type.value)}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {assetData.type && (
                    <form onSubmit={handleSubmit} className={assetData.type ? 'visible' : ''}>
                        {needsTickerSymbol ? (
                            <>
                                <div className="form-group">
                                    <label>Search Stock</label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setAssetData({ ...assetData, ticker: e.target.value });
                                        }}
                                        placeholder="Search by company name or symbol"
                                        required
                                    />
                                    {isSearching && <div className="search-loading">Searching...</div>}
                                    {searchResults.length > 0 && (
                                        <div className="search-results">
                                            {searchResults.map((result) => (
                                                <div
                                                    key={result.symbol}
                                                    className="search-result-item"
                                                    onClick={() => handleSymbolSelect(result)}
                                                >
                                                    <span className="symbol">{result.symbol}</span>
                                                    <span className="name">{result.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Units</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={assetData.units}
                                        onChange={(e) => setAssetData({ ...assetData, units: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {assetData.type !== 'cash' && (
                                    <div className="form-group">
                                        <label>Asset Name</label>
                                        <input
                                            type="text"
                                            value={assetData.name}
                                            onChange={(e) => setAssetData({ ...assetData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}
                                {assetData.type === 'cash' ? (
                                    <div className="form-group">
                                        <label>Amount ($)</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={assetData.units}
                                            onChange={(e) => setAssetData({ ...assetData, units: e.target.value })}
                                            required
                                        />
                                    </div>
                                ) : assetData.type === 'real_estate' ? (
                                    <div className="form-group">
                                        <label>Property Value ($)</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={assetData.currentPrice}
                                            onChange={(e) => setAssetData({ ...assetData, currentPrice: e.target.value })}
                                            required
                                        />
                                    </div>
                                ) : assetData.type === 'equity' ? (
                                    <>
                                        <div className="form-group">
                                            <label>Price per Share ($)</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={assetData.currentPrice}
                                                onChange={(e) => setAssetData({ ...assetData, currentPrice: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </>
                                ) : null}
                            </>
                        )}
                        <div className="button-group">
                            <button type="submit" className="submit-button">
                                Add Asset
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddAssetModal; 