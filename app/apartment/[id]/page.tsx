"use client";

import Apartment from "@/components/featured/apartment";
import ApartmentListingCard from "@/components/featured/apartment";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

export default function Page() {
  const { id } = useParams();
  return <Apartment id={id as string} />;
}
