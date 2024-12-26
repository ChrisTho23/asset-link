import supabase from "../../../../subabaseClient";

const logNetWorthHistory = async (userId, totalWorth) => {
    // Get the most recent net worth entry
    const { data: lastEntry, error: fetchError } = await supabase
        .from('net_worth_history')
        .select('total_value')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(1);

    if (fetchError) throw fetchError;

    // Only log if there's no previous entry or the value has changed
    if (!lastEntry.length || lastEntry[0].total_value !== totalWorth) {
        const { error } = await supabase
            .from('net_worth_history')
            .insert([{
                user_id: userId,
                total_value: totalWorth,
                timestamp: new Date().toISOString()
            }]);

        if (error) throw error;
    }
};

export default logNetWorthHistory;