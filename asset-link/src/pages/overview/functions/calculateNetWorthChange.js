const calculateNetWorthChange = (historyData, currentWorth) => {
    if (!historyData || historyData.length === 0) {
        return { value: 0, percentage: 0 };
    }

    // Get timestamp from one week ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Find the closest data point to one week ago
    const pastEntry = historyData
        .filter(entry => new Date(entry.timestamp) <= oneWeekAgo)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    // If no past entry exists, use the earliest available entry
    const referenceEntry = pastEntry || historyData[0];

    if (!referenceEntry) return { value: 0, percentage: 0 };

    const change = currentWorth - referenceEntry.total_value;
    const percentage = (change / referenceEntry.total_value) * 100;

    return {
        value: change,
        percentage: percentage,
        timeframe: pastEntry ? '7d' : 'since ' + new Date(referenceEntry.timestamp).toLocaleDateString()
    };
};

export default calculateNetWorthChange; 