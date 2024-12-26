import { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import './NetWorthHistory.css';

const NetWorthHistory = ({ data }) => {
    const [timeRange, setTimeRange] = useState('month');
    // Possible values: 'year', 'month', 'week', 'day'

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        switch (timeRange) {
            case 'day':
                return date.toLocaleTimeString(undefined, { hour: 'numeric' });
            case 'week':
                return date.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
            case 'month':
                return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
            case 'year':
                return date.toLocaleDateString(undefined, { month: 'short' });
            default:
                return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
        }
    };

    const formatValue = (value) => {
        if (value == null) return '';
        return `$${value.toLocaleString()}`;
    };

    const getDateRange = (range) => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);

        let start;
        const MS_PER_DAY = 86400000;

        switch (range) {
            case 'day': {
                start = new Date(now.getTime() - MS_PER_DAY);
                break;
            }
            case 'week': {
                start = new Date(now.getTime() - 7 * MS_PER_DAY);
                start.setHours(0, 0, 0, 0);
                break;
            }
            case 'month': {
                start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
                break;
            }
            case 'year': {
                start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
                break;
            }
            default:
                start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
                break;
        }

        return { startDate: start, endDate: now };
    };

    /**
     * Aggregate data:
     *    - 'day': group hourly
     *    - 'week', 'month': group daily
     *    - 'year': group monthly
     */
    const aggregateDataPoints = (items, range) => {
        if (range === 'day') {
            const grouped = new Map();

            items.forEach((item) => {
                if (!item || item.timestamp == null) return;
                const d = new Date(item.timestamp);
                const key = new Date(
                    d.getFullYear(),
                    d.getMonth(),
                    d.getDate(),
                    d.getHours(),
                    d.getMinutes()
                ).getTime();

                if (!grouped.has(key)) {
                    grouped.set(key, {
                        timestamp: key,
                        sum: item.total_value ?? 0,
                        count: item.total_value != null ? 1 : 0,
                    });
                } else {
                    const existing = grouped.get(key);
                    existing.sum += item.total_value ?? 0;
                    existing.count += item.total_value != null ? 1 : 0;
                }
            });

            const aggregated = [];
            grouped.forEach((val) => {
                aggregated.push({
                    timestamp: val.timestamp,
                    total_value: val.count > 0 ? val.sum / val.count : null
                });
            });

            return aggregated.sort((a, b) => a.timestamp - b.timestamp);
        }

        if (range === 'week' || range === 'month') {
            const grouped = new Map();

            items.forEach((item) => {
                if (!item || item.timestamp == null) return;
                const d = new Date(item.timestamp);
                const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

                if (!grouped.has(key)) {
                    grouped.set(key, {
                        timestamp: key,
                        sum: item.total_value ?? 0,
                        count: item.total_value != null ? 1 : 0,
                    });
                } else {
                    const existing = grouped.get(key);
                    existing.sum += item.total_value ?? 0;
                    existing.count += item.total_value != null ? 1 : 0;
                }
            });

            const aggregated = [];
            grouped.forEach((val) => {
                aggregated.push({
                    timestamp: val.timestamp,
                    total_value: val.count > 0 ? val.sum / val.count : null
                });
            });

            return aggregated.sort((a, b) => a.timestamp - b.timestamp);
        }

        if (range === 'year') {
            const grouped = new Map();

            items.forEach((item) => {
                if (!item || item.timestamp == null) return;
                const d = new Date(item.timestamp);
                // Group by first day of each month
                const key = new Date(d.getFullYear(), d.getMonth(), 1).getTime();

                if (!grouped.has(key)) {
                    grouped.set(key, {
                        timestamp: key,
                        sum: item.total_value ?? 0,
                        count: item.total_value != null ? 1 : 0,
                    });
                } else {
                    const existing = grouped.get(key);
                    existing.sum += item.total_value ?? 0;
                    existing.count += item.total_value != null ? 1 : 0;
                }
            });

            const aggregated = [];
            grouped.forEach((val) => {
                aggregated.push({
                    timestamp: val.timestamp,
                    total_value: val.count > 0 ? val.sum / val.count : null
                });
            });

            return aggregated.sort((a, b) => a.timestamp - b.timestamp);
        }

        return [...items].sort((a, b) => a.timestamp - b.timestamp);
    };

    const fillMissingDates = (items, range, startDate, endDate) => {
        if (items.length === 0) return [];

        const mapByTimestamp = new Map(items.map((i) => [i.timestamp, i]));

        const result = [];
        const current = new Date(startDate.getTime());
        const finalEnd = new Date(endDate.getTime());

        const incrementDate = (date) => {
            if (range === 'day') {
                date.setMinutes(date.getMinutes() + 1);
            } else if (range === 'week' || range === 'month') {
                date.setDate(date.getDate() + 1);
            } else {
                date.setMonth(date.getMonth() + 1);
            }
        };

        while (current <= finalEnd) {
            let key;
            if (range === 'day') {
                key = new Date(
                    current.getFullYear(),
                    current.getMonth(),
                    current.getDate(),
                    current.getHours(),
                    current.getMinutes()
                ).getTime();
            } else if (range === 'week' || range === 'month') {
                key = new Date(
                    current.getFullYear(),
                    current.getMonth(),
                    current.getDate()
                ).getTime();
            } else {
                key = new Date(
                    current.getFullYear(),
                    current.getMonth(),
                    1
                ).getTime();
            }

            if (mapByTimestamp.has(key)) {
                result.push(mapByTimestamp.get(key));
            } else {
                result.push({ timestamp: key, total_value: null });
            }

            incrementDate(current);
        }

        return result;
    };

    const filterDataByTimeRange = (range) => {
        const { startDate, endDate } = getDateRange(range);

        if (!data || data.length === 0) {
            return fillMissingDates(
                [{ timestamp: startDate.getTime(), total_value: null }],
                range,
                startDate,
                endDate
            );
        }

        const filtered = data.filter((d) => {
            const t = new Date(d.timestamp).getTime();
            return t >= startDate.getTime() && t <= endDate.getTime();
        });

        const aggregated = aggregateDataPoints(filtered, range);

        if (aggregated.length === 0) {
            return fillMissingDates(
                [{ timestamp: startDate.getTime(), total_value: null }],
                range,
                startDate,
                endDate
            );
        }

        const filled = fillMissingDates(aggregated, range, startDate, endDate);
        return filled;
    };

    const finalData = filterDataByTimeRange(timeRange);

    const getThreeDayTicks = () => {
        if (finalData.length < 1) return [];
        const { startDate } = getDateRange('3days');
        // day 0, day 1, day 2 (today)
        const ticks = [];
        for (let i = 0; i < 3; i++) {
            const day = new Date(startDate);
            day.setDate(day.getDate() + i);
            ticks.push(day.getTime());
        }
        return ticks;
    };

    const getDayTicks = () => {
        if (finalData.length < 1) return [];
        const { startDate, endDate } = getDateRange('day');

        const ticks = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            ticks.push(current.getTime());
            current.setHours(current.getHours() + 2); // Every 2 hours to avoid overcrowding
        }

        return ticks;
    };

    return (
        <div className="history-chart-container">
            <div className="history-header">
                <h3 className="section-title">Net Worth History</h3>
                <div className="time-range-buttons">
                    <button
                        className={`time-range-button ${timeRange === 'day' ? 'active' : ''}`}
                        onClick={() => setTimeRange('day')}
                    >
                        24H
                    </button>
                    <button
                        className={`time-range-button ${timeRange === 'week' ? 'active' : ''}`}
                        onClick={() => setTimeRange('week')}
                    >
                        1W
                    </button>
                    <button
                        className={`time-range-button ${timeRange === 'month' ? 'active' : ''}`}
                        onClick={() => setTimeRange('month')}
                    >
                        1M
                    </button>
                    <button
                        className={`time-range-button ${timeRange === 'year' ? 'active' : ''}`}
                        onClick={() => setTimeRange('year')}
                    >
                        1Y
                    </button>
                </div>
            </div>

            <div className="chart-content">
                {finalData.length === 0 ? (
                    <div className="no-data-message">
                        No data available for the selected time period
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={finalData}
                            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="timestamp"
                                scale="time"
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                tickFormatter={formatDate}
                                padding={{ left: 30, right: 30 }}
                                ticks={timeRange === 'day' ? getDayTicks() : undefined}
                            />
                            <YAxis
                                tickFormatter={formatValue}
                                width={80}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip
                                labelFormatter={(ts) => formatDate(ts)}
                                formatter={(value) => [
                                    `$${(value ?? 0).toLocaleString()}`,
                                    'Net Worth'
                                ]}
                            />
                            <Line
                                type="monotone"
                                dataKey="total_value"
                                stroke="#007bff"
                                dot={(props) => {
                                    // Only render dots for points that have actual data
                                    if (props.payload.total_value !== null) {
                                        return (
                                            <circle
                                                cx={props.cx}
                                                cy={props.cy}
                                                r={3}
                                                fill="#007bff"
                                            />
                                        );
                                    }
                                    return null;
                                }}
                                connectNulls={true}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default NetWorthHistory;
