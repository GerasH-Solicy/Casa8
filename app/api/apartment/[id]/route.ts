import Apartment from "@/app/models/post";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apartmentId = params.id;
    const url = new URL(request.url);
    const userEmail = url.searchParams.get("userEmail");
    // Find the apartment by id
    let apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return NextResponse.json(
        { success: false, error: "Apartment not found." },
        { status: 404 }
      );
    }

    const user = await User.findOne({ email: userEmail });

    apartment = {
      ...apartment._doc,
      liked: user?.likedApartments?.includes(apartment._id),
    };

    return NextResponse.json({ success: true, apartment });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
