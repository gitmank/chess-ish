import Grid from "@/components/simple/Grid";
import Navbar from "@/components/simple/Navbar";
import Container from "@/components/simple/Container";

// renders landing page with fun grid and links
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between py-12">
            <Container className="flex flex-col items-center space-y-12">
                <div className="flex flex-col space-y-4 md:space-y-8 items-center">
                    <h1 className="text-5xl font-bold tracking-wide">Chess-ish</h1>
                    <p className="text-xl">5x5 chess-like game</p>
                    <p className="text-sm">by Manomay (21BCY10052)</p>
                </div>
                <Grid size={5} />
                <Navbar />
            </Container>
        </main>
    );
}
