"use client"
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider ({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function FetchUser(){
            try {
                const response = await fetch("/api/auth/me");
                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        FetchUser();

    }, []);

    return (
        <AuthContext.Provider value={{user, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}