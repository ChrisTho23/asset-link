import supabase from "../../../../subabaseClient";

const deleteAssets = async (assetIds) => {
    try {
        const { error } = await supabase
            .from('assets')
            .delete()
            .in('id', assetIds);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting assets:', error);
        return { success: false, error };
    }
};

export default deleteAssets; 