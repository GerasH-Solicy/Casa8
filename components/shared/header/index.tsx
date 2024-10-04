"use client";

import { Button } from "@/components/ui/button";
import { useApartament } from "@/hooks/useApartament";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Heart, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<any>(null);
  const pathname = usePathname();
  const { getUserOrCreateOnDb } = useApartament();
  const getOrCreateUser = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      return;
    }
    const res = await getUserOrCreateOnDb(user?.primaryEmailAddress?.emailAddress);
    if (res.success) {
      setDbUser(res.user);
    }
  };

  useEffect(() => {
    getOrCreateUser();
  }, [user, pathname]);

  return (
    <header className="flex justify-between items-center mb-8">
      <Link href="/">
        <h1 className="text-3xl font-bold">casa8</h1>
      </Link>
      <div className="flex items-center gap-5">
        {dbUser && dbUser.isLandlord && (
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <Home /> My Listings
            </Button>
          </Link>
        )}
        <Link href="/liked">
          <Button variant="outline" className="gap-2">
            <Heart /> My favorites
          </Button>
        </Link>
        <Button>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Button>
      </div>
    </header>
  );
}
