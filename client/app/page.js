import Grid from "@/components/simple/Grid";
import Navbar from "@/components/simple/Navbar";

// renders landing page with fun grid and links
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-12 text-center">
      <div className="flex flex-col space-y-8">
        <h1 className="text-4xl font-bold">Chess-ish</h1>
        <p className="text-xl">5x5 chess-like game</p>
        <p className="text-sm">by Manomay (21BCY10052)</p>
      </div>
      <Grid size={5} />
      <Navbar />
    </main>
  );
}
