import supabase from '../../../../subabaseClient.js';
import { setSession } from './sessionManager.js';

const logIn = async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });
    if (error) {
        console.log('Login error:', error);
        throw error;
    };
    setSession(data.session);
    return data;
};

export default logIn;