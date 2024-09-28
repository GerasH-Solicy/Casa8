import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Toaster />
          <div className="container mx-auto">
            <header className="flex justify-between items-center mb-8">
              <Link href="/">
                <h1 className="text-3xl font-bold">casa8</h1>
              </Link>
              <Button>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </Button>
            </header>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
