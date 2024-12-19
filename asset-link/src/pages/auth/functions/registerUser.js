import supabase from '../../../../subabaseClient.js';

const registerUser = async (authData, userData) => {
    // Debug: Check if we have an active session
    const { data: session } = await supabase.auth.getSession();
    console.log('Current session id:', session?.user?.id); // Just log the ID to keep it clean

    // Debug: Log the update attempt
    console.log('Attempting update with:', {
        userId: authData.user?.id,
        updateData: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            birth_date: new Date(userData.birthDate).toISOString().split('T')[0]
        }
    });

    const { data, error } = await supabase
        .from('users')
        .update({
            first_name: userData.firstName,
            last_name: userData.lastName,
            birth_date: new Date(userData.birthDate).toISOString().split('T')[0]
        })
        .eq('id', authData.user?.id)
        .select();

    // Debug: Log the complete response
    console.log('Update operation result:', {
        success: !!data && !error,
        data: data,
        error: error,
        errorMessage: error?.message,
        errorDetails: error?.details
    });

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