import supabase from '../../../../subabaseClient';
import { clearSession } from './sessionManager';

const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        clearSession();
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error);
        return { success: false, error };
    }
};

export default signOut;