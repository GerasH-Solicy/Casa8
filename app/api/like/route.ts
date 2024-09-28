import Apartment from "@/app/models/post";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email || !body.apartmentId) {
      throw new Error("Not all arguments provided.");
    }

    const apartment = await Apartment.findById(body.apartmentId);

    if (!apartment) {
      throw new Error("Apartment not exist.");
    }

    const user = await User.findOne({ email: body.email });

    if (!user) {
      const newUser = await User.create({
        email: body.email,
        likedApartments: [body.apartmentId],
      });
      return NextResponse.json({ success: true, newUser });
    }

    let updatedUser = null;
    if (user?.likedApartments?.includes(body.apartmentId)) {
      updatedUser = await User.findByIdAndUpdate(user._id, {
        $pull: { likedApartments: body.apartmentId },
      });
    } else {
      updatedUser = await User.findByIdAndUpdate(user._id, {
        likedApartments: [...user.likedApartments, body.apartmentId],
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
