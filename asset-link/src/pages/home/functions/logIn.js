import supabase from '../../../../subabaseClient.js';
import { setSession } from './sessionManager.js';

const logIn = async (credentials) => {
    try {
        // If credentials are provided, perform email/password login
        if (credentials) {
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

        // If no credentials, get current session
        console.log('Checking current session');
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error('Session error:', error);
            throw error;
        }

        console.log('Session data:', data);
        if (!data.session) {
            throw new Error('No active session found');
        }

        setSession(data.session);
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export default logIn;