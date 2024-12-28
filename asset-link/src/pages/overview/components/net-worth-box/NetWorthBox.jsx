import './NetWorthBox.css';
import { icons } from '../../../../assets/icons';
import { formatCurrency } from '../../../../utils/numberFormatter';

const NetWorthBox = ({ amount, change, selectedCurrency, isConverting, onRefresh, isRefreshing }) => (
    <div className="net-worth-box">
        <div className="net-worth-header">
            <h3 className="section-title">
                <span className="title-icon">{icons.find(i => i.id === 'net-worth').icon}</span>
                Total Net Worth
            </h3>
            <button
                className="refresh-button"
                onClick={onRefresh}
                disabled={isRefreshing || isConverting}
            >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
        </div>
        <div className="net-worth-content">
            {isConverting ? (
                <span className="loading">Converting...</span>
            ) : (
                <>
                    <span className="net-worth-amount">
                        {selectedCurrency.symbol}{formatCurrency(amount)}
                    </span>
                    {change && (
                        <div className={`change-indicator ${change.value >= 0 ? 'positive' : 'negative'}`}>
                            <span className="change-value">
                                {change.value >= 0 ? '+' : ''}{selectedCurrency.symbol}{formatCurrency(Math.abs(change.value))}
                            </span>
                            <span className="change-percentage">
                                ({change.value >= 0 ? '+' : ''}{formatCurrency(change.percentage)}%)
                            </span>
                            <span className="change-timeframe">
                                {change.timeframe}
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    </div>
);

export default NetWorthBox; 