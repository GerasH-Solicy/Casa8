import Apartment from "@/app/models/post";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email) {
      throw new Error("Email is required.");
    }

    const { email } = body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    const res = { ...user._doc };
    const userAparments = await Apartment.find({ userEmail: email });
    if (userAparments.length) {
      res.isLandlord = true;
    } else {
      res.isLandlord = false;
    }

    return NextResponse.json({ success: true, user: res });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
