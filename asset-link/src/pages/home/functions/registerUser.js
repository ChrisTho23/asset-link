import supabase from '../../../../subabaseClient.js';

const registerUser = async (id, userData) => {
    const { data, error } = await supabase
        .from('users')
        .update({
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email
        })
        .eq('id', id)
        .select();

    console.log()

    if (error) {
        console.error('Error updating user:', error);
        throw new Error(error.message);
    }

    if (!data || data.length === 0) {
        throw new Error('No data returned from update operation');
    }

    return data[0];
};

export default registerUser;