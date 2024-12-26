import fetchPrice from './fetchPrice';

async function updateAssetPrices(assets) {
    return Promise.all(assets.map(async (asset) => {
        if (['stock', 'crypto', 'precious_metals'].includes(asset.type)) {
            try {
                const priceData = await fetchPrice(asset.type, asset.ticker);
                return {
                    ...asset,
                    price_per_unit: priceData.price,
                    totalWorth: priceData.price * asset.quantity
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