import { useUser } from "@clerk/nextjs";
import {
  CallRecording,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/custom/UserInfo";
import { ClipboardIcon, Loader2Icon, VideoIcon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
// import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/custom/MeetingCard";
import { useUserRole } from "@/hooks/useUserRole";
import useGetCalls from "@/hooks/useGetCalls";
import { ScrollArea } from "@/components/ui/scroll-area";
import RecordingCard from "@/components/custom/RecordingCard";
import { format } from "date-fns";

interface RecordingWithCallInfo {
  url: string;
  start_time: string;
  end_time: string;
  filename: string;
}

function InterviewScheduleUI() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];
  const createInterview = useMutation(api.interviews.createInterview);

  const candidates = users?.filter((u) => u.role === "student");
  const interviewers = users?.filter(
    (u) => u.role === "teacher" || u.role === "admin"
  );

  const { isInterviewer, isLoading } = useUserRole();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    candidateId: "",
    interviewerIds: user?.id ? [user.id] : [],
  });

  const scheduleMeeting = async () => {
    if (!client || !user) return;
    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and at least one interviewer");
      return;
    }

    setIsCreating(true);

    try {
      const { title, description, date, time, candidateId, interviewerIds } =
        formData;
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      await createInterview({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        candidateId,
        interviewerIds,
      });

      setOpen(false);
      toast.success("Meeting scheduled successfully!");

      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }));
    }
  };

  const removeInterviewer = (interviewerId: string) => {
    if (interviewerId === user?.id) return;
    setFormData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
    }));
  };

  const selectedInterviewers = interviewers.filter((i) =>
    formData.interviewerIds.includes(i.clerkId)
  );

  const availableInterviewers = interviewers.filter(
    (i) => !formData.interviewerIds.includes(i.clerkId)
  );

  // get interview recordings -- start
  const { calls } = useGetCalls({ isAdminView: true });
  const [recordings, setRecordings] = useState<RecordingWithCallInfo[]>([]);
  useEffect(() => {
    const fetchRecordings = async () => {
      console.log("Fetching recordings started");
      console.log("Calls available:", calls); // Debug log for calls

      if (!calls) {
        console.log("No calls available");
        return;
      }

      try {
        console.log("Number of calls to process:", calls.length);

        const recordingsData = await Promise.all(
          calls.map(async (call) => {
            console.log("Processing call:", call.cid); // Log each call being processed
            const response = await call.queryRecordings();
            console.log("Recordings for call:", call.cid, response.recordings);

            return response.recordings.map((recording) => ({
              url: recording.url,
              start_time: recording.start_time,
              end_time: recording.end_time,
              filename: recording.filename,
            }));
          })
        );

        const allRecordings = recordingsData
          .flat()
          .filter((recording) => recording.url);

        console.log("Filtered recordings:", allRecordings);
        setRecordings(allRecordings);
      } catch (error) {
        console.error("Error in fetchRecordings:", error);
      }
    };

    // Add a check to see if calls have changed
    console.log("useEffect triggered, calls:", calls);
    fetchRecordings();
  }, [calls]);

  // Add a debug log when recordings state changes
  useEffect(() => {
    console.log("Recordings state updated:", recordings);
  }, [recordings]);
  // get interview recordings -- end

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        {/* HEADER INFO */}
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage interviews
          </p>
        </div>

        {/* DIALOG */}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">Schedule Interview</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* INTERVIEW TITLE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Interview title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* INTERVIEW DESC */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Interview description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* CANDIDATE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Candidate</label>
                <Select
                  value={formData.candidateId}
                  onValueChange={(candidateId) =>
                    setFormData({ ...formData, candidateId })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem
                        key={candidate.clerkId}
                        value={candidate.clerkId}
                      >
                        <UserInfo user={candidate} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* INTERVIEWERS */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Interviewers</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedInterviewers.map((interviewer) => (
                    <div
                      key={interviewer.clerkId}
                      className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                    >
                      <UserInfo user={interviewer} />
                      {interviewer.clerkId !== user?.id && (
                        <button
                          onClick={() => removeInterviewer(interviewer.clerkId)}
                          className="hover:text-destructive transition-colors"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {availableInterviewers.length > 0 && (
                  <Select onValueChange={addInterviewer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInterviewers.map((interviewer) => (
                        <SelectItem
                          key={interviewer.clerkId}
                          value={interviewer.clerkId}
                        >
                          <UserInfo user={interviewer} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* DATE & TIME */}
              <div className="flex gap-4">
                {/* CALENDAR */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, date })
                    }
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* TIME */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  {/* // change the time slot based on the school time */}
                  <Input
                    type="time"
                    min="07:00"
                    max="22:00"
                    value={formData.time}
                    onChange={(e) => {
                      const time = e.target.value;
                      if (time >= "07:00" && time <= "22:00") {
                        setFormData({ ...formData, time });
                      } else {
                        toast.error(
                          "Please select a time between 7:00 AM and 10:00 PM"
                        );
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={scheduleMeeting} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Interview"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* LOADING STATE & MEETING CARDS */}
      {!interviews ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : interviews.length > 0 ? (
        <div className="spacey-4">
          <div className="grid gap-6">
            {interviews.map((interview) => (
              <div
                key={interview._id}
                className="grid grid-cols-5 gap-2 items-start"
              >
                <div className="col-span-3">
                  <MeetingCard
                    interview={interview}
                    isInterviewer={isInterviewer}
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  {recordings
                    .filter((rec) =>
                      rec.filename.includes(interview.streamCallId)
                    )
                    .sort(
                      (a, b) =>
                        new Date(a.start_time).getTime() -
                        new Date(b.start_time).getTime()
                    ) // Sort ascending
                    .map((recording, index) => (
                      <div
                        key={recording.filename || index}
                        className="p-3 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-md">
                            <VideoIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium truncate">
                                Recording {index + 1}
                              </p>
                              <time className="text-xs text-muted-foreground">
                                {format(
                                  new Date(recording.start_time),
                                  "MMM d, hh:mm a"
                                )}
                              </time>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <a
                                href={recording.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline truncate"
                              >
                                Watch Recording
                              </a>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => {
                                  navigator.clipboard.writeText(recording.url);
                                  toast.success("Recording URL copied!");
                                }}
                              >
                                <ClipboardIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {!recordings.some((rec) =>
                  rec.filename.includes(interview.streamCallId)
                ) && (
                  <p className="text-sm text-muted-foreground italic px-1">
                    No recordings available yet
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No interviews scheduled
        </div>
      )}

      {/* RECORDINGS
      <ScrollArea className="h-[calc(100vh-12rem)] mt-3">
        {recordings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            {recordings.map((r) => (
              <RecordingCard key={r.end_time} recording={r} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <p className="text-xl font-medium text-muted-foreground">
              No recordings available
            </p>
          </div>
        )}
      </ScrollArea> */}
    </div>
  );
}
export default InterviewScheduleUI;
