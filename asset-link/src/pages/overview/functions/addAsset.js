import supabase from "../../../../subabaseClient";
import fetchPrice from "./fetchPrice";

const addAsset = async (assetData) => {
    try {
        let name = assetData.name;
        let currentPrice = assetData.currentPrice;

        // Handle assets that use ticker symbols
        if (['stock', 'crypto', 'precious_metals'].includes(assetData.type)) {
            const priceData = await fetchPrice(assetData.type, assetData.ticker);
            name = priceData.name;
            currentPrice = priceData.price;
        }

        // Calculate total value
        const value = assetData.units * (currentPrice || 0);

        const { data, error } = await supabase
            .from('assets')
            .insert([
                {
                    name,
                    units: assetData.units,
                    current_price: currentPrice,
                    asset_type: assetData.type,
                    value,
                    user_id: (await supabase.auth.getUser()).data.user.id
                }
            ]);

        if (error) throw error;
        return { success: true, data };

    } catch (error) {
        console.error('Error adding asset:', error);
        return { success: false, error };
    }
};

export default addAsset; 