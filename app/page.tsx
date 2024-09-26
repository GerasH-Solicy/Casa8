"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import SearchRental from "@/components/shared/searchRental";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import axios from "axios";
import { useApartament } from "@/hooks/useApartament";

export default function Casa8Interface() {
  const { createApartament } = useApartament();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    monthlyRent: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    images: [], // For file uploads
    userEmail: "", // Will capture from the signed-in user
  });

  const [errors, setErrors] = useState<any>(null);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: any) => {
    setFormData({
      ...formData,
      images: Array.from(e.target.files),
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // const formDataToSend = new FormData();
      // Object.keys(formData).forEach((key) => {
      //   if (key === "images") {
      //     formData[key].forEach((image: any) =>
      //       formDataToSend.append("images", image)
      //     );
      //   } else {
      //     formDataToSend.append(key, formData[key]);
      //   }
      // });

      const response = await createApartament({
        ...formData,
        userEmail: user?.emailAddresses[0].emailAddress,
      });

      if (response.success) {
        alert("Rental posted successfully");
      } else {
        alert("Failed to post rental");
      }
    } catch (err: any) {
      setErrors(err.message || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">casa8</h1>
        <Button>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Button>
      </header>

      <Tabs defaultValue="search">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search Rentals</TabsTrigger>
          <TabsTrigger value="post">Post a Rental</TabsTrigger>
        </TabsList>
        <TabsContent value="post">
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
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
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
                </div>
                <Button type="submit" className="w-full">
                  Post Rental
                </Button>
                {errors && <p className="text-red-500">{errors}</p>}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="search">
          <SearchRental />
        </TabsContent>
      </Tabs>
    </div>
  );
}
