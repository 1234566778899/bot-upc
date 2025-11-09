import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from 'reactfire';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from 'reactfire';

export const AuthContext = createContext();

export const AuthContextApp = ({ children }) => {
    const auth = useAuth();
    const firestore = useFirestore();
    const [user, setUser] = useState(undefined);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const getUserData = useCallback(async (uid) => {
        try {
            const userDocRef = doc(firestore, 'users', uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData(data);
                return data;
            } else {
                console.log('No se encontró documento del usuario en Firestore');
                setUserData(null);
                return null;
            }
        } catch (error) {
            console.error('Error obteniendo datos del usuario:', error);
            setUserData(null);
            return null;
        }
    }, [firestore]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await getUserData(currentUser.uid);
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, getUserData]);

    const value = {
        user,
        auth,
        userData,
        setUserData,
        getUserData,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};