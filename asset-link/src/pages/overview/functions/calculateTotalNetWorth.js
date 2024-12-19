const calculateTotalNetWorth = (assets) => {
    return assets.reduce((total, asset) => total + asset.totalWorth, 0);
};

export default calculateTotalNetWorth;