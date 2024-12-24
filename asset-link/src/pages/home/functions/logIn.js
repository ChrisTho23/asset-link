import supabase from '../../../../subabaseClient.js';
import { setSession } from './sessionManager.js';
import checkEmailExists from './checkEmailExists.js';

const logIn = async (credentials) => {
    // If credentials are provided, perform email/password login
    if (credentials) {
        // First check if the email exists
        const { exists } = await checkEmailExists(credentials.email);

        if (!exists) {
            throw new Error('No account found with this email. Please sign up first.');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                throw new Error('Incorrect password for this email.');
            }
            throw error;
        }

        setSession(data.session);
        return data;
    }

    // If no credentials, get current session (used for OAuth redirect)
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (!data.session) {
        throw new Error('No active session found');
    }

    setSession(data.session);
    return data;
};

export default logIn;