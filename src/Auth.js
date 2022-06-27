import { createContext, useEffect, useState, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';


const userAuthContext = createContext();

export function UserAuthContextProvider({children}) {
    const [user, setUser] = useState("");

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    };

    function logout() {
        return signOut(auth);
    };

    function forgotPassword(email) {
        return sendPasswordResetEmail(auth, email);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        }
    }, []);

    const contextValues = {
        user, 
        signup, 
        login, 
        logout, 
        forgotPassword,
    }

    return (
        <userAuthContext.Provider value={contextValues}>
            {children}
        </userAuthContext.Provider>
    )
};

export function useUserAuth() {
    return useContext(userAuthContext);
};