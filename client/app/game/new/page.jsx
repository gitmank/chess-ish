"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGameSocket } from "@/utilities/hooks/useGameSocket";
import Container from "@/components/simple/Container";

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
        <main className="py-12">
            <Container className="flex flex-col space-y-8 justify-center items-center text-center">
                <h1 className="text-4xl font-bold">New Game</h1>
                <p>{isConnected ? "🟢 Online" : "🔴 Disconnected"}</p>
                <input
                    id="room-name"
                    type="text"
                    className="rounded-md p-2 text-black w-full max-w-sm"
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
            </Container>
        </main>
    );
}
