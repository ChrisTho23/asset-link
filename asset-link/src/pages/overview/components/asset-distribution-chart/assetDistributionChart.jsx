import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './assetDistributionChart.css';
import { formatCurrency } from '../../../../utils/numberFormatter';

const AssetDistributionChart = ({ data, selectedCurrency, isConverting }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Custom label renderer that only shows labels for segments > 3%
    const renderCustomLabel = ({ name, percent }) => {
        if (percent < 0.03) return null; // Skip labels for tiny segments
        return `${name} ${formatCurrency(percent * 100)}%`;
    };

    return (
        <div className="chart-container">
            <h3 className="chart-title">Asset Distribution</h3>
            <div className="chart-content">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                minAngle={3} // Ensures tiny segments are at least visible
                                label={renderCustomLabel}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${selectedCurrency.symbol}${formatCurrency(value)}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no-data-message">
                        No assets to display
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetDistributionChart;