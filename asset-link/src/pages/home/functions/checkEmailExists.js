import supabase from "../../../../subabaseClient";

export const checkEmailExists = async (email) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (error && error.code === 'PGRST116') {
            return { exists: false };
        }

        if (error) throw error;

        return { exists: !!data };
    } catch (error) {
        console.error('Error checking email:', error);
        throw new Error('Unable to verify email availability');
    }
};

export default checkEmailExists;