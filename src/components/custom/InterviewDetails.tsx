import { format } from "date-fns";
import { Star, Clock, Calendar } from "lucide-react";
import { Doc } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

type Interview = Doc<"interviews">;

const InterviewDetails = ({ interview }: { interview: Interview }) => {
  const users = useQuery(api.users.getUsers);
  const comments = useQuery(api.comments.getComments, {
    interviewId: interview._id,
  });

  // Questions array for better organization
  const questions = [
    "What subject do you enjoy the most? Please explain.",
    "Which learning method do you find most effective? Please explain.",
    "How do you prefer to study? Please explain.",
    "Which type of extracurricular activity interest you the most? Please explain.",
    "What motivates you to participate in extracurricular activities? Please explain.",
    "What are your family's expectations for your academic performance? Please explain.",
  ];

  const renderComments = () => {
    if (!comments || comments.length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center italic py-4">
          No comments yet
        </p>
      );
    }

    return comments.map((comment) => {
      const commenter = users?.find(
        (user) => user.clerkId === comment.interviewerId
      );
      const userInitials = commenter?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div
          key={comment._id}
          className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30"
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={commenter?.image} alt={commenter?.name} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium truncate">
                  {commenter?.name || "Unknown User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(commenter?.role ?? "unknown").charAt(0).toUpperCase() +
                    (commenter?.role ?? "unknown").slice(1)}
                </p>
              </div>
              <div className="flex items-center shrink-0">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-3 w-3 ${
                      index < comment.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 break-words">
              {comment.content}
            </p>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{interview.title}</h2>
          <Badge
            variant={
              interview.status === "completed"
                ? "outline"
                : interview.status === "succeeded"
                  ? "default"
                  : interview.status === "failed"
                    ? "destructive"
                    : "secondary"
            }
          >
            {interview.status.charAt(0).toUpperCase() +
              interview.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(interview.startTime), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(interview.startTime), "h:mm a")}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Questions List */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border bg-muted/30"
                  >
                    <p className="text-sm">
                      <span className="text-primary font-medium">
                        Question {index + 1}:
                      </span>{" "}
                      {question}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Column - Student Answer */}
        <Card>
          <CardHeader>
            <CardTitle>Student Response</CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete answer provided by the student
            </p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="p-4 rounded-lg border bg-muted/30 whitespace-pre-wrap">
                <p className="text-sm leading-relaxed">
                  {interview.studentAnswer || "No answer provided"}
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* AI Feedback Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              AI Assessment
              <Badge variant="outline">
                Rating: {interview.aiFeedback?.rating || 0}/10
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* General Feedback */}
            <div>
              <h3 className="text-sm font-medium mb-2">General Feedback</h3>
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  {interview.aiFeedback?.feedback || "No feedback available"}
                </p>
              </div>
            </div>

            {/* Suggestions with HTML formatting */}
            <div>
              <h3 className="text-sm font-medium mb-2">Detailed Suggestions</h3>
              <div className="p-3 rounded-lg border bg-muted/30">
                <div
                  className="text-sm text-muted-foreground prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      interview.aiFeedback?.suggestions ||
                      "No suggestions available",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Interviewer Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              {renderComments()}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewDetails;
