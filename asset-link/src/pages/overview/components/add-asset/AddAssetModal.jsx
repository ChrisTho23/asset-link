import { useState, useEffect } from 'react';
import './AddAssetModal.css';
import addAsset from '../../functions/addAsset';
import searchSymbol from '../../functions/searchSymbol';
import { assetTypes } from '../../functions/assetTypes';
import { supportedCryptos } from '../../functions/cryptoConfig';
import { supportedPreciousMetals } from '../../functions/preciousMetalsConfig';
import { icons } from '../../../../assets/icons';

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
    const [skipSearch, setSkipSearch] = useState(false);

    useEffect(() => {
        if (skipSearch) {
            setSkipSearch(false);
            return;
        }

        const searchTimeout = setTimeout(async () => {
            if (searchQuery && searchQuery.length >= 2) {
                setIsSearching(true);
                let results;

                if (assetData.type === 'crypto') {
                    results = supportedCryptos.filter(crypto =>
                        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                } else if (assetData.type === 'precious_metals') {
                    results = Object.values(supportedPreciousMetals).filter(metal =>
                        metal.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        metal.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                } else {
                    results = await searchSymbol(searchQuery);
                }

                setSearchResults(results);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(searchTimeout);
    }, [searchQuery, assetData.type]);

    const handleSymbolSelect = async (result) => {
        setSkipSearch(true);
        setAssetData({
            ...assetData,
            ticker: result.symbol,
            name: result.name
        });
        setSearchResults([]);
        setSearchQuery(result.symbol);
    };

    const handleTypeSelect = (type) => {
        setAssetData({
            type,
            name: type === 'cash' ? 'Cash' : '',
            ticker: '',
            units: type === 'real_estate' ? '1' : '',
            currentPrice: type === 'cash' ? '1' : ''
        });
        setSearchQuery('');
        setSearchResults([]);
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

    const getIconById = (id) => {
        const iconObj = icons.find(icon => icon.id === id);
        return iconObj ? iconObj.icon : null;
    };

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
                                data-type={type.value}
                            >
                                {getIconById(type.value)}
                                <span>{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {assetData.type && (
                    <form onSubmit={handleSubmit} className={assetData.type ? 'visible' : ''}>
                        {needsTickerSymbol ? (
                            <>
                                <div className="form-group">
                                    <label>Search {assetData.type === 'precious_metals' ? 'Metal' : 'Stock'}</label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setAssetData({ ...assetData, ticker: e.target.value });
                                        }}
                                        placeholder="Search by name or symbol"
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
                                    <label>Units{assetData.type === 'precious_metals' ? ' (ounce)' : ''}</label>
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