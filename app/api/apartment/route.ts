import { NextRequest, NextResponse } from "next/server";
import connectDb from "../db";
import Apartment from "@/app/models/post";
import { cloudinary } from "../cloudinaryConfig";
import User from "@/app/models/user";
import { PostStatus } from "@/lib/enum";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const bedroom = url.searchParams.get("bedroom");
  const bathroom = url.searchParams.get("bathroom");
  const userEmail = url.searchParams.get("userEmail");
  const searchWord = url.searchParams.get("searchWord");

  const filterObj: any = {};

  if (bedroom) {
    const numeriBedroom = Number(bedroom);
    if (!isNaN(numeriBedroom)) {
      filterObj.bedrooms = { $eq: Number(bedroom) };
    }
  }

  if (searchWord) {
    filterObj.title = { $regex: searchWord, $options: "i" };
  }

  if (bathroom) {
    const numeriBathroom = Number(bathroom);
    if (!isNaN(numeriBathroom)) {
      filterObj.bathrooms = { $eq: Number(bathroom) };
    }
  }
  await connectDb();

  filterObj.status = PostStatus.ACTIVE

  let apartments = await Apartment.find(filterObj);
  if (userEmail?.length) {
    const user = await User.findOne({ email: userEmail });
    const likedIds = (user as any)?.likedApartments;
    apartments = apartments.map((el) => {
      if (likedIds?.includes(el._id)) {
        return { ...el._doc, liked: true };
      }
      return { ...el._doc, liked: false };
    });
  }
  return NextResponse.json({ success: true, apartments });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "apartment_images" },
            (error: any, result: any) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject("Upload failed");
              } else {
                resolve(result.secure_url);
              }
            }
          );
          uploadStream.end(buffer);
        });
      })
    );

    const formDataFields = Object.fromEntries(formData.entries());

    const amenities = formDataFields.amenities
      .toString()
      .split(",")
      .filter((el) => el.length > 1);
    await connectDb();
    const apartmentData = {
      ...formDataFields,
      amenities,
      images: uploadedUrls,
      status: PostStatus.ACTIVE
    };

    const apartment = await Apartment.create(apartmentData);
    return NextResponse.json({ success: true, apartment });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
