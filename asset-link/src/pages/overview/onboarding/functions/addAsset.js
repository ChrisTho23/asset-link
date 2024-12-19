const addAsset = async (assetData) => {
    try {
        const { data, error } = await supabase
            .from('assets')
            .insert([
                {
                    name: assetData.name,
                    units: assetData.units,
                    purchase_price: assetData.purchasePrice,
                    current_price: assetData.currentPrice,
                    asset_type: assetData.type
                }
            ]);

        if (error) throw error;

        // Refresh the assets list
        fetchAssetData();

    } catch (error) {
        console.error('Error adding asset:', error);
    }
};