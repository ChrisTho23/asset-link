import supabase from '../../../subabaseClient.js';

const oAuthSignUp = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        /*options: {
            redirectTo: `${window.location.origin}/overview`
        }*/
    });
    if (error) {
        console.log('Login error:', error);
        throw error;
    };
    return data;
};

export default oAuthSignUp;