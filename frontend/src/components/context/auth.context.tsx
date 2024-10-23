"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AuthService from '../service/auth.service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<Boolean>;
    register: (name:string, email: string, password: string) => Promise<Boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    const login = async (email: string, password: string) => {
        try {
            const user = await AuthService.login(email, password);
            console.log(user);
            if (user.accessToken) {
                setIsAuthenticated(true);
                router.push('/dashboard'); // Redirect to dashboard or any protected route
                return true;
            }
            return false;
        } catch (error) {
            setIsAuthenticated(false);
            console.error('Login failed', error);
            return false;
        }
        return false;
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const user = await AuthService.register(name, email, password);
            console.log(user);
            router.push('/auth/login'); // Redirect to dashboard or any protected route
        } catch (error) {
            setIsAuthenticated(false);
            return false;
        }
        return false;
    }

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        router.push('/auth/login'); // Redirect to login page
    };

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user && user.accessToken) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};