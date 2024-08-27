'use client';

// imports
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

export const useGameSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const gameSocketRef = useRef(null);

    // connect if socket is null
    useEffect(() => {
        if (!gameSocketRef.current) connect();
    }, [isConnected]);

    // connect to protected namespace using socket token
    const connect = async () => {
        const token = await fetch("/api/protected/socketToken")
            .then(res => res.json())
            .then(data => data.socketToken);
        gameSocketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}/game`, {
            auth: { token },
            reconnectionAttempts: 10,
            timeout: 5000,
        });
        gameSocketRef.current.on("connect", () => {
            setIsConnected(true);
        });
        gameSocketRef.current.on("disconnect", () => {
            setIsConnected(false);
        });
    }

    return [isConnected, gameSocketRef.current];
}