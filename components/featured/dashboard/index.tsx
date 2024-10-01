"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, Upload, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Amenities } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";
import { useApartament } from "@/hooks/useApartament";
import { useToast } from "@/hooks/use-toast";

interface Apartment {
  _id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  monthlyRent: number;
  propertyType: "Apartment" | "House" | "Loft" | "Studio" | "Townhouse";
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  createdAt?: Date;
  userEmail: string;
  images?: string[];
  available?: string;
  amenities?: string[];
  liked?: boolean;
}

export default function Dashboard() {
  const [amenities, setAmenities] = useState<string[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const { user } = useUser();
  const { toast } = useToast();
  const { editApartament, getUserApartments } = useApartament();
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(
    null
  );
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<any[]>([]);

  const handleEdit = (apartment: Apartment) => {
    setAmenities(apartment?.amenities as any);
    setImages(apartment?.images as any);
    setEditingApartment(apartment);
  };

  const fetchUserApartments = async () => {
    if (!user?.emailAddresses[0]?.emailAddress) {
      return;
    }
    const res = await getUserApartments(user.emailAddresses[0].emailAddress);
    setApartments(res.apartments);
  };

  useEffect(() => {
    fetchUserApartments();
  }, [user]);

  const handleFileChange = (e: any) => {
    if ((editingApartment?.images?.length as number) >= 5) {
      toast({
        title: "Images Limit",
        description: "You can not add images more than 5.",
        variant: "destructive",
      });
      return;
    }
    setNewImages([...newImages, ...Array.from(e.target.files)]);
  };

  const handleDelete = (id: string) => {
    setApartments(apartments.filter((apartment) => apartment._id !== id));
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, elIndex) => elIndex !== index));
  };

  const handleSave = (updatedApartment: Apartment) => {
    setApartments(
      apartments.map((apartment) =>
        apartment._id === updatedApartment._id ? updatedApartment : apartment
      )
    );
    setEditingApartment(null);
  };

  const handleDeleteNewImage = (index: number) => {
    setNewImages(newImages.filter((_, elIndex) => index !== elIndex));
  };

  const handleAmenityChange = (amenityId: string) => {
    setAmenities(
      amenities.includes(amenityId)
        ? amenities.filter((el: any) => el !== amenityId)
        : [...amenities, amenityId]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">
            Your Rental Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Bedrooms</TableHead>
                <TableHead>Bathrooms</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apartments.map((apartment) => (
                <TableRow key={apartment._id}>
                  <TableCell>{apartment.title}</TableCell>
                  <TableCell>{`${apartment.address}, ${apartment.city}`}</TableCell>
                  <TableCell>${apartment.monthlyRent}/month</TableCell>
                  <TableCell>{apartment.propertyType}</TableCell>
                  <TableCell>{apartment.bedrooms}</TableCell>
                  <TableCell>{apartment.bathrooms}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(apartment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(apartment._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add New Property
          </Button>
        </CardFooter>
      </Card>

      {editingApartment && (
        <Dialog
          open={!!editingApartment}
          onOpenChange={() => setEditingApartment(null)}
        >
          <DialogContent className="sm:max-w-[625px] w-[800px] bg-white">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
              <DialogDescription>
                Make changes to your property here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                const updatedFields: Partial<Apartment> = {};

                for (const [key, value] of formData.entries() as any) {
                  let newValue: any;
                  if (
                    key === "monthlyRent" ||
                    key === "bedrooms" ||
                    key === "bathrooms" ||
                    key === "squareFootage"
                  ) {
                    newValue = Number(value);
                  } else if (key === "available") {
                    const formDate = new Date(value as string);
                    const currentDate = new Date(
                      editingApartment?.available as any
                    );

                    if (formDate.getTime() !== currentDate.getTime()) {
                      newValue = formDate;
                      updatedFields[key as keyof Apartment] = newValue;
                    }
                    continue;
                  } else if (key === "amenities") {
                    newValue = (value as string)
                      .split(",")
                      .map((item) => item.trim());
                  } else if (key === "liked") {
                    newValue = value === "on";
                  } else {
                    newValue = value as string;
                  }

                  if (editingApartment[key as keyof Apartment] !== newValue) {
                    updatedFields[key as keyof Apartment] = newValue;
                  }
                }

                console.log(
                  "Updated fields: ",
                  updatedFields,
                  editingApartment._id
                );
                if (
                  JSON.stringify(amenities) !==
                  JSON.stringify(editingApartment.amenities)
                ) {
                  updatedFields.amenities = amenities;
                }

                const updatedFormData = new FormData();
                if (
                  JSON.stringify(images) !==
                  JSON.stringify(editingApartment.images)
                ) {
                  console.log("working=-====", images);
                  if (!images.length) {
                    updatedFormData.append("newImageArray", [] as any);
                  }
                  images.forEach((image, index) =>
                    updatedFormData.append(`newImageArray`, image)
                  );
                }

                newImages.forEach((image: any, index: number) =>
                  updatedFormData.append(`images`, image)
                );

                Object.entries(updatedFields).forEach(([key, value]) => {
                  if (key !== "images") {
                    if (Array.isArray(value)) {
                      value.forEach((item) =>
                        updatedFormData.append(key, item)
                      );
                    } else if (value instanceof Date) {
                      updatedFormData.append(key, value.toISOString());
                    } else {
                      updatedFormData.append(key, value as any);
                    }
                  }
                });

                updatedFormData.append("id", editingApartment._id);

                await editApartament(updatedFormData);
                handleSave({ ...editingApartment, ...updatedFields });
              }}
            >
              <div className="gap-4 py-4 flex">
                <div className="w-[50%]">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      name="title"
                      defaultValue={editingApartment.title}
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      defaultValue={editingApartment.description}
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-address">Address</Label>
                    <Input
                      id="edit-address"
                      name="address"
                      defaultValue={editingApartment.address}
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-city">City</Label>
                    <Input
                      id="edit-city"
                      name="city"
                      defaultValue={editingApartment.city}
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-monthlyRent">Monthly Rent</Label>
                    <Input
                      id="edit-monthlyRent"
                      name="monthlyRent"
                      type="number"
                      defaultValue={editingApartment.monthlyRent}
                      className="w-full"
                      required
                    />
                  </div>
                </div>
                <div className="w-[50%]">
                  <div className="space-y-2">
                    <Label htmlFor="edit-propertyType">Type</Label>
                    <Select
                      name="propertyType"
                      defaultValue={editingApartment.propertyType}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
                  <div className="space-y-2">
                    <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                    <Input
                      id="edit-bedrooms"
                      name="bedrooms"
                      type="number"
                      defaultValue={editingApartment.bedrooms}
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                    <Input
                      id="edit-bathrooms"
                      name="bathrooms"
                      type="number"
                      defaultValue={editingApartment.bathrooms}
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-squareFootage">Square Footage</Label>
                    <Input
                      id="edit-squareFootage"
                      name="squareFootage"
                      type="number"
                      defaultValue={editingApartment.squareFootage}
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-available">Available Date</Label>
                    <Input
                      id="edit-available"
                      name="available"
                      type="date"
                      defaultValue={
                        new Date(editingApartment?.available as any)
                          .toISOString()
                          .split("T")[0]
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {Amenities.map((amenity) => (
                        <div
                          key={amenity.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={amenity.id}
                            checked={amenities?.includes(amenity.id)}
                            onCheckedChange={() =>
                              handleAmenityChange(amenity.id)
                            }
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
                <div className="flex space-x-4 mt-4">
                  {images &&
                    images.map((image: string, index: number) => (
                      <div key={index} className="relative w-24 h-24 group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="object-cover w-full h-full rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteImage(index);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  {newImages &&
                    newImages.map((image: any, index: number) => (
                      <div key={index} className="relative w-24 h-24 group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="object-cover w-full h-full rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteNewImage(index);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
