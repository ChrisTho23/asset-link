import supabase from '../../../../subabaseClient.js';

const oAuthSignUp = async (provider) => {
    if (provider !== 'google') {
        throw new Error('Only Google provider is supported at this time');
    }

    // Determine the redirect URL based on the environment
    const redirectUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:5173'  // Adjust this port if yours is different
        : 'https://asset-link-keb6.vercel.app';

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            access_type: 'offline',
            prompt: 'consent',
            redirectTo: redirectUrl
        }
    });

    if (error) {
        console.log('Login error:', error);
        throw error;
    };
    return data;
};

export default oAuthSignUp;