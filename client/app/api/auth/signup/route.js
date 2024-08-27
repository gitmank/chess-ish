// imports
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToMongo from "@/utilities/connectToDB";
import User from "@/models/UserModel";

const COOKIE_NAME = "user_session";
const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 5 * 24 * 60 * 60, // 5 days
    priority: "High",
};

export async function POST(req, res) {
    try {
        // check if request body is valid
        const { username, password } = await req.json();
        if (!validateInput(username, password)) {
            return NextResponse.json({ status: "error", message: "Invalid values for username or password" }, { status: 400 });
        }

        // check if user already exists
        await connectToMongo();
        const user = await User.find({ username });
        if (user.length > 0) {
            return NextResponse.json({ status: "error", message: "Invalid username or password" }, { status: 400 });
        }

        // create a user
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // set session cookie
        const jwt = require("jsonwebtoken");
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "5d" });
        cookies().set(COOKIE_NAME, token, COOKIE_OPTIONS);

        // response
        return NextResponse.json({ status: "success", message: "user created" }, { status: 200 });
    } catch (error) {
        console.log(error.toString());
        return NextResponse.json({ status: "error", message: "internal server error" }, { status: 500 });
    }
}

function validateInput(username, password) {
    const usernameRegex = /^[a-zA-Z0-9_]{5,20}$/;
    const passwordRegex = /^[a-zA-Z0-9_]{8,20}$/;
    if (!usernameRegex.test(username) || !passwordRegex.test(password)) {
        return false;
    }
    return true;
}