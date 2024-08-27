"use client";

// import hooks
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useGameSocket } from "@/utilities/hooks/useGameSocket";
import { useAuth } from "@/utilities/hooks/useAuth";
import PlayingBoard from "@/components/views/PlayingBoard";
import Chat from "@/components/views/Chat";
import { movesCalculator } from "@/utilities/movesCalculator";

export default function Page() {
    const { uuid } = useParams();
    const [isConnected, gameSocket] = useGameSocket();
    const [game, setGame] = useState({});
    const [pieces, setPieces] = useState([]);
    const [username, status] = useAuth();
    const [plays, setPlays] = useState([]);
    const [selectedPiece, setSelectedPiece] = useState(null);

    useEffect(() => {
        if (!selectedPiece) return;
        if (game.currentTurn !== username) return;
        if (selectedPiece && selectedPiece?.owner !== username) return;
        const calculatedPlays = movesCalculator(selectedPiece, pieces);
        setPlays(calculatedPlays);
    }, [selectedPiece]);

    const makeMove = (location) => {
        gameSocket.emit("make-move", { uuid, piece: selectedPiece, location });
    };

    useEffect(() => {
        if (!isConnected) return;
        // emit join game event
        gameSocket.emit("join-game", { uuid });
        // listen for join game response
        gameSocket.on("join-game-response", (data) => {
            if (data.status === "error") {
                alert(data.message);
                return;
            }
            setGame(data?.game || {});
            setPieces(data?.pieces || []);
        });
        gameSocket.on("update-pieces", (data) => {
            setPieces(data.pieces);
            setSelectedPiece(null);
            setPlays([]);
        });
        gameSocket.on("update-game", (data) => {
            console.log(data.game.currentTurn);
            setGame(data.game);
            setSelectedPiece(null);
            setPlays([]);
        });
        gameSocket.on("make-move-response", (data) => {
            if (data.status === "error") {
                alert(data.message);
            }
        });
    }, [isConnected]);

    const submitPieces = (pieces) => {
        gameSocket.emit("set-pieces", { uuid, pieces });
    };

    if (!game || game?.uuid !== uuid || game?.endedAt) {
        return (
            <main className="grid grid-cols-1 justify-center items-center h-screen w-full text-center">
                <div className="flex flex-col space-y-8 justify-center items-center h-full w-full text-center border-b">
                    <h1 className="text-4xl">Game</h1>
                    <p>Room: {game?.name}</p>
                    <p>{isConnected ? "🟢 Online" : "🔴 Disconnected"}</p>
                    <p>Error fetching game!</p>
                    <a href="/dashboard" className="underline">
                        Return
                    </a>
                </div>
            </main>
        );
    }

    if (game.moves.length < 10) {
        return (
            <main className="flex flex-col justify-center items-center h-screen w-full p-4 text-center">
                <div className="flex flex-col space-y-8 justify-center items-center h-full w-full text-center border-b">
                    <h1 className="text-4xl">Game</h1>
                    <p>Room: {game?.name}</p>
                    <p>{isConnected ? "🟢 Online" : "🔴 Disconnected"}</p>
                    <p>{game.players.join(",")}</p>
                    <a href="/dashboard" className="underline">
                        Return
                    </a>
                </div>
                {pieces.filter((p) => p.owner === username).length !== 5 ? (
                    <PieceSetter submitPieces={submitPieces} />
                ) : (
                    <PieceWaiting pieces={pieces} />
                )}
            </main>
        );
    }

    return (
        <main className="grid grid-cols-1 md:grid-cols-[1fr_300px] h-screen w-full text-center p-4">
            <div className="flex flex-col justify-center items-center h-full w-full text-center gap-4">
                <h1 className="text-4xl">Game</h1>
                <p>
                    {isConnected
                        ? ` 🟢 Room: ${game?.name} `
                        : " 🔴 Refresh Page "}
                </p>
                <div className="flex flex-row w-max h-max gap-4 items-center justify-between">
                    <h1>Turn</h1>
                    {game.players.map((p) => (
                        <p
                            className={
                                game.currentTurn === p
                                    ? "p-1 rounded-md border bg-blue-400"
                                    : "p-1 rounded-md border border-gray-400"
                            }
                            key={p}
                        >
                            {p}
                            {p === username ? " (you)" : ""}
                        </p>
                    ))}
                </div>
                <a
                    href="/dashboard"
                    className="underline absolute top-4 left-4"
                >
                    Return
                </a>
                <PlayingBoard
                    pieces={pieces}
                    username={username}
                    plays={plays}
                    makeMove={makeMove}
                    setSelectedPiece={setSelectedPiece}
                />
                {game.currentTurn !== username ? (
                    <p className="text-xs animate-pulse">
                        Waiting for opponent
                    </p>
                ) : (
                    <p className="text-xs animate-pulse">
                        Select a piece to see moves
                    </p>
                )}
                {selectedPiece &&
                    selectedPiece.owner === username &&
                    game.currentTurn === username && (
                        <div className="flex flex-col gap-4">
                            <p>Selected Piece: {selectedPiece.type}</p>
                            {plays.length > 0 && (
                                <div className="flex flex-row gap-4 items-center w-full h-max flex-wrap">
                                    <h1>Plays</h1>
                                    {plays.map((play, index) => (
                                        <div
                                            key={index}
                                            className="bg-blue-400 p-2 rounded-md"
                                        >
                                            {selectedPiece.name}
                                            {" ->"}
                                            {play.location.join(",")}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
            </div>
            <Chat gameSocket={gameSocket} game={game} />
        </main>
    );
}

// Piece types
const DEFAULT_SET = ["P1", "P2", "H1", "H2", "P3"];

const PieceSetter = ({ submitPieces }) => {
    const [pieces, setPieces] = useState(DEFAULT_SET);
    const [selected, setSelected] = useState(null);

    const togglePieceType = (piece, index) => {
        if (!selected) {
            setSelected(piece);
            return;
        }
        // swap with selected
        const newPieces = [...pieces];
        newPieces[index] = selected;
        newPieces[pieces.indexOf(selected)] = piece;
        setPieces(newPieces);
        setSelected(null);
    };

    return (
        <div className="flex flex-col space-y-8 justify-center items-center h-full w-full text-center border-b">
            <h1 className="text-4xl">Set Pieces</h1>
            <p className="text-xs text-center">
                tap a piece to select, then another to swap
            </p>
            <div className="flex flex-row flex-wrap gap-4 justify-center items-center">
                {pieces.map((piece, index) => (
                    <div
                        key={index}
                        className={
                            piece === selected
                                ? "w-16 h-16 bg-blue-500 flex justify-center items-center cursor-pointer"
                                : "w-16 h-16 bg-gray-700 flex justify-center items-center cursor-pointer"
                        }
                        onClick={() => togglePieceType(piece, index)}
                    >
                        {piece}
                    </div>
                ))}
            </div>
            <button
                onClick={() => submitPieces(pieces)}
                className="bg-blue-500 text-white p-2 rounded-md"
            >
                Save
            </button>
        </div>
    );
};

const PieceWaiting = ({ pieces }) => {
    return (
        <div className="flex flex-col space-y-8 justify-center items-center h-full w-full text-center border-b">
            <h1 className="text-4xl">Your Pieces</h1>
            <p className="text-xs text-center">
                waiting for other player to set pieces
            </p>
            <div className="flex flex-row flex-wrap gap-4 justify-center items-center">
                {pieces.map((piece, index) => (
                    <div
                        key={index}
                        className="w-16 h-16 bg-blue-500 flex justify-center items-center cursor-pointer"
                        onClick={() => togglePieceType(piece, index)}
                    >
                        {piece.name}
                    </div>
                ))}
            </div>
        </div>
    );
};
