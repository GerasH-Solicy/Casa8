"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Search } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useApartament } from "@/hooks/useApartament";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ApartmentFilter from "../filter";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import LikeButton from "../likeButton";

export default function SearchRental() {
  const { user } = useUser();
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { getAllApartaments, toogleLikeApartament } = useApartament();
  const [disableLike, setDisableLike] = useState<boolean>();
  const [searchWord, setSearchWord] = useState<string>("");

  const fetchAppartments = async (filter: any = {}) => {
    setLoading(true);
    const res = await getAllApartaments({
      ...filter,
      searchWord,
      userEmail: user?.emailAddresses[0].emailAddress ?? "",
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
      email: user?.emailAddresses[0].emailAddress,
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

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Find Your Next Home</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center">
          <div className=" w-[70%]">
            <ApartmentFilter fetch={fetchAppartments} />
          </div>
          <div className="flex space-x-2 w-[30%]">
            <Input
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="Enter city"
            />
            <Button onClick={fetchAppartments}>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>
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
          rentals.map((rental) => (
            <Card key={rental.id}>
              <div className="flex">
                <div className="flex-1">
                  <CardHeader>
                    <CardTitle>{rental.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{rental.address}</p>
                    <p className="font-bold">${rental.monthlyRent}/month</p>
                    <p>
                      {rental.bedrooms} bed, {rental.bathrooms} bath,{" "}
                      {rental.sqft} sqft
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href={`/apartment/${rental._id}`}>
                      <Button variant="outline">
                        <Home className="mr-2 h-4 w-4" /> View
                      </Button>
                    </Link>
                    <LikeButton
                      liked={rental.liked}
                      toggleLike={() => toggleLike(rental._id)}
                    />
                  </CardFooter>
                </div>
                <div className="w-1/3 relative">
                  <Carousel>
                    <CarouselContent>
                      {rental.images.map((img: string) => {
                        return (
                          <CarouselItem>
                            <img src={img} alt={rental.title} />
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
