import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useUserRole = () => {
  const { user } = useUser();

  const userData = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

  const isLoading = userData === undefined;

  return {
    isLoading,
    isInterviewer: userData?.role === "teacher" || userData?.role === "admin",
    isCandidate: userData?.role === "student",
    isGuest: userData?.role === "guest",
  };
};
