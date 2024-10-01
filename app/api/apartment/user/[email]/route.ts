import Apartment from "@/app/models/post";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { email: string } }
) {
    try {
        const email = params.email;

        if (!email) {
            throw new Error("Email is required.")
        }

        const apartments = await Apartment.find({ userEmail: email })

        return NextResponse.json({ success: true, apartments });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
