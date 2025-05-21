"use client";

// import hooks
import { useState, useEffect } from "react";
import { useGameSocket } from "@/utilities/hooks/useGameSocket";
import Container from "@/components/simple/Container";

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
        <main className="py-12">
            <Container className="flex flex-col items-center space-y-6 text-center">
                <h1 className="text-4xl font-bold">Your Games</h1>
                <a href="/dashboard" className="underline">
                    Return
                </a>
                <div className="flex flex-row flex-wrap w-full justify-start items-stretch gap-4">
                    {games?.map((game) => (
                        <div
                            key={game.uuid}
                            className="flex flex-col space-y-4 justify-around items-center h-max w-48 text-center p-4 border border-blue-300 rounded-md shadow"
                        >
                            <p>Room: {game.name}</p>
                        <p>Players:</p>
                        <ul>
                            {game.players.map((player) => (
                                <li key={player}>{player}</li>
                            ))}
                        </ul>
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
            </Container>
        </main>
    );
}
