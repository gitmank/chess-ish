"use client";

// import hooks
import { useAuth } from "@/utilities/hooks/useAuth";
import { useRouter } from "next/navigation";

// import ui components
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Redirect from "@/components/simple/Redirect";
import Container from "@/components/simple/Container";

const STATUS = {
    UNAUTHENTICATED: "unauthenticated",
    AUTHENTICATED: "authenticated",
    LOADING: "loading",
};

export default function Page() {
    const router = useRouter();
    const [username, status] = useAuth();

    if (status === STATUS.LOADING) {
        return (
            <main className="flex flex-col justify-center items-center min-h-screen w-full text-center gap-8 p-4">
                <h1 className="text-2xl">Loading ⏳</h1>
                <a className="text-lg" href="/">
                    Return
                </a>
            </main>
        );
    }

    if (status === STATUS.UNAUTHENTICATED) {
        return <Redirect to="/login" />;
    }

    return (
        <main className="py-12">
            <Container className="flex flex-col space-y-8 items-center text-center">
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <Card className="w-full shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">Hi {username} 👋</CardTitle>
                        <CardDescription>
                            you can manage your account here!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-4">
                        <Button
                            variant="link"
                            className="w-full h-20 text-lg border-blue-400 border hover:bg-blue-300 hover:text-black duration-100"
                            onClick={() => router.push("/game/all")}
                        >
                            ↗️ My Games
                        </Button>
                        <Button
                            variant="link"
                            className="w-full h-20 text-lg border-blue-400 border hover:bg-blue-300 hover:text-black duration-100"
                            onClick={() => router.push("/game/new")}
                        >
                            ↗️ New Game
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-20 text-lg border-blue-400 border"
                        >
                            🏆 Rank - coming soon!
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-20 text-lg border-blue-400 border"
                        >
                            🎲 More - coming soon!
                        </Button>
                    </div>
                    <Button className="mt-8" variant="destructive">
                        Logout
                    </Button>
                    </CardContent>
                </Card>
            </Container>
        </main>
    );
}
