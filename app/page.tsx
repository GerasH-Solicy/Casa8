"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchRental from "@/components/shared/searchRental";
import PostRental from "@/components/shared/postRental";

export default function Casa8Interface() {
  return (
    <div>
      <Tabs defaultValue="search">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search Rentals</TabsTrigger>
          <TabsTrigger value="post">
            Post a Rental
          </TabsTrigger>
        </TabsList>
        <TabsContent value="post">
          <PostRental />
        </TabsContent>
        <TabsContent value="search">
          <SearchRental />
        </TabsContent>
      </Tabs>
    </div>
  );
}
