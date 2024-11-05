import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../Firebase/Firebase'; // Adjust the path according to your project structure
import { fetchUser} from '../Firebase/FirebaseUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userData = await fetchUser(user.uid);
                setUser(userData);
                setAuthenticated(true);
            } else {
                setUser(null);
                setAuthenticated(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};