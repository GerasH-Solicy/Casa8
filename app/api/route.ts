import { NextResponse } from "next/server";
import PostModel from "../models/post";
import connectDb from "./db";

export async function GET() {
    await connectDb()
    const prodc = await PostModel.find()
    return NextResponse.json({ succes: true, prodc })
}