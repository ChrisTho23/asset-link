import supabase from "../../../../subabaseClient";

const fetchUserAssets = async (userId) => {
    const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', userId)
        .order('name');

    if (error) throw error;

    return data.map(asset => ({
        ...asset,
        totalWorth: parseFloat(asset.value || 0),
        units: parseFloat(asset.units || 0),
        currentPrice: parseFloat(asset.current_price || 0)
    }));
};

export default fetchUserAssets;