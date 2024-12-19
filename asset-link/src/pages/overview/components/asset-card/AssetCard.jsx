import './AssetCard.css';

const AssetCard = ({ asset }) => {
    return (
        <div className="asset-card">
            <div className="card-content">
                <div className="asset-name">{asset.name}</div>
                <div className="detail-value">{parseFloat(asset.units).toFixed(2)}</div>
                <div className="detail-value">${parseFloat(asset.current_price).toLocaleString()}</div>
                <div className="detail-value">${parseFloat(asset.value).toLocaleString()}</div>
            </div>
        </div>
    );
};

export default AssetCard; 