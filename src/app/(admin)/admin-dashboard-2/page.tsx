"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id, Doc } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useUserRole } from "@/hooks/useUserRole";
import { INTERVIEW_CATEGORY } from "@/constants";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import InterviewDetails from "@/components/custom/InterviewDetails";
import CommentDialog from "@/components/custom/CommentDialog";
import UserDataCard from "./_components/UserDataCard";
import InterviewDataChart from "./_components/InterviewDataChart";
import { DataTable } from "@/components/dataTable/roleChange/roleChange-data-table";
import { columns } from "@/components/dataTable/roleChange/roleChange-columns";
import InterviewDataCard from "./_components/InterviewDataCard";
import RoleChangeDataCard from "./_components/RoleChangeDataCard";
import LoaderUI from "@/components/custom/LoaderUI";

type Interview = Doc<"interviews">;

// Sub-component (no hooks)
const InterviewCategorySection = ({
  category,
  searchTerm,
  page,
  data,
  onSearchChange,
  onPageChange,
  users,
  onStatusUpdate,
}: {
  category: (typeof INTERVIEW_CATEGORY)[number];
  searchTerm: string;
  page: number;
  data: {
    interviews: Interview[];
    totalCount: number;
    totalPages: number;
  } | null;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  users: any[];
  onStatusUpdate: (id: Id<"interviews">, status: string) => void;
}) => {
  if (!data || data.interviews.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">{category.title}</h2>
        <Badge variant={category.variant}>{data.totalCount}</Badge>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${category.title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        {data.interviews.map((interview) => {
          const candidateInfo = getCandidateInfo(users, interview.candidateId);
          const startTime = new Date(interview.startTime);

          return (
            <Card
              key={interview._id}
              className="hover:shadow-md transition-all"
            >
              <CardHeader className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={candidateInfo.image} />
                      <AvatarFallback>{candidateInfo.initials}</AvatarFallback>
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
                          Review the student answers and AI feedback below.
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
              <CardContent className="p-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  {format(startTime, "MMM dd")}
                  <ClockIcon className="h-4 w-4" />
                  {format(startTime, "hh:mm a")}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                {interview.status === "completed" && (
                  <div className="flex gap-2 w-full">
                    <Button
                      className="flex-1"
                      onClick={() => onStatusUpdate(interview._id, "succeeded")}
                    >
                      <CheckCircle2Icon className="h-4 w-4 mr-2" /> Pass
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => onStatusUpdate(interview._id, "failed")}
                    >
                      <XCircleIcon className="h-4 w-4 mr-2" /> Fail
                    </Button>
                  </div>
                )}
                <CommentDialog interviewId={interview._id} />
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page} of {data.totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= data.totalPages}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default function AdminDashboard2() {
  const router = useRouter();
  const { isInterviewer, isAdmin, userData } = useUserRole();

  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);
  const roleChangeRequests = useQuery(api.roleChange.getAllRequests) ?? [];

  // ✅ FIXED STATE STRUCTURE
  const [searchTerms, setSearchTerms] = useState({
    upcoming: "",
    completed: "",
    succeeded: "",
    failed: "",
  });
  const [pages, setPages] = useState({
    upcoming: 1,
    completed: 1,
    succeeded: 1,
    failed: 1,
  });
  const [globalSearch, setGlobalSearch] = useState("");

  // ✅ EXACTLY 4 HOOK CALLS - ALWAYS SAME ORDER
  const upcomingData = useQuery(api.interviews.getInterviewsByCategory, {
    category: "upcoming",
    searchTerm: globalSearch || searchTerms.upcoming || undefined,
    page: pages.upcoming,
    itemsPerPage: 2,
  });

  const completedData = useQuery(api.interviews.getInterviewsByCategory, {
    category: "completed",
    searchTerm: globalSearch || searchTerms.completed || undefined,
    page: pages.completed,
    itemsPerPage: 2,
  });

  const succeededData = useQuery(api.interviews.getInterviewsByCategory, {
    category: "succeeded",
    searchTerm: globalSearch || searchTerms.succeeded || undefined,
    page: pages.succeeded,
    itemsPerPage: 2,
  });

  const failedData = useQuery(api.interviews.getInterviewsByCategory, {
    category: "failed",
    searchTerm: globalSearch || searchTerms.failed || undefined,
    page: pages.failed,
    itemsPerPage: 2,
  });

  // Handlers
  const handleStatusUpdate = useCallback(
    async (id: Id<"interviews">, status: string) => {
      try {
        await updateStatus({ id, status });
        toast.success(`Interview marked as ${status}`);
      } catch (error) {
        toast.error("Failed to update status");
      }
    },
    [updateStatus]
  );

  const handleCategorySearch = useCallback(
    (category: string, value: string) => {
      setSearchTerms((prev) => ({ ...prev, [category]: value }));
      setPages((prev) => ({ ...prev, [category]: 1 }));
    },
    []
  );

  const handlePageChange = useCallback((category: string, page: number) => {
    setPages((prev) => ({ ...prev, [category]: page }));
  }, []);

  const handleGlobalSearch = useCallback((value: string) => {
    setGlobalSearch(value);
    setPages({ upcoming: 1, completed: 1, succeeded: 1, failed: 1 });
  }, []);

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

  if (!interviews || !users) return <LoaderUI />;

  const groupedInterviews = groupInterviews(interviews);

  if (!isInterviewer || !userData) {
    router.push("/sign-in");
    return null;
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full min-h-0 flex flex-col lg:flex-row gap-5 py-5"
    >
      {/* Left panel */}
      <ResizablePanel className="w-full lg:w-[30%] h-full min-h-0 flex flex-col gap-5">
        {/* Global search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all interviews..."
              value={globalSearch}
              onChange={(e) => handleGlobalSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Link href="/schedule" className="w-full max-w-xs">
            <Button className="w-full">Schedule New</Button>
          </Link>
        </div>

        <ScrollArea className="flex-1">
          {/* Render each category section */}
          {[
            { key: "upcoming", data: upcomingData, index: 0 },
            { key: "completed", data: completedData, index: 1 },
            { key: "succeeded", data: succeededData, index: 2 },
            { key: "failed", data: failedData, index: 3 },
          ].map(({ key, data, index }) => (
            <InterviewCategorySection
              key={key}
              category={INTERVIEW_CATEGORY[index]}
              searchTerm={searchTerms[key as keyof typeof searchTerms]}
              page={pages[key as keyof typeof pages]}
              data={data}
              onSearchChange={(value) => handleCategorySearch(key, value)}
              onPageChange={(page) => handlePageChange(key, page)}
              users={users}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle />

      {/* Right panel - keep your existing content */}
      <ResizablePanel className="w-full lg:w-[70%] h-full min-h-0 flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UserDataCard
            totalUsers={users.length}
            totalStudents={users.filter((u) => u.role === "student").length}
            totalStaffs={
              users.filter((u) => u.role === "admin" || u.role === "teacher")
                .length
            }
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
        <InterviewDataChart />
        {isAdmin && (
          <div className="space-y-2 mt-5">
            <h2 className="text-2xl font-semibold">Role Change Requests</h2>
            <DataTable
              columns={columns}
              data={roleChangeRequests}
              showCreate={false}
              currentUserRole={userData?.role}
            />

            <Button className="w-full mt-4" asChild>
              <Link href="/users">Manage All Users</Link>
            </Button>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
