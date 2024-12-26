import supabase from "../../../../subabaseClient";

const fetchNetWorthHistory = async (userId) => {
    const { data, error } = await supabase
        .from('net_worth_history')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true });

    if (error) throw error;
    return data;
};

export default fetchNetWorthHistory; 