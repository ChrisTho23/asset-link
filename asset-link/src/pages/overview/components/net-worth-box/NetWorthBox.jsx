import './NetWorthBox.css';
import { icons } from '../../../../assets/icons';

const NetWorthBox = ({ amount, change }) => (
    <div className="net-worth-box">
        <h3 className="section-title">
            <span className="title-icon">{icons.find(i => i.id === 'net-worth').icon}</span>
            Total Net Worth
        </h3>
        <div className="net-worth-content">
            <span className="net-worth-amount">${amount.toLocaleString()}</span>
            {change && (
                <div className={`change-indicator ${change.value >= 0 ? 'positive' : 'negative'}`}>
                    <span className="change-value">
                        {change.value >= 0 ? '+' : ''}${Math.abs(change.value).toLocaleString()}
                    </span>
                    <span className="change-percentage">
                        ({change.value >= 0 ? '+' : ''}{change.percentage.toFixed(2)}%)
                    </span>
                    <span className="change-timeframe">
                        {change.timeframe}
                    </span>
                </div>
            )}
        </div>
    </div>
);

export default NetWorthBox; 