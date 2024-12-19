import supabase from '../../../../subabaseClient.js';

const signUp = async (credentials) => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        /*options: {
            emailRedirectTo: 'https://example.com/welcome',
        },*/
    });
    if (signUpError) {
        throw signUpError;
    }

    return signUpData;
};

export default signUp;