"use client";

import Apartment from "@/components/featured/apartment";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  return <Apartment id={id as string} />;
}
