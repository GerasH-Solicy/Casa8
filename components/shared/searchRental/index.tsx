"use client";

import { useState } from "react";
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

export default function SearchRental() {
  const [city, setCity] = useState("");
  const [sortBy] = useState("newest");

  // Mock data for demonstration
  const rentals = [
    {
      id: 1,
      title: "Cozy Apartment",
      address: "123 Main St",
      price: 1200,
      bedrooms: 2,
      bathrooms: 1,
      sqft: 800,
    },
    {
      id: 2,
      title: "Spacious House",
      address: "456 Elm St",
      price: 2000,
      bedrooms: 4,
      bathrooms: 2.5,
      sqft: 2200,
    },
    {
      id: 3,
      title: "Modern Loft",
      address: "789 Oak St",
      price: 1500,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 1000,
    },
    {
      id: 4,
      title: "Studio Apartment",
      address: "101 Pine St",
      price: 900,
      bedrooms: 0,
      bathrooms: 1,
      sqft: 500,
    },
  ];

  const sortedRentals = [...rentals].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Find Your Next Home</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Button>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {sortedRentals.map((rental) => (
          <Card key={rental.id}>
            <div className="flex">
              <div className="flex-1">
                <CardHeader>
                  <CardTitle>{rental.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{rental.address}</p>
                  <p className="font-bold">${rental.price}/month</p>
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
