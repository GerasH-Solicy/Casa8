"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchRental from "@/components/shared/searchRental";
import PostRental from "@/components/shared/postRental";
import { useSearchParams } from "next/navigation";

export default function Casa8Interface() {
  const searchParams = useSearchParams();
  const [tabValue, setTabValue] = useState("search");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setTabValue(tab);
    } else {
      setTabValue("search");
    }
  }, [searchParams]);

  return (
    <div>
      <Tabs value={tabValue} onValueChange={(value) => setTabValue(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search Rentals</TabsTrigger>
          <TabsTrigger value="post">Post a Rental</TabsTrigger>
        </TabsList>
        <TabsContent value="search">
          <SearchRental />
        </TabsContent>
        <TabsContent value="post">
          <PostRental />
        </TabsContent>
      </Tabs>
    </div>
  );
}
