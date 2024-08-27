"use client";

export default function PlayingBoard({
    pieces,
    username,
    plays,
    makeMove,
    setSelectedPiece,
}) {
    // make 5x5 array
    const emptyBoard = Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => null)
    );

    return (
        <div className="grid grid-cols-5 gap-1">
            {
                // map through the 5x5 array
                emptyBoard.map((row, i) =>
                    row.map((_, j) => {
                        // find the piece in the pieces array
                        const piece = pieces.find(
                            (p) => p.location[0] === i && p.location[1] === j
                        );
                        const play = plays.find(
                            (p) => p.location[0] === i && p.location[1] === j
                        );
                        // render the piece or empty cell
                        return (
                            <div
                                key={`${i}-${j}`}
                                className={
                                    "bg-gray-400 h-12 w-12 select-none cursor-pointer"
                                }
                                onClick={() => {
                                    if (play) {
                                        makeMove(play.location);
                                        return;
                                    }
                                    setSelectedPiece(piece);
                                }}
                            >
                                {piece && play ? (
                                    <div
                                        className={
                                            piece.owner === username
                                                ? "bg-green-400 h-12 w-12 flex justify-center items-center border-2 border-red-500 select-none cursor-pointer"
                                                : "bg-red-400 h-12 w-12 flex justify-center items-center border-2 border-green-500 select-none cursor-pointer"
                                        }
                                    >
                                        <span
                                            className={
                                                piece.owner === username
                                                    ? "text-2xl text-red-500"
                                                    : "text-2xl text-green-500"
                                            }
                                        >
                                            {piece.type}
                                        </span>
                                    </div>
                                ) : piece ? (
                                    <div
                                        className={
                                            piece.owner === username
                                                ? "bg-green-400 h-12 w-12 flex justify-center items-center select-none cursor-pointer"
                                                : "bg-red-400 h-12 w-12 flex justify-center items-center select-none cursor-pointer"
                                        }
                                    >
                                        <span className={"text-2xl text-white"}>
                                            {piece.type}
                                        </span>
                                    </div>
                                ) : play ? (
                                    <div
                                        className={
                                            "h-12 w-12 bg-blue-400 select-none cursor-pointer"
                                        }
                                    ></div>
                                ) : (
                                    ""
                                )}
                            </div>
                        );
                    })
                )
            }
        </div>
    );
}
