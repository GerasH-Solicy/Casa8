import Apartment from "@/app/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const apartmentId = params.id;

        const res = await Apartment.findByIdAndDelete(apartmentId)

        if (res._id) {
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ success: false, error: "Something gone wrong." })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
