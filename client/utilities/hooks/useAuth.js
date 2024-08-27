'use client';
import { useState, useEffect } from "react";

const STATUS = {
    LOADING: "loading",
    AUTHENTICATED: "authenticated",
    UNAUTHENTICATED: "unauthenticated",
};

export const useAuth = () => {
    const [username, setUsername] = useState(null);
    const [status, setStatus] = useState(STATUS.LOADING);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            const response = await fetch("/api/auth/user");
            if (response.status === 200) {
                const user = await response.json();
                setUsername(user.username);
                setStatus(STATUS.AUTHENTICATED);
            } else {
                setStatus(STATUS.UNAUTHENTICATED);
            }
        } catch (error) {
            console.error("Authentication error:", error.toString());
            setStatus(STATUS.UNAUTHENTICATED);
        }
    };

    return [username, status];
};