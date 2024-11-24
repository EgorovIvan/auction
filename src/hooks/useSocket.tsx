import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketHandler = {
    start: () => void;
    stop: () => void;
};

export const useSocket = (url: string, onMessage: (data: any) => void): SocketHandler => {
    const socketRef = useRef<WebSocket | null>(null);

    const start = () => {
        if (socketRef.current) return; // Уже запущен

        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Socket connected");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };

        socket.onclose = () => {
            console.log("Socket disconnected");
            socketRef.current = null;
        };

        socket.onerror = (error) => {
            console.error("Socket error:", error);
        };
    };

    const stop = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
    };

    useEffect(() => {
        return () => stop(); // Cleanup при размонтировании
    }, []);

    return { start, stop };
};
