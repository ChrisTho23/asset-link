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

        const userId = (await supabase.auth.getUser()).data.user.id;

        // Check if asset already exists for this user
        const { data: existingAsset } = await supabase
            .from('assets')
            .select('*')
            .eq('user_id', userId)
            .eq('asset_type', assetData.type)
            .eq('name', name)
            .single();

        if (existingAsset) {
            // Update existing asset with merged units
            const { data, error } = await supabase
                .from('assets')
                .update({
                    units: existingAsset.units + assetData.units,
                    current_price: currentPrice,
                    value: (existingAsset.units + assetData.units) * (currentPrice || 0)
                })
                .eq('id', existingAsset.id)
                .select();

            if (error) throw error;
            return { success: true, data };
        } else {
            // Insert new asset
            const { data, error } = await supabase
                .from('assets')
                .insert([{
                    name,
                    units: assetData.units,
                    current_price: currentPrice,
                    asset_type: assetData.type,
                    value: assetData.units * (currentPrice || 0),
                    user_id: userId
                }])
                .select();

            if (error) throw error;
            return { success: true, data };
        }
    } catch (error) {
        console.error('Error adding asset:', error);
        return { success: false, error };
    }
};

export default addAsset; 