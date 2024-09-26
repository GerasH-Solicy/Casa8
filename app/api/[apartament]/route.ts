import { NextRequest, NextResponse } from "next/server";
import connectDb from "../db";
import Apartment from "@/app/models/post";

export async function GET() {
    await connectDb()
    const apartments = await Apartment.find()
    return NextResponse.json({ succes: true, apartments })
}

export async function POST(request: NextRequest, context: any) {
    try {
        const body = await request.json();

        await connectDb()
        const apartment = await Apartment.create(body)
        return NextResponse.json({ succes: true, apartment })
    } catch (err: any) {
        return NextResponse.json({ succes: false, error: err.message })
    }
}