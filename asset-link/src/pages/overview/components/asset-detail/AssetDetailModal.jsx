import { useState, useEffect } from 'react';
import './AssetDetailModal.css';

const AssetDetailModal = ({ asset, isOpen, onClose, onSave, selectedCurrency }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedAsset, setEditedAsset] = useState(null);

    // Initialize editedAsset when the modal opens
    useEffect(() => {
        if (asset) {
            setEditedAsset({
                ...asset,
                units: asset.units.toString(),
                current_price: asset.current_price?.toString() || ''
            });
        }
    }, [asset]);

    if (!isOpen || !asset || !editedAsset) return null;

    const canEditPrice = ['real_estate', 'equity'].includes(asset.asset_type);

    const handleSave = async () => {
        if (!editedAsset) return;

        // Calculate the new value in the current display currency
        const newValue = editedAsset.units * editedAsset.current_price;

        const assetToUpdate = {
            ...editedAsset,
            value: newValue
        };

        const result = await onSave(assetToUpdate, selectedCurrency);
        if (result.success) {
            onClose();
        }
    };

    const handleCancel = () => {
        setEditedAsset({
            ...asset,
            units: asset.units.toString(),
            current_price: asset.current_price?.toString() || ''
        });
        setIsEditing(false);
    };

    const renderDetails = () => {
        if (asset.asset_type === 'cash') {
            return (
                <div className="asset-details">
                    <div className="detail-row">
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">Cash</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Balance:</span>
                        {isEditing ? (
                            <input
                                type="number"
                                className="auth-input"
                                value={editedAsset.value}
                                onChange={(e) => setEditedAsset({
                                    ...editedAsset,
                                    value: e.target.value,
                                    units: e.target.value, // Keep units synced with value for cash
                                    current_price: 1 // Always 1 for cash
                                })}
                            />
                        ) : (
                            <span className="detail-value">
                                {selectedCurrency.symbol}{parseFloat(asset.value).toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="asset-details">
                <div className="detail-row">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">
                        {asset.asset_type.charAt(0).toUpperCase() + asset.asset_type.slice(1).replace('_', ' ')}
                    </span>
                </div>

                <div className="detail-row">
                    <span className="detail-label">Quantity:</span>
                    {isEditing ? (
                        <input
                            type="number"
                            className="auth-input"
                            value={editedAsset.units}
                            onChange={(e) => setEditedAsset({
                                ...editedAsset,
                                units: e.target.value
                            })}
                        />
                    ) : (
                        <span className="detail-value">{parseFloat(asset.units).toFixed(2)}</span>
                    )}
                </div>

                <div className="detail-row">
                    <span className="detail-label">Current Price:</span>
                    {isEditing && canEditPrice ? (
                        <input
                            type="number"
                            className="auth-input"
                            value={editedAsset.current_price}
                            onChange={(e) => setEditedAsset({
                                ...editedAsset,
                                current_price: e.target.value
                            })}
                        />
                    ) : (
                        <span className="detail-value">
                            {selectedCurrency.symbol}{parseFloat(asset.current_price).toLocaleString()}
                        </span>
                    )}
                </div>

                <div className="detail-row">
                    <span className="detail-label">Total Value:</span>
                    <span className="detail-value">
                        {selectedCurrency.symbol}{parseFloat(asset.value).toLocaleString()}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="modal-overlay">
            <div className="auth-modal">
                <button className="modal-close" onClick={onClose}>×</button>
                <div className="modal-header">
                    <h2>{asset.name}</h2>
                    {!isEditing && (
                        <button
                            className="edit-button"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                    )}
                </div>

                {renderDetails()}

                {isEditing && (
                    <div className="modal-actions">
                        <button className="cancel-button" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button className="save-button" onClick={handleSave}>
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetDetailModal; 