"use client";

// imports
import { useAuth } from "@/utilities/hooks/useAuth";
import Loading from "@/components/views/Loading";
import Login from "@/components/views/Login";
import Redirect from "@/components/simple/Redirect";

export default function Page() {
    // fetch login status
    const [user, status] = useAuth();

    // redirect if authenticated
    if (status === "authenticated") {
        return <Redirect to="/dashboard" />;
    }

    // render loading page if loading
    if (status === "loading") {
        return <Loading />;
    }

    // render login page if unauthenticated
    return <Login />;
}
