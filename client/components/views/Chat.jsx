"use client";

import { useState, useEffect } from "react";

export default function Chat({ gameSocket, game }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        gameSocket.on("new-chat-message", (data) => {
            setMessages((messages) => {
                return [...messages, data];
            });
            setMessage("");
        });
    }, []);

    useEffect(() => {
        if (messages.length > 10) {
            setMessages((messages) => {
                return messages.slice(1);
            });
        }
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message) return;
        gameSocket.emit("chat-message", { roomID: game.uuid, message });
    };

    return (
        <div className="flex flex-col justify-around items-center h-full space-y-4 mt-4 md:border-l pl-4 border-dashed border-gray-500">
            <div className="space-y-2 self-center flex flex-col">
                <h2 className="text-2xl">Chat</h2>
                <p className="text-xs">disappearing mode</p>
            </div>
            <div className="flex flex-col space-y-2 self-start gap-2">
                {messages.map((m, i) => (
                    <div key={i} className="flex flex-col text-left">
                        <p className="font-bold">{m.username}:</p>
                        <p className="text-left">{m.message}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                    type="text"
                    value={message}
                    placeholder="Type a message..."
                    onChange={(e) => setMessage(e.target.value)}
                    className="border border-gray-300 rounded p-1 text-black"
                />
                <button
                    type="submit"
                    className="bg-blue-400 text-white p-1 rounded"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
