"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import { INTERVIEW_CATEGORY } from "@/constants";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import { format } from "date-fns";
import CommentDialog from "@/components/custom/CommentDialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import InterviewDetails from "@/components/custom/InterviewDetails";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserRole } from "@/hooks/useUserRole";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import LoaderUI from "@/components/custom/LoaderUI";
import { useRouter } from "next/navigation";
import UserDataCard from "./_components/UserDataCard";
import InterviewDataCard from "./_components/InterviewDataCard";
import RoleChangeDataCard from "./_components/RoleChangeDataCard";
import InterviewDataChart from "./_components/InterviewDataChart";
import { DataTable } from "@/components/dataTable/roleChange/roleChange-data-table";
import { columns } from "@/components/dataTable/roleChange/roleChange-columns";

type Interview = Doc<"interviews">;

const AdminDashboard2 = () => {
  const router = useRouter();
  const { isInterviewer, isAdmin, userData } = useUserRole();

  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);
  const roleChangeRequests = useQuery(api.roleChange.getAllRequests) ?? [];

  // users
  const totalStudents = users?.filter((user) => user.role === "student");
  const totalStaffs = users?.filter(
    (user) => user.role === "admin" || user.role === "teacher"
  );

  // interviews
  const successfullInterviews = interviews.filter(
    (interview) => interview.status === "succeeded"
  );
  const failedInterviews = interviews.filter(
    (interview) => interview.status === "failed"
  );

  // role change
  const successfullRoleChange = roleChangeRequests.filter(
    (req) => req.status === "approved"
  );
  const pendingRoleChange = roleChangeRequests.filter(
    (req) => req.status === "pending"
  );
  const failedRoleChange = roleChangeRequests.filter(
    (req) => req.status === "rejected"
  );

  const handleStatusUpdate = async (
    interviewId: Id<"interviews">,
    status: string
  ) => {
    try {
      await updateStatus({ id: interviewId, status });
      toast.success(`Interview marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (!interviews || !users) return <LoaderUI />;

  const groupedInterviews = groupInterviews(interviews);

  if (!isInterviewer || !userData) {
    router.push("/sign-in");
  }

  return (
    <div className="h-full min-h-0 flex flex-col lg:flex-row gap-5 py-5">
      {/* left side */}
      <div className="w-full lg:w-[30%] h-full min-h-0 flex flex-col gap-5">
        {/* start new interview button */}
        <div className="flex items-center justify-center w-full">
          <Link href="/schedule" className="w-full">
            <Button className="w-full">Schedule New Interview</Button>
          </Link>
        </div>
        <div className="space-y-8">
          {INTERVIEW_CATEGORY.map(
            (category) =>
              groupedInterviews[category.id]?.length > 0 && (
                <section key={category.id}>
                  {/* CATEGORY TITLE */}
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-semibold">{category.title}</h2>
                    <Badge variant={category.variant}>
                      {groupedInterviews[category.id].length}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1  gap-4">
                    {groupedInterviews[category.id].map(
                      (interview: Interview) => {
                        const candidateInfo = getCandidateInfo(
                          users,
                          interview.candidateId
                        );
                        const startTime = new Date(interview.startTime);

                        return (
                          <Card className="hover:shadow-md transition-all">
                            {/* CANDIDATE INFO */}
                            <CardHeader className="p-4">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={candidateInfo.image} />
                                    <AvatarFallback>
                                      {candidateInfo.initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <CardTitle className="text-base">
                                      {candidateInfo.name}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                      {interview.title}
                                    </p>
                                  </div>
                                </div>

                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      View Details
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent
                                    side="bottom"
                                    className="h-[80vh] overflow-hidden flex flex-col"
                                  >
                                    <SheetHeader className="flex-none">
                                      <SheetTitle>Interview Details</SheetTitle>
                                      <SheetDescription>
                                        Review the student answers and AI
                                        feedback below. Please provide your
                                        assessment.
                                      </SheetDescription>
                                    </SheetHeader>

                                    <ScrollArea className="flex-1 mt-6">
                                      <div className="px-2">
                                        <InterviewDetails
                                          interview={interview}
                                        />
                                      </div>
                                    </ScrollArea>
                                  </SheetContent>
                                </Sheet>
                              </div>
                            </CardHeader>

                            {/* DATE &  TIME */}
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-4 w-4" />
                                  {format(startTime, "MMM dd")}
                                </div>
                                <div className="flex items-center gap-1">
                                  <ClockIcon className="h-4 w-4" />
                                  {format(startTime, "hh:mm a")}
                                </div>
                              </div>
                            </CardContent>

                            {/* PASS & FAIL BUTTONS */}
                            <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                              {interview.status === "completed" && (
                                <div className="flex gap-2 w-full">
                                  <Button
                                    className="flex-1"
                                    onClick={() =>
                                      handleStatusUpdate(
                                        interview._id,
                                        "succeeded"
                                      )
                                    }
                                  >
                                    <CheckCircle2Icon className="h-4 w-4 mr-2" />
                                    Pass
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() =>
                                      handleStatusUpdate(
                                        interview._id,
                                        "failed"
                                      )
                                    }
                                  >
                                    <XCircleIcon className="h-4 w-4 mr-2" />
                                    Fail
                                  </Button>
                                </div>
                              )}
                              <CommentDialog interviewId={interview._id} />
                            </CardFooter>
                          </Card>
                        );
                      }
                    )}
                  </div>
                </section>
              )
          )}
        </div>
      </div>
      {/* right side */}
      <div className="w-full lg:w-[70%] h-full min-h-0 flex flex-col gap-10">
        {/* data cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UserDataCard
            totalUsers={users.length || 0}
            totalStudents={totalStudents?.length || 0}
            totalStaffs={totalStaffs?.length || 0}
          />

          <InterviewDataCard
            totalInterviews={interviews.length || 0}
            successfullInterviews={successfullInterviews.length || 0}
            failedInterviews={failedInterviews.length || 0}
          />

          <RoleChangeDataCard
            totalRoleChange={roleChangeRequests.length || 0}
            successfullRoleChange={successfullRoleChange.length || 0}
            pendingRoleChange={pendingRoleChange.length || 0}
            failedRoleChange={failedRoleChange.length || 0}
          />
        </div>

        {/* chart section */}
        <InterviewDataChart />

        {/* list of role change requests */}
        {isAdmin && (
          <div className="space-y-2 mt-5">
            <h2 className="text-2xl font-semibold">Role Change Requests</h2>
            <DataTable
              columns={columns}
              data={roleChangeRequests?.length > 0 ? roleChangeRequests : []}
              // query1="requestOwner"
              showCreate={false}
              currentUserRole={userData?.role}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard2;
