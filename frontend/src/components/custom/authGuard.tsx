"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth.context';

const AuthGuard = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login'); // Redirect to login page if not authenticated
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // Render nothing or a loading spinner while redirecting
    }

    return <>{children}</>;
};

export default AuthGuard;