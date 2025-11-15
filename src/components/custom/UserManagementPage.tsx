"use client";

import { useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import InterviewDetails from "@/components/custom/InterviewDetails";
import { toast } from "sonner";
import LoaderUI from "@/components/custom/LoaderUI";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";

type Interview = Doc<"interviews">;
type User = Doc<"users"> & {
  interviews?: Interview[];
  interviewCount?: number;
};

// Sub-component for user card
const UserCard = ({ user }: { user: User }) => {
  const [showInterviews, setShowInterviews] = useState(false);

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{user.role}</Badge>
            {user.interviewCount !== undefined && (
              <Badge variant="outline">{user.interviewCount} interviews</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {user.interviews && user.interviews.length > 0 && (
          <div className="space-y-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInterviews(!showInterviews)}
            >
              {showInterviews ? "Hide" : "View"} Interviews (
              {user.interviews.length})
            </Button>
            {showInterviews && (
              <ScrollArea className="h-48">
                {user.interviews.map((interview) => (
                  <div
                    key={interview._id}
                    className="py-2 border-b last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{interview.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(interview.startTime),
                            "MMM dd, yyyy"
                          )}{" "}
                          - {interview.status}
                        </p>
                      </div>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button size="sm" variant="ghost">
                            Details
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
                  </div>
                ))}
              </ScrollArea>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<"student" | "teacher" | "admin">(
    "student"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // ✅ EXACTLY 1 QUERY - ALWAYS SAME ORDER
  const data = useQuery(api.users.getUsersByRole, {
    role: activeTab,
    searchTerm: searchTerm || undefined,
    page,
    itemsPerPage,
  });

  // Reset page when tab or search changes
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as any);
    setPage(1);
    setSearchTerm("");
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  if (!data) return <LoaderUI />;

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">
          View and manage users across all roles
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="student">Students</TabsTrigger>
          <TabsTrigger value="teacher">Teachers</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}s...`}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Content */}
          {data.users.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.users.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {data.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= data.totalPages}
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No {activeTab}s found
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
