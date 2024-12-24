import supabase from '../../../../subabaseClient.js';

const signUp = async (credentials) => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
            emailRedirectTo: 'https://asset-link-keb6.vercel.app/',
        },
    });
    if (signUpError) {
        throw signUpError;
    }

    return signUpData;
};

export default signUp;