import Apartment from "@/app/models/post";
import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "../../cloudinaryConfig";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("images") as File[];
        const newImgArray = formData.getAll("newImageArray") as string[];
        const formDataFields = Object.fromEntries(formData.entries());

        const { id } = formDataFields

        if (!id) {
            throw Error("Not all arguments provided. Required - id")
        }

        console.log('new ----', newImgArray)
        let changedImgArray: string[] = []
        if (files.length) {
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
            changedImgArray = uploadedUrls
        }

        if (newImgArray) {
            changedImgArray = [...changedImgArray, ...newImgArray]
        }


        delete formDataFields.id
        delete formDataFields.images
        delete formDataFields.newImageArray

        const data = { ...formDataFields, images: changedImgArray }
        console.log('dat a---', data)
        const apartment = await Apartment.findOneAndUpdate({ _id: id }, { ...data })

        return NextResponse.json({ success: true, apartment });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
