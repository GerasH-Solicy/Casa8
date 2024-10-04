import {
  ClerkProvider,
} from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/shared/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Toaster  />
          <div className="container mx-auto">
            <Header />
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
