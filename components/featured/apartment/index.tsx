"use client";

import {
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Square,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useApartament } from "@/hooks/useApartament";
import { useUser } from "@clerk/nextjs";

interface ApartmentProps {
  id: string;
}

export default function Apartment({ id }: ApartmentProps) {
  const [rental, setRental] = useState<any | null>(null);
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [disableLike, setDisableLike] = useState<boolean>();
  const { getApartamentById, toogleLikeApartament } = useApartament();

  const fetchAppartment = async () => {
    setLoading(true);
    const res = await getApartamentById(
      id,
      user?.emailAddresses[0].emailAddress ?? ""
    );
    setLoading(false);
    setRental(res.apartment);
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
      setRental({ ...rental, liked: !rental.liked });
    }
  };

  useEffect(() => {
    if (id) {
      fetchAppartment();
    }
  }, [id, user]);

  return (
    <Card className="">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{rental?.title}</h2>
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {rental?.address}
          </p>
        </div>
        <Button
          onClick={() => toggleLike(rental._id)}
          className={rental?.liked && "bg-red-300"}
          variant="ghost"
        >
          {rental?.liked ? (
            <Heart fill="red" color="red" className="h-4 w-4" />
          ) : (
            <Heart className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex justify-center">
          <Carousel>
            <CarouselContent>
              {rental?.images?.map((img: string) => {
                return (
                  <CarouselItem className="flex justify-center items-center">
                    <img src={img} alt={rental?.title} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="grid grid-cols-4 gap-4 p-6">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">{rental?.monthlyRent}/month</span>
          </div>
          <div className="flex items-center">
            <BedDouble className="w-5 h-5 mr-2" />
            <span>{rental?.bedrooms} Bedrooms</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-5 h-5 mr-2" />
            <span>{rental?.bathrooms} Bathrooms</span>
          </div>
          <div className="flex items-center">
            <Square className="w-5 h-5 mr-2" />
            <span>{rental?.squareFootage} sqft</span>
          </div>
        </div>
        <div className="px-6">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-sm text-muted-foreground">{rental?.description}</p>
        </div>
        <div className="px-6 mt-4">
          <h3 className="font-semibold mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {rental?.amenities?.map((amenity: string, index: number) => (
              <Badge key={index} variant="secondary">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center px-6 mt-4">
          <CalendarDays className="w-5 h-5 mr-2" />
          <span className="text-sm">
            Available from:{" "}
            {rental?.available.split("T")[0]}
          </span>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-100 mt-4 h-[100px] flex justify-between items-center">
        <Button variant="outline">Contact Landlord</Button>
        <Button>Schedule a Viewing</Button>
      </CardFooter>
    </Card>
  );
}
