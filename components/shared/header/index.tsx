import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Heart, Home } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <Link href="/">
        <h1 className="text-3xl font-bold">casa8</h1>
      </Link>
      <div className="flex items-center gap-5">
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <Home /> My Appartments
          </Button>
        </Link>
        <Link href="/liked">
          <Button variant="outline" className="gap-2">
            <Heart /> My favorites
          </Button>
        </Link>
        <Button>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn >
            <UserButton />
          </SignedIn>
        </Button>
      </div>
    </header>
  );
}
