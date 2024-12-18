import supabase from '../../../subabaseClient.js';

const signUp = async (credentials) => {
    const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        /*options: {
            emailRedirectTo: 'https://example.com/welcome',
        },*/
    });
    if (error) {
        throw error;
    };
    return data;
};

export default signUp;