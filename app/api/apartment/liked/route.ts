import Apartment from "@/app/models/post";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const userEmail = url.searchParams.get("userEmail");

        if (!userEmail) {
            throw Error("`userEmail` is required.")
        }

        const user = await User.findOne({ email: userEmail })

        if (!user) {
            throw Error("User not found")
        }

        const likedApartmentIds = user.likedApartments;

        if (!likedApartmentIds || likedApartmentIds.length === 0) {
            return NextResponse.json({ success: true, apartments: [] });
        }

        const apartments = await Apartment.find({ _id: { $in: likedApartmentIds } });
        const result = apartments.map(el => {
            return { ...el._doc, liked: true }
        })
        return NextResponse.json({ success: true, apartments: result });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
