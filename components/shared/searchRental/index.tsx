"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, MapPin, Search } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useApartament } from "@/hooks/useApartament";
import { useEffect, useMemo, useState } from "react";
import ApartmentFilter from "../filter";
import { Skeleton } from "@/components/ui/skeleton";
import ApartmentCard from "../apartmentCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CityInput from "../cityInput";

export default function SearchRental() {
  const { user } = useUser();
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState("newest");
  const { getAllApartaments, toogleLikeApartament } = useApartament();
  const [disableLike, setDisableLike] = useState<boolean>();
  const [searchWord, setSearchWord] = useState<string>("");
  const [listType, setListType] = useState<"list" | "map">("list");

  const fetchAppartments = async (filter: any = {}) => {
    setLoading(true);
    const res = await getAllApartaments({
      ...filter,
      searchWord,
      userEmail: user?.primaryEmailAddress?.emailAddress ?? "",
    });
    setLoading(false);
    setRentals(res.apartments);
  };

  const toggleLike = async (id: string) => {
    if (disableLike) {
      return;
    }
    setDisableLike(true);
    const res = await toogleLikeApartament({
      email: user?.primaryEmailAddress?.emailAddress,
      apartmentId: id,
    });
    setDisableLike(false);
    if (res.success) {
      setRentals(
        rentals.map((el) => {
          if (el._id === id) {
            return { ...el, liked: !el.liked };
          }
          return el;
        })
      );
    }
  };

  useEffect(() => {
    fetchAppartments();
  }, [user]);

  const sortedRentals = useMemo(() => {
    return rentals.sort((a, b) => {
      if (sortBy === "price") {
        return a.monthlyRent - b.monthlyRent;
      }
      if (sortBy === "bedrooms") {
        return b.bedrooms - a.bedrooms;
      }
      if (sortBy === "sqft") {
        return b.squareFootage - a.squareFootage;
      }
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });
  }, [rentals, sortBy]);

  return (
    <div>
      <Tabs
        value={listType}
        onValueChange={(value: string) => setListType(value as any)}
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Find Your Next Home</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="w-full">
                <ApartmentFilter fetch={fetchAppartments} />
              </div>
              <div className="w-full flex gap-2">
                <CityInput
                  clasName="w-full"
                  onSelect={(value) => setSearchWord(value)}
                />
                <Button onClick={fetchAppartments} className="flex-grow">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>
              <div className="w-full flex space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price: Low to High</SelectItem>
                    <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
                    <SelectItem value="sqft">Largest Area</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <TabsList className="mt-2 grid w-full grid-cols-2">
          <TabsTrigger value="list">List view</TabsTrigger>
          <TabsTrigger value="map">Map view</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[300px] w-[500px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ) : (
              sortedRentals.map((rental) => (
                <ApartmentCard apartment={rental} toggleLike={toggleLike} />
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="map">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Map Search Coming Soon!
              </CardTitle>
              <CardDescription>
                We're working hard to bring you an amazing map search feature.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Our team is currently developing a powerful map search
                functionality to help you find locations with ease. We're
                excited to launch this feature and enhance your experience on
                our platform.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notify me when it's ready
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
