import supabase from '../../../../subabaseClient.js';

const registerUser = async (authData, userData) => {
    const { data, error } = await supabase
        .from('users')
        .update({
            first_name: userData.firstName,
            last_name: userData.lastName,
            birth_date: new Date(userData.birthDate).toISOString().split('T')[0]
        })
        .eq('id', authData.user?.id)
        .select();

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