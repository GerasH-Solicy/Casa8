import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Apartment } from "@/lib/interface";
import { Home } from "lucide-react";
import Link from "next/link";
import LikeButton from "../likeButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface ApartmentCardProps {
  apartment: Apartment;
  toggleLike: (id: string) => any;
}

export default function ApartmentCard({
  apartment,
  toggleLike,
}: ApartmentCardProps) {
  return (
    <Card key={apartment._id}>
      <div className="flex">
        <div className="flex-1">
          <CardHeader>
            <CardTitle>{apartment.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{apartment.address}</p>
            <p className="font-bold">${apartment.monthlyRent}/month</p>
            <p>
              {apartment.bedrooms} bed, {apartment.bathrooms} bath,{" "}
              {apartment?.squareFootage} sqft
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/apartment/${apartment._id}`}>
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" /> View
              </Button>
            </Link>
            <LikeButton
              liked={apartment?.liked as boolean}
              toggleLike={() => toggleLike(apartment._id)}
            />
          </CardFooter>
        </div>
        <div className="w-1/3 relative">
          <Carousel>
            <CarouselContent>
              {apartment?.images?.map((img: string) => {
                return (
                  <CarouselItem>
                    <img src={img} alt={apartment.title} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </Card>
  );
}
