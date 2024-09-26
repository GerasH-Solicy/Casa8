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
import { Heart, Home, Search } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useApartament } from "@/hooks/useApartament";
import { useEffect, useState } from "react";

export default function SearchRental() {
  const { user } = useUser();
  const [rentals, setRentals] = useState<any[]>([]);
  const { getAllApartaments } = useApartament();

  useEffect(() => {
    async function fetcher() {
      const res = await getAllApartaments();
      console.log("res ====", res);
      setRentals(res.apartments);
    }
    fetcher();
  }, [user]);

  const sortedRentals = rentals;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Find Your Next Home</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input placeholder="Enter city" />
            <Button>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {rentals.map((rental) => (
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
                  <Button variant="outline">
                    <Home className="mr-2 h-4 w-4" /> View
                  </Button>
                  <Button variant="ghost">
                    <Heart className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </div>
              <div className="w-1/3 relative">
                <Image
                  src={`/placeholder.svg?height=160&width=120`}
                  alt={rental.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
