"use client";

import LoaderUI from "@/components/custom/LoaderUI";
import MeetingRoom from "@/components/custom/MeetingRoom";
import MeetingSetup from "@/components/custom/MeetingSetup";
import SelectTrackModal from "@/components/custom/SelectTrackModal";
import useGetCallById from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { api } from "../../../../../convex/_generated/api";

const MeetingPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(true);

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  if (!isLoaded || isCallLoading) return <LoaderUI />;

  if (!call) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">Meeting not found</p>
      </div>
    );
  }

  const handleSetupComplete = (role?: string) => {
    setIsSetupComplete(true);

    // show modal only for students
    if (role === "student") setShowTrackModal(true);
    // otherwise skip it instantly
    else setShowTrackModal(false);
  };

  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup
            onSetupComplete={handleSetupComplete}
            userRole={convexUser?.role} // pass role down so Setup doesn't query again
          />
        ) : showTrackModal ? (
          <SelectTrackModal
            open={showTrackModal}
            onDone={() => setShowTrackModal(false)}
          />
        ) : (
          <MeetingRoom />
        )}
      </StreamTheme>
    </StreamCall>
  );
};

export default MeetingPage;
