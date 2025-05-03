"use client";

import ActionCard from "@/components/custom/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import MeetingModal from "@/components/custom/MeetingModal";
import LoaderUI from "@/components/custom/LoaderUI";
import { Loader2Icon } from "lucide-react";
import MeetingCard from "@/components/custom/MeetingCard";
import BeCandidateButton from "@/components/custom/BeCandidateButton";

export default function Home() {
  const router = useRouter();

  const {
    isInterviewer,
    isAdmin,
    isTeacher,
    isCandidate,
    isGuest,
    isLoading,
    userData,
  } = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterviews);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  const filteredActions = QUICK_ACTIONS.filter((action) => {
    if (isAdmin || isTeacher) {
      return true; // Show all actions
    }
    // For students, only show actions that include "student" in allowedRoles
    return action.allowedRoles.includes("student");
  });

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };

  if (isLoading) return <LoaderUI />;

  if (!userData) {
    router.push("/sign-in");
  }

  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* welcome section */}
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-muted-foreground mt-2">
            {isInterviewer
              ? "Manage your admission interviews and review students effectively"
              : isCandidate
                ? "Access your upcoming admission interviews and preparations"
                : "Be a candidate and request a role change to the Administrator"}
          </p>
        </div>

        <BeCandidateButton
          user={userData as UserType}
          defaultRole={
            isAdmin
              ? "admin"
              : isTeacher
                ? "teacher"
                : isCandidate
                  ? "student"
                  : "guest"
          }
        />
      </div>

      {(isInterviewer || isCandidate) && (
        <>
          <div
            className={`grid ${isCandidate && "grid-cols-1"} ${isInterviewer && "grid-cols-1 sm:grid-cols-2"} gap-6`}
          >
            {filteredActions.map((action) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
      )}
      {isCandidate && (
        <div className="mt-5">
          <div>
            <h1 className="text-3xl font-bold">Your Interviews</h1>
            <p className="text-muted-foreground mt-1">
              View and join your scheduled interviews
            </p>
          </div>

          <div className="mt-8">
            {interviews === undefined ? (
              <div className="flex justify-center py-12">
                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : interviews.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview) => (
                  <MeetingCard key={interview._id} interview={interview} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                You have no scheduled interviews at the moment
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
