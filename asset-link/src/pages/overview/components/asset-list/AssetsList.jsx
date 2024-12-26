import { useState } from 'react';
import './AssetsList.css';
import AssetDetailModal from '../asset-detail/AssetDetailModal';
import { formatCurrency } from '../../../../utils/numberFormatter';

const AssetsList = ({ assets, onAddAsset, onDeleteAssets, onUpdateAsset, selectedCurrency, isConverting }) => {
    const [selectedAssets, setSelectedAssets] = useState(new Set());
    const [selectedAsset, setSelectedAsset] = useState(null);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedAssets(new Set(assets.map(asset => asset.id)));
        } else {
            setSelectedAssets(new Set());
        }
    };

    const handleAssetSelect = (assetId) => {
        const newSelected = new Set(selectedAssets);
        if (newSelected.has(assetId)) {
            newSelected.delete(assetId);
        } else {
            newSelected.add(assetId);
        }
        setSelectedAssets(newSelected);
    };

    const handleDeleteSelected = async () => {
        await onDeleteAssets(Array.from(selectedAssets));
        setSelectedAssets(new Set());
    };

    const handleRowClick = (asset, e) => {
        if (e.target.type === 'checkbox') return;
        setSelectedAsset(asset);
    };

    return (
        <div className="assets-container">
            {selectedAssets.size > 0 && (
                <div className={`bulk-actions ${selectedAssets.size > 0 ? 'visible' : ''}`}>
                    <span className="selected-count">
                        {selectedAssets.size} asset{selectedAssets.size !== 1 ? 's' : ''} selected
                    </span>
                    <button className="delete-button" onClick={handleDeleteSelected}>
                        Delete Selected
                    </button>
                </div>
            )}
            <div className="assets-header">
                <h3 className="assets-title">Your Assets</h3>
                <button className="add-asset-button" onClick={onAddAsset}>+</button>
            </div>
            {assets.length > 0 ? (
                <table className="assets-table">
                    <thead>
                        <tr>
                            <th className="checkbox-column">
                                <input
                                    type="checkbox"
                                    className="asset-checkbox"
                                    checked={selectedAssets.size === assets.length && assets.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="name-column">Name</th>
                            <th className="quantity-column">Quantity</th>
                            <th className="price-column">Price</th>
                            <th className="value-column">Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map(asset => (
                            <tr
                                key={asset.id}
                                className={selectedAssets.has(asset.id) ? 'selected' : ''}
                                onClick={(e) => handleRowClick(asset, e)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td className="checkbox-column">
                                    <input
                                        type="checkbox"
                                        className="asset-checkbox"
                                        checked={selectedAssets.has(asset.id)}
                                        onChange={() => handleAssetSelect(asset.id)}
                                    />
                                </td>
                                <td>{asset.name}</td>
                                <td>
                                    {isConverting ? '...' : parseFloat(asset.units).toFixed(2)}
                                </td>
                                <td>
                                    {isConverting ? '...' :
                                        `${selectedCurrency.symbol}${parseFloat(asset.current_price).toLocaleString()}`
                                    }
                                </td>
                                <td>
                                    {isConverting ? '...' : (
                                        `${selectedCurrency.symbol}${formatCurrency(asset.value, selectedCurrency.decimals)}`
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="no-assets-message">
                    You haven't added any assets yet. Click the + button to get started!
                </div>
            )}

            <AssetDetailModal
                asset={selectedAsset}
                isOpen={!!selectedAsset}
                onClose={() => setSelectedAsset(null)}
                onSave={onUpdateAsset}
                selectedCurrency={selectedCurrency}
            />
        </div>
    );
};

export default AssetsList;