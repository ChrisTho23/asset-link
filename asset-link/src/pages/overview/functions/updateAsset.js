import supabase from "../../../../subabaseClient";
import { convertCurrency } from "../../../utils/currencyConverter";

const updateAsset = async (updatedAsset, selectedCurrency) => {
    try {
        let currentPrice = updatedAsset.current_price;
        let value = updatedAsset.value;

        // Convert values to USD if not already in USD
        if (selectedCurrency.code !== 'USD') {
            currentPrice = await convertCurrency(
                currentPrice,
                selectedCurrency.code,
                'USD'
            );
            value = await convertCurrency(
                value,
                selectedCurrency.code,
                'USD'
            );
        }

        const { error } = await supabase
            .from('assets')
            .update({
                units: updatedAsset.units,
                current_price: currentPrice,
                value: value
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