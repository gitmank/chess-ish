// imports 
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "user_session";

export async function GET(req, res) {
    try {
        // check if request has token
        const token = cookies()?.get(COOKIE_NAME)?.value;
        if (!token) {
            return NextResponse.json({ status: "error", message: "unauthenticated" }, { status: 401 });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.username) {
            return NextResponse.json({ status: "error", message: "unauthenticated" }, { status: 401 });
        }
        return NextResponse.json({ status: "success", message: "user authenticated", username: decoded.username }, { status: 200 });
    } catch (error) {
        console.log(error.toString());
        return NextResponse.json({ status: "error", message: "internal server error" }, { status: 500 });
    }
}