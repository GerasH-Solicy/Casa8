import Apartment from "@/app/models/post";
import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "../../cloudinaryConfig";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("images") as File[];
        const newImgArray = formData.getAll("newImageArray") as string[];
        const amenities = formData.getAll("amenities") as string[];
        const formDataFields = Object.fromEntries(formData.entries());

        const { id } = formDataFields

        if (!id) {
            throw Error("Not all arguments provided. Required - id")
        }

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

        const apartment = await Apartment.findById(id)

        if (newImgArray.length) {
            changedImgArray = [...changedImgArray, ...newImgArray]
        } else {
            changedImgArray = [...changedImgArray, ...apartment.images]
        }


        delete formDataFields.id
        delete formDataFields.images
        delete formDataFields.newImageArray

        if(amenities.length){
            formDataFields.amenities = amenities as any
        }

        const data = { ...formDataFields, images: changedImgArray.filter(el => el.length > 0) }
        const updatedApartment = await Apartment.findOneAndUpdate({ _id: id }, { ...data }, { new: true })

        return NextResponse.json({ success: true, apartment: updatedApartment });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
