import supabase from "../../../../subabaseClient";

const updateAsset = async (updatedAsset) => {
    try {
        const { error } = await supabase
            .from('assets')
            .update({
                units: updatedAsset.units,
                current_price: updatedAsset.current_price,
                value: updatedAsset.value
            })
            .eq('id', updatedAsset.id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error updating asset:', error);
        return { success: false, error };
    }
};

export default updateAsset; 