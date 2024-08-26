"use client";

// imports
import { useAuth } from "@/components/hooks/useAuth";
import Loading from "@/components/views/Loading";
import Login from "@/components/views/Login";
import Redirect from "@/components/views/Redirect";

export default function Page() {
    // fetch login status
    const [user, status] = useAuth();

    // redirect if authenticated
    if (status === "authenticated") {
        return <Redirect page="dashboard" />;
    }

    // render loading page if loading
    if (status === "loading") {
        return <Loading />;
    }

    // render login page if unauthenticated
    return <Login />;
}
