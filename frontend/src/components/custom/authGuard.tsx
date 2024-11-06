"use client";

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth.context';

const AuthGuard = ({ children }: { children: ReactNode }) => {
    const { is_Authenticated } = useAuth();
    const router = useRouter();
    const [isAuthenticatedState, setAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        is_Authenticated().then((isAuthenticated) => {
            setAuthenticated(isAuthenticated);
            if (!isAuthenticated) {
                router.push('/auth/login'); // Redirect to login page
            }
        }
        );
    }, []);

    if (!isAuthenticatedState) {
        // return null; // Render nothing or a loading spinner while redirecting
        return (
            // Spinner
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;