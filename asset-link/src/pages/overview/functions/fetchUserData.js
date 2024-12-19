import supabase from "../../../../subabaseClient";

const fetchUserData = async (userId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
};

export default fetchUserData;