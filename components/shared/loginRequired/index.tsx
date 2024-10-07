import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import { LockIcon } from "lucide-react";

interface LoginRequiredProps {
  className?: string;
}

export default function LoginRequired({ className }: LoginRequiredProps) {
  return (
    <div className="flex items-center justify-center h-[400px] bg-background">
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
            <LockIcon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Login Required
          </CardTitle>
          <CardDescription className="text-center">
            You must be logged in to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Please log in to your account to view this content and access all
            features.
          </p>
          <div className="flex justify-center mt-4">
            <Button>
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
