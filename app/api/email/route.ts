import { NextRequest, NextResponse } from "next/server";
import { transporter } from "./emailConfig";
import { validateEmail } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { from, to, content } = body;

    if (!from || !to || !content) {
      throw Error("Not all arguments are provided.");
    }

    const isValidEmailFrom = validateEmail(from);
    const isValidEmailTo = validateEmail(to);

    if (!isValidEmailFrom || !isValidEmailTo) {
      throw Error("Email format is invalid.");
    }

    transporter.sendMail({
      to,
      subject: `There is a message for you from ${from}`,
      text: content,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
