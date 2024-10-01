"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApartament } from "@/hooks/useApartament";
import { useUser } from "@clerk/nextjs";
import ApartmentCard from "@/components/shared/apartmentCard";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Apartment } from "@/lib/interface";

export default function LikedProperties() {
  const [likedProperties, setLikedProperties] = useState<Apartment[]>([]);
  const [sortBy, setSortBy] = useState("price");
  const { user } = useUser();
  const { getUserLikedApartments, toogleLikeApartament } = useApartament();
  const [searchTerm, setSearchTerm] = useState("");
  const [disableLike, setDisableLike] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleRemoveFavorite = async (id: string) => {
    if (disableLike) {
      return;
    }
    if (!user?.emailAddresses[0].emailAddress) {
      return;
    }

    setDisableLike(true);
    const res = await toogleLikeApartament({
      email: user?.emailAddresses[0].emailAddress,
      apartmentId: id,
    });
    setDisableLike(false);
    if (res.success) {
      setLikedProperties(
        likedProperties.filter((property) => property._id !== id)
      );
    } else {
      toast({ title: "Something went wrong.", description: res.message });
    }
  };

  const fetchUserLikedApartments = async () => {
    if (!user?.emailAddresses[0]?.emailAddress) {
      return;
    }
    setLoading(true);
    const res = await getUserLikedApartments(
      user?.emailAddresses[0].emailAddress
    );
    setLoading(false);
    setLikedProperties(res.apartments);
  };

  useEffect(() => {
    fetchUserLikedApartments();
  }, [user]);

  const sortedProperties = useMemo(() => {
    return likedProperties
      .filter((property) =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "price") {
          return a.monthlyRent - b.monthlyRent;
        }
        if (sortBy === "bedrooms") {
          return b.bedrooms - a.bedrooms;
        }
        if (sortBy === "sqft") {
          return b.squareFootage - a.squareFootage;
        }
        return 0;
      });
  }, [likedProperties, sortBy, searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        My Liked Properties
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full sm:w-auto sm:flex-1 sm:mr-4">
          <Input
            placeholder="Search saved properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price: Low to High</SelectItem>
            <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
            <SelectItem value="sqft">Largest Area</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[300px] w-[500px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : sortedProperties.length === 0 ? (
        <Card className="w-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No saved properties found. Start exploring and save your favorite
              listings!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {sortedProperties.map((property) => (
            <ApartmentCard
              apartment={property}
              toggleLike={() => handleRemoveFavorite(property._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
