"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGameSocket } from "@/utilities/hooks/useGameSocket";

const STATUS = {
    DEFAULT: "default",
    SUCCESS: "success",
    ERROR: "error",
    LOADING: "loading",
};

export default function Page() {
    const [isConnected, gameSocket] = useGameSocket();
    const [message, setMessage] = useState("");
    const [roomID, setRoomID] = useState("");
    const [status, setStatus] = useState(STATUS.DEFAULT);

    useEffect(() => {
        // listen for start game response
        gameSocket?.on("start-game-response", (data) => {
            console.log("start-game-response", data);
            setMessage(data.message);
            setRoomID(data.roomID);
            if (data.status === "success") {
                setStatus(STATUS.SUCCESS);
            } else {
                setStatus(STATUS.ERROR);
            }
        });
    });

    const handleStartGame = () => {
        if (status === STATUS.LOADING) return;

        // validate room name and connection status
        const roomName = document.getElementById("room-name").value;
        if (!roomName) {
            alert("Please enter a room name!");
            return;
        }
        if (!isConnected) {
            alert("Connection failed, please reload and try again!");
            return;
        }
        setStatus(STATUS.LOADING);
        gameSocket?.emit("start-game", { roomName });
    };

    return (
        <main className="grid grid-cols-1 justify-center items-center h-screen w-full text-center">
            <div className="flex flex-col space-y-8 justify-center items-center h-full w-full text-center border-b">
                <h1 className="text-4xl">New Game</h1>
                <p>{isConnected ? "🟢 Online" : "🔴 Disconnected"}</p>
                <input
                    id="room-name"
                    type="text"
                    className="rounded-md p-2 text-black"
                    placeholder="room name"
                />
                <Button
                    onClick={handleStartGame}
                    disabled={status === STATUS.LOADING}
                >
                    Start
                </Button>
                <p className="px-8">{message}</p>
                {roomID && (
                    // link to game page
                    <a className="underline" href={`/game/${roomID}`}>
                        Join above game
                    </a>
                )}
                {
                    // button to copy and share room id
                    roomID && (
                        <Button
                            onClick={(e) => {
                                navigator.clipboard.writeText(
                                    `${window.location.origin}/game/${roomID}`
                                );
                                e.target.textContent = "Copied ✅";
                                setTimeout(() => {
                                    e.target.textContent = "Copy Room Link";
                                }, 1000);
                            }}
                        >
                            Copy Room Link
                        </Button>
                    )
                }
                <a className="underline" href="/dashboard">
                    Return
                </a>
            </div>
        </main>
    );
}
