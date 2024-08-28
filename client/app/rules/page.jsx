export default function Rules() {
    return (
        <main className="grid grid-rows-[1fr...1fr...1fr] justify-center items-center h-max min-h-screen w-full text-center">
            <h1 className="text-4xl">Game Rules</h1>
            <div className="flex flex-col space-y-2 justify-center items-center h-full w-full text-center border-b text-wrap px-2">
                <p>5x5 board with 2 players</p>
                <p>5 pieces per player</p>
                <p>Pieces move in specific ways</p>
                <p>First to capture all opponent's pieces wins</p>
            </div>
            <h1 className="text-2xl">Piece movement</h1>
            <div className="flex flex-col space-y-2 justify-center items-center h-full w-full text-center border-b text-wrap px-2">
                <p>
                    P types go exactly 1 place forward, backward, right and left
                </p>
                <p>
                    H1 goes exactly 2 places forward, backward, right and left
                </p>
                <p>H2 can move exactly 2 places diagonally</p>
            </div>
            <h1 className="text-2xl">Invalid Moves</h1>
            <div className="flex flex-col space-y-2 justify-center items-center h-full w-full text-center border-b text-wrap px-2">
                <p>stay in bounds of the board</p>
                <p>no targeting friendlies</p>
                <p>character and allowed moves don't match</p>
            </div>
        </main>
    );
}
