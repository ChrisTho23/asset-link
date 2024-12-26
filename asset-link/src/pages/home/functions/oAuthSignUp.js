import supabase from '../../../../subabaseClient.js';

const oAuthSignUp = async (provider) => {
    if (provider !== 'google') {
        throw new Error('Only Google provider is supported at this time');
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            access_type: 'offline',
            prompt: 'consent',
            redirectTo: 'https://asset-link-keb6.vercel.app/showOnboarding=true'
        }
    });
    if (error) {
        console.log('Login error:', error);
        throw error;
    };
    return data;
};

export default oAuthSignUp;