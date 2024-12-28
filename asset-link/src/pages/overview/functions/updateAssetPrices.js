import fetchPrice from './fetchPrice';

async function updateAssetPrices(assets) {
    return Promise.all(assets.map(async (asset) => {
        if (['stock', 'crypto', 'precious_metals'].includes(asset.type)) {
            try {
                const priceData = await fetchPrice(asset.type, asset.ticker);
                const newValue = priceData.price * asset.units;
                return {
                    ...asset,
                    current_price: priceData.price,
                    value: newValue,
                    totalWorth: newValue
                };
            } catch (error) {
                console.error(`Failed to update price for ${asset.name}:`, error);
                return asset;
            }
        }
        return asset;
    }));
}

export default updateAssetPrices; 