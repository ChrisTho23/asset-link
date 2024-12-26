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
        const updatedAsset = {
            ...editedAsset,
            units: parseFloat(editedAsset.units),
            current_price: parseFloat(editedAsset.current_price),
            value: parseFloat(editedAsset.units) * parseFloat(editedAsset.current_price)
        };
        await onSave(updatedAsset);
        setIsEditing(false);
        onClose();
    };

    const handleCancel = () => {
        setEditedAsset({
            ...asset,
            units: asset.units.toString(),
            current_price: asset.current_price?.toString() || ''
        });
        setIsEditing(false);
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

                {isEditing && (
                    <div className="modal-actions">
                        <button
                            className="cancel-button"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="save-button"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetDetailModal; 