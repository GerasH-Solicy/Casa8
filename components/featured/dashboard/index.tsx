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
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Apartment } from "@/lib/interface";
import { PostStatus } from "@/lib/enum";

export default function Dashboard() {
  const [amenities, setAmenities] = useState<string[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const { user } = useUser();
  const { toast } = useToast();
  const { editApartament, getUserApartments, deleteApartment } =
    useApartament();
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(
    null
  );
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<any[]>([]);

  const handleEdit = (apartment: Apartment) => {
    setNewImages([]);
    setAmenities(apartment?.amenities as any);
    setImages(apartment?.images as any);
    setEditingApartment(apartment);
  };

  const togleStatus = async (id: string, status: PostStatus) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    setLoading(true);
    const res = await editApartament(formData);
    setLoading(false);
    if (res.success) {
      setApartments(
        apartments.map((el) => (el._id === id ? { ...el, status } : el))
      );
    } else {
      toast({
        title: "Something gone wrong.",
        description: res.message,
      });
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const res = await deleteApartment(id);
    setLoading(false);
    if (res.success) {
      toast({
        title: "Successfully deleted.",
        description: "Your apartment deleted successfully.",
      });
      setApartments(apartments.filter((apartment) => apartment._id !== id));
      return;
    }
    toast({
      title: "Something gone wrong.",
      description: res.message,
    });
  };

  const fetchUserApartments = async () => {
    if (!user?.emailAddresses[0]?.emailAddress) {
      return;
    }
    setLoading(true);
    const res = await getUserApartments(user.emailAddresses[0].emailAddress);
    setLoading(false);
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
                <TableHead>Status</TableHead>
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
                  <TableCell>
                    <Select
                      disabled={loading}
                      value={apartment.status}
                      onValueChange={(value: PostStatus) =>
                        togleStatus(apartment._id, value)
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PostStatus.ACTIVE}>
                          Active
                        </SelectItem>
                        <SelectItem value={PostStatus.INACTIVE}>
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
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
                      <AlertDialog
                        open={openDelete}
                        onOpenChange={setOpenDelete}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your apartment and remove it
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(apartment._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Link href="/?tab=post">
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add New Property
            </Button>
          </Link>
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
                  if (!images.length) {
                    updatedFormData.append("newImageArray", [] as any);
                  }
                  images.forEach((image) =>
                    updatedFormData.append(`newImageArray`, image)
                  );
                }

                newImages.forEach((image: any) =>
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
                setLoading(true);
                const res = await editApartament(updatedFormData);
                setLoading(false);
                if (res.success) {
                  handleSave(res.apartment);
                  toast({
                    title: "Successfully edited.",
                    description: "Apartment edited successfully.",
                  });
                } else {
                  toast({ title: "Edit error", description: res.message });
                }
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
                        editingApartment?.available
                          ? new Date(editingApartment?.available as any)
                              .toISOString()
                              .split("T")[0]
                          : ""
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
                <Button disabled={loading} type="submit">
                  {loading ? "Loading..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
