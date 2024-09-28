"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useApartament } from "@/hooks/useApartament";
import { useToast } from "@/hooks/use-toast";
import LoginRequired from "../loginRequired";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

const amenities = [
  { id: "Parking", label: "Parking" },
  { id: "Gym", label: "Gym" },
  { id: "Pool", label: "Pool" },
  { id: "Pet-friendly", label: "Pet-friendly" },
];

export default function PostRental() {
  const { createApartament } = useApartament();
  const { user } = useUser();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    address: "",
    city: "",
    monthlyRent: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    available: "",
    squareFootage: "",
    images: [],
    userEmail: "",
    amenities: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>(null);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAmenityChange = (amenityId: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenityId)
        ? formData.amenities.filter((el: any) => el !== amenityId)
        : [...formData.amenities, amenityId],
    });
  };

  const handleFileChange = (e: any) => {
    if (formData.images.length >= 5) {
      toast({
        title: "Images Limit",
        description: "You can not add images more than 5.",
        variant: "destructive",
      });
      return;
    }
    setFormData({
      ...formData,
      images: [
        ...(formData.images as any),
        ...Array.from(e.target.files),
      ] as any,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData[key].forEach((image: any) =>
            formDataToSend.append("images", image)
          );
        } else {
          formDataToSend.append(key, (formData as any)[key]);
        }
      });
      formDataToSend.append(
        "userEmail",
        user?.emailAddresses[0].emailAddress as any
      );
      setLoading(true);
      const response = await createApartament(formDataToSend);
      setLoading(false);

      if (response.success) {
        toast({
          title: "Successfully created.",
          description: "Your post created successfully.",
        });
        router.push(`apartment/${response.apartment._id}`);
      } else {
        toast({
          title: "Error on creation post.",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setErrors(err.message || "An error occurred");
    }
  };

  return !isSignedIn ? (
    <LoginRequired />
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Post a New Rental</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title">Property Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Cozy Downtown Apartment"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your property..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Monthly Rent</Label>
              <Input
                id="monthlyRent"
                name="monthlyRent"
                type="number"
                value={formData.monthlyRent}
                onChange={handleInputChange}
                placeholder="Price per month"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                name="propertyType"
                value={formData.propertyType}
                onValueChange={(value) =>
                  setFormData({ ...formData, propertyType: value })
                }
                required
              >
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Loft">Loft</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleInputChange}
                placeholder="Number of bedrooms"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleInputChange}
                placeholder="Number of bathrooms"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="squareFootage">Square Footage</Label>
              <Input
                id="squareFootage"
                name="squareFootage"
                type="number"
                value={formData.squareFootage}
                onChange={handleInputChange}
                placeholder="Total sq ft"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableTo">Available Time</Label>
              <Input
                name="available"
                type="date"
                id="availableTo"
                value={formData.available}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity.id}
                      checked={formData.amenities.includes(amenity.id)}
                      onCheckedChange={() => handleAmenityChange(amenity.id)}
                    />
                    <label
                      htmlFor={amenity.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {amenity.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="images">Property Images</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
                <Input
                  id="images"
                  name="images"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div className="flex space-x-4 mt-4">
              {formData.images.length > 0 &&
                formData.images.map((image: any, index: number) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={URL.createObjectURL(image)} // Generate a preview URL for each image
                      alt={`Preview ${index + 1}`}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                ))}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating post ..." : "Post Rental"}
          </Button>
          {errors && <p className="text-red-500">{errors}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
