import supabase from "../../../../subabaseClient";

const logNetWorthHistory = async (userId, totalWorth) => {
    const { error } = await supabase
        .from('net_worth_history')
        .insert([{
            user_id: userId,
            total_value: totalWorth
        }]);

    if (error) throw error;
};

export default logNetWorthHistory;