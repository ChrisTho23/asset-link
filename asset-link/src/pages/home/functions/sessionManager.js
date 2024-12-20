const getSession = () => {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : null;
};

const setSession = (session) => {
    localStorage.setItem('session', JSON.stringify(session));
};

const clearSession = () => {
    localStorage.removeItem('session');
};

export { getSession, setSession, clearSession };