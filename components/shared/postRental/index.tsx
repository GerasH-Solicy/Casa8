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
import { Upload, X } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useApartament } from "@/hooks/useApartament";
import { useToast } from "@/hooks/use-toast";
import LoginRequired from "../loginRequired";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Amenities } from "@/lib/constants";
import CityInput from "../cityInput";

const bathroomOptions = [
  { value: "1", label: "1 bathroom" },
  { value: "2", label: "2 bathrooms" },
  { value: "3", label: "3 bathrooms" },
  { value: "4", label: "4 bathrooms" },
];

const bedroomOptions = [
  { value: "1", label: "1 bedroom" },
  { value: "2", label: "2 bedrooms" },
  { value: "3", label: "3 bedrooms" },
  { value: "4", label: "4 bedrooms" },
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
    squareFootage: "",
    phoneNumber: "",
    images: [],
    userEmail: "",
    amenities: [],
    isChatAllowed: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showPhonNumberSelect, setShowPhonNumberSelect] =
    useState<boolean>(false);
  const [openCustomBedroom, setOpenCustomBedroom] = useState<boolean>(false);
  const [propertyTypeError, setPropertyTypeError] = useState<string>("");

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDeleteImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter(
        (_: any, elIndex: number) => elIndex !== index
      ),
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
      if (!formData.propertyType) {
        setPropertyTypeError("Required");
        return;
      }

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
        user?.primaryEmailAddress?.emailAddress as any
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
      toast({
        title: "Error on creation post.",
        description: err.message,
        variant: "destructive",
      });
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
              <CityInput
                clasName="w-full"
                onSelect={(value) =>
                  setFormData({ ...formData, address: value })
                }
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="city">City</Label>
              <CityInput
                clasName="w-full"
                onSelect={(value) => setFormData({ ...formData, city: value })}
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
              <Label htmlFor="propertyType">
                Property Type{" "}
                {propertyTypeError && (
                  <span className="text-red-600">{propertyTypeError}</span>
                )}
              </Label>
              <Select
                name="propertyType"
                value={formData.propertyType}
                onValueChange={(value) => {
                  setFormData({ ...formData, propertyType: value });
                  setPropertyTypeError("");
                }}
              >
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <div className="flex gap-2">
                <Select
                  required
                  name="bedrooms"
                  onValueChange={(value) => {
                    if (value !== "custom") {
                      setFormData({ ...formData, bedrooms: +value });
                      setOpenCustomBedroom(false);
                    } else {
                      setOpenCustomBedroom(true);
                    }
                  }}
                >
                  <SelectTrigger id="bedrooms" className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Any bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {bedroomOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {openCustomBedroom && (
                  <Input
                    type="number"
                    name="bedrooms"
                    placeholder="Enter bedrooms"
                    onChange={(e) =>
                      setFormData({ ...formData, bedrooms: e.target.value })
                    }
                    className="w-[100px]"
                  />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Select
                required={true}
                name="bathrooms"
                onValueChange={(value) =>
                  setFormData({ ...formData, bathrooms: value })
                }
              >
                <SelectTrigger id="bathrooms">
                  <SelectValue placeholder="Select bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  {bathroomOptions.map((el, index) => (
                    <SelectItem key={index} value={el.value}>
                      {el.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {Amenities.map((amenity) => (
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
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includePhoneNumber"
                  checked={formData.includePhoneNumber}
                  onCheckedChange={() => {
                    setShowPhonNumberSelect(!showPhonNumberSelect);
                    if (!!showPhonNumberSelect) {
                      setFormData({ ...formData, phoneNumber: "" });
                    }
                  }}
                />
                <Label htmlFor="includePhoneNumber">Include Phone Number</Label>
              </div>
              {showPhonNumberSelect && (
                <Select
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onValueChange={(value) =>
                    setFormData({ ...formData, phoneNumber: value })
                  }
                  required
                >
                  <SelectTrigger id="phoneNumber">
                    <SelectValue placeholder="Select Phone number" />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.phoneNumbers.map((el, index) => (
                      <SelectItem key={index} value={el.phoneNumber}>
                        {el.phoneNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="chatAttachment">Allow chat</Label>
                <Checkbox
                  id="includePhoneNumber"
                  checked={formData.isChatAllowed}
                  onCheckedChange={() => {
                    setFormData({
                      ...formData,
                      isChatAllowed: !formData.isChatAllowed,
                    });
                  }}
                />
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
                  <div key={index} className="relative w-24 h-24 group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="object-cover w-full h-full rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 -mt-2 -mr-2 opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteImage(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating post ..." : "Post Rental"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
