"use client";

// import hooks
import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STATUS = {
    ERROR: "error",
    LOADING: "loading",
    SUCCESS: "success",
    DEFAULT: "default",
};

export default function Login() {
    const router = useRouter();
    // status - error, loading, success
    const [status, setStatus] = useState(STATUS.DEFAULT);
    // error message
    const [error, setError] = useState("");

    // submit credentials
    const handleSubmit = async (action) => {
        // update UI state
        setError("");
        setStatus(STATUS.LOADING);

        // get username and password input
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // validate input
        const isInputValid = validateInput(username, password);
        if (!isInputValid) {
            setStatus(STATUS.ERROR);
            setError("Invalid values for username or password");
            return;
        }

        // send authentication request
        const res = await fetch(`/api/auth/${action}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const { status, message } = await res.json();
        if (status === "error") {
            setStatus(STATUS.ERROR);
            setError(message);
        } else {
            setStatus(STATUS.SUCCESS);
            setTimeout(() => router.push("/dashboard"), 1000);
        }
    };

    // render auth form
    return (
        <main className="flex justify-center items-center h-screen w-screen">
            <Card className="min-w-72 w-1/4">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        login or create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">
                                username (min 5 char)
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="mank111"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                password (min 8 char)
                            </Label>
                            <Input id="password" type="password" required />
                        </div>
                        <Button
                            onClick={() => handleSubmit("login")}
                            className="w-full bg-blue-300"
                            disabled={status === STATUS.LOADING}
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => handleSubmit("signup")}
                            className="w-full"
                            disabled={status === STATUS.LOADING}
                        >
                            Signup
                        </Button>
                    </div>
                    {
                        // error message
                        status === STATUS.ERROR && (
                            <p className="text-red-500 text-sm mt-4 text-center">
                                {error}
                            </p>
                        )
                    }
                    {
                        // loading message
                        status === STATUS.LOADING && (
                            <p className="text-blue-500 text-sm mt-4 text-center">
                                loading ⏳
                            </p>
                        )
                    }
                    {
                        // success message
                        status === STATUS.SUCCESS && (
                            <p className="text-green-500 text-sm mt-4 text-center">
                                Success! Redirecting ⏳
                            </p>
                        )
                    }
                </CardContent>
            </Card>
        </main>
    );
}

// validate input
function validateInput(username, password) {
    const usernameRegex = /^[a-zA-Z0-9_]{5,20}$/;
    const passwordRegex = /^[a-zA-Z0-9_]{8,20}$/;
    if (!usernameRegex.test(username) || !passwordRegex.test(password)) {
        return false;
    }
    return true;
}
