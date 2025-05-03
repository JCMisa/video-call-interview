"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import LoaderUI from "@/components/custom/LoaderUI";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { DataTable } from "@/components/dataTable/roleChange/roleChange-data-table";
import { columns } from "@/components/dataTable/roleChange/roleChange-columns";
import { useUserRole } from "@/hooks/useUserRole";
import { redirect } from "next/navigation";

type Interview = Doc<"interviews">;

function DashboardPage() {
  const { isInterviewer, isAdmin, userData } = useUserRole();

  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);
  const roleChangeRequests = useQuery(api.roleChange.getAllRequests) ?? [];

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
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href="/schedule">
          <Button>Schedule New Interview</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {INTERVIEW_CATEGORY.map((category) =>
          groupedInterviews[category.id]?.length > 0 ? (
            <section key={category.id}>
              {/* CATEGORY TITLE */}
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">{category.title}</h2>
                <Badge variant={category.variant}>
                  {groupedInterviews[category.id].length}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedInterviews[category.id].map((interview: Interview) => {
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
                                  Review the student answers and AI feedback
                                  below. Please provide your assessment.
                                </SheetDescription>
                              </SheetHeader>

                              <ScrollArea className="flex-1 mt-6">
                                <div className="px-2">
                                  <InterviewDetails interview={interview} />
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
                                handleStatusUpdate(interview._id, "succeeded")
                              }
                            >
                              <CheckCircle2Icon className="h-4 w-4 mr-2" />
                              Pass
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() =>
                                handleStatusUpdate(interview._id, "failed")
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
                })}
              </div>
            </section>
          ) : (
            <div className="flex flex-col gap-5 w-full">
              <div className="w-full h-32 bg-muted/30 rounded-lg animate-pulse"></div>
            </div>
          )
        )}
      </div>

      {/* list of role change requests */}
      {isAdmin && (
        <div className="space-y-2 mt-5">
          <h2 className="text-4xl font-semibold">Role Change Requests</h2>
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
  );
}
export default DashboardPage;
