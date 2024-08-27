"use client";

// import hooks
import { useState, useEffect } from "react";
import { useGameSocket } from "@/utilities/hooks/useGameSocket";

export default function Page() {
    const [isConnected, gameSocket] = useGameSocket();
    const [games, setGames] = useState([]);

    useEffect(() => {
        if (!isConnected) return;
        // emit join game event
        gameSocket?.emit("list-games");
        // listen for join game response
        gameSocket?.on("list-games-response", (data) => {
            setGames(data.games);
        });
    }, [isConnected]);

    return (
        <main className="flex flex-col justify-start items-center h-screen w-full text-center p-8">
            <h1 className="text-4xl">Your Games</h1>
            <a href="/dashboard" className="underline my-4">
                Return
            </a>
            <div className="flex flex-row w-full h-max justify-start items-center gap-4">
                {games?.map((game) => (
                    <div
                        key={game.uuid}
                        className="flex flex-col space-y-4 justify-around items-center h-full w-48 text-center p-4 border border-blue-300 rounded-md"
                    >
                        <p>Room: {game.name}</p>
                        <p>Players: {game.players.join(",")}</p>
                        <p>Winner: {game.winner}</p>
                        <p>
                            Started: {new Date(game.startedAt).toLocaleString()}
                        </p>
                        {game.endedAt && (
                            <p>
                                Ended: {new Date(game.endedAt).toLocaleString()}
                            </p>
                        )}
                        {!game.endedAt && (
                            <a
                                href={`/game/${game.uuid}`}
                                className="underline"
                            >
                                Join
                            </a>
                        )}
                        {
                            // end game button
                            !game.endedAt && (
                                <button
                                    className="bg-red-400 text-white rounded-md p-1"
                                    onClick={() => {
                                        gameSocket?.emit("force-end-game", {
                                            uuid: game.uuid,
                                        });
                                    }}
                                >
                                    End Game
                                </button>
                            )
                        }
                    </div>
                ))}
            </div>
        </main>
    );
}
