import { Doc, Id } from "../../../convex/_generated/dataModel";
import useMeetingActions from "@/hooks/useMeetingActions";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CalendarIcon, LoaderCircleIcon, TrashIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CommentDialog from "./CommentDialog";

type Interview = Doc<"interviews">;

function MeetingCard({
  interview,
  isInterviewer = false,
}: {
  interview: Interview;
  isInterviewer?: boolean;
}) {
  const { joinMeeting } = useMeetingActions();

  const status = getMeetingStatus(interview);
  const formattedDate = format(
    new Date(interview.startTime),
    "EEEE, MMMM d · h:mm a"
  );

  const [deleting, isDeleting] = useState<boolean>(false);

  const deleteInterview = useMutation(api.interviews.deleteInterview);

  const handleDeleteInterview = async (interviewId: Id<"interviews">) => {
    isDeleting(true);
    try {
      await deleteInterview({ interviewId });
    } catch (error) {
      console.log("Error deleting interview:", error);
      toast.error("Something went wrong");
    } finally {
      isDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-2 relative">
        <div className="flex items-center justify-between gap-3 mt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            {formattedDate}
          </div>

          <Badge
            variant={
              status === "live"
                ? "default"
                : status === "upcoming"
                  ? "secondary"
                  : status === "failed"
                    ? "destructive"
                    : status === "succeeded"
                      ? "default"
                      : "outline"
            }
          >
            {status === "live"
              ? "Live Now"
              : status === "upcoming"
                ? "Upcoming"
                : status === "failed"
                  ? "Failed"
                  : status === "succeeded"
                    ? "Passed"
                    : "Completed"}
          </Badge>

          <div className="absolute bottom-0 right-4">
            <CommentDialog
              interviewId={interview._id}
              isInterviewer={isInterviewer}
            />
          </div>

          {isInterviewer && (
            <AlertDialog>
              <AlertDialogTrigger asChild className="absolute top-0 right-0">
                <Button variant={"ghost"} size={"sm"}>
                  {deleting ? (
                    <LoaderCircleIcon className="size-4 animate-spin" />
                  ) : (
                    <TrashIcon className="size-4 text-red-600" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this interview and remove related data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteInterview(interview._id)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <CardTitle>{interview.title}</CardTitle>

        {interview.description && (
          <CardDescription className="line-clamp-2">
            {interview.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {status === "live" && (
          <Button
            className="w-full"
            onClick={() => joinMeeting(interview.streamCallId)}
          >
            Join Meeting
          </Button>
        )}

        {status === "upcoming" && (
          <Button variant="outline" className="w-full" disabled>
            Waiting to Start
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
export default MeetingCard;
