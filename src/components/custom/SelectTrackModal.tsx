"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../../convex/_generated/api";

type Track = "TVL" | "Academic";

interface Props {
  open: boolean;
  onDone: () => void; // called when we are safe to move on
}

export default function SelectTrackModal({ open, onDone }: Props) {
  const { user } = useUser();
  const store = useMutation(api.track.storeTrack);
  const [loading, setLoading] = useState(false);

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  const handleSelect = async (value: Track) => {
    if (!user || !convexUser) return;
    setLoading(true);
    try {
      await store({
        userId: convexUser._id,
        userEmail: user.emailAddresses[0]?.emailAddress ?? "",
        value,
      });
      toast.success(`Track "${value}" saved`);
      onDone();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save track");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-sm"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Select your Track</DialogTitle>
          <DialogDescription>
            Please choose your course track before entering the meeting room.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button disabled={loading} onClick={() => handleSelect("TVL")}>
            TVL
          </Button>
          <Button disabled={loading} onClick={() => handleSelect("Academic")}>
            Academic
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
