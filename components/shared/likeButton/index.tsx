"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import LoginRequired from "../loginRequired";
import { useState } from "react";

interface LikeButtonProps {
  liked: boolean;
  toggleLike: () => {};
}

export default function LikeButton({ liked, toggleLike }: LikeButtonProps) {
  const { isSignedIn } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const onClick = () => {
    if (!isSignedIn) {
      setOpen(true);
      return;
    }
    toggleLike();
  };
  return (
    <div>
      <Dialog open={open}>
        <DialogContent onClick={() => setOpen(false)} className="border-none">
          <LoginRequired />
        </DialogContent>
      </Dialog>

      <Button
        onClick={onClick}
        className={liked ? "bg-red-300" : ""}
        variant="ghost"
      >
        {liked ? (
          <Heart fill="red" color="red" className="h-4 w-4" />
        ) : (
          <Heart className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
