import Container from "@/components/simple/Container";

export default function Rules() {
    return (
        <main className="py-12">
            <Container className="flex flex-col items-center space-y-8 text-center">
                <h1 className="text-4xl font-bold">Game Rules</h1>
                <div className="flex flex-col space-y-2 items-center w-full border-b px-2">
                <p>5x5 board with 2 players</p>
                <p>5 pieces per player</p>
                <p>Pieces move in specific ways</p>
                <p>First to capture all opponent's pieces wins</p>
            </div>
            <h1 className="text-2xl">Piece movement</h1>
            <div className="flex flex-col space-y-2 items-center w-full border-b px-2">
                <p>
                    P types go exactly 1 place forward, backward, right and left
                </p>
                <p>
                    H1 goes exactly 2 places forward, backward, right and left
                </p>
                <p>H2 can move exactly 2 places diagonally</p>
            </div>
            <h1 className="text-2xl">Invalid Moves</h1>
            <div className="flex flex-col space-y-2 items-center w-full border-b px-2">
                <p>stay in bounds of the board</p>
                <p>no targeting friendlies</p>
                <p>character and allowed moves don't match</p>
            </div>
            </Container>
        </main>
    );
}
