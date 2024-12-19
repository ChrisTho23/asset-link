import AssetCard from '../asset-card/AssetCard';
import './AssetsList.css';

const AssetsList = ({ assets }) => (
    <div className="assets-container">
        <h3 className="assets-title">Your Assets</h3>
        <div className="list-header">
            <div className="asset-name">Name</div>
            <div className="detail-label">Quantity</div>
            <div className="detail-label">Price</div>
            <div className="detail-label">Total Value</div>
        </div>
        {assets.map(asset => (
            <AssetCard key={asset.id} asset={asset} />
        ))}
    </div>
);

export default AssetsList; 