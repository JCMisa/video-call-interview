import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
  CheckIcon,
  DotIcon,
  LayoutListIcon,
  LoaderIcon,
  MicIcon,
  MicOffIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import EndCallButton from "./EndCallButton";
import InterviewQuestions from "./InterviewQuestions";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { chatSession } from "@/utils/GeminiModel";
import toast from "react-hot-toast";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
  readonly state: "inactive" | "active";
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

const MeetingRoom = () => {
  const router = useRouter();

  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);

  const [isRecognitionEnabled, setIsRecognitionEnabled] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [transcripts, setTranscripts] = useState<string[]>([]);

  const [studentAnswer, setStudentAnswer] = useState("");
  const [aiFeedback, setAiFeedback] = useState({
    feedback: "",
    rating: 0,
    suggestions: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    );
  }

  const initializeSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      console.log("Speech recognition not supported");
      return null;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "fil-PH";

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setIsRecognitionEnabled((prev) => !prev);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsRecognitionEnabled((prev) => !prev);
    };

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript;
          console.log("User said:", transcript);
          setTranscripts((prev) => [...prev, transcript]);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecognitionEnabled(false);
    };

    return recognition;
  };

  // Toggle function for the button
  const toggleRecognition = () => {
    try {
      if (!recognition) {
        // First time initialization
        const newRecognition = initializeSpeechRecognition();
        if (newRecognition) {
          setRecognition(newRecognition);
          newRecognition.start();
          setIsRecognitionEnabled(true);
        }
      } else {
        // Toggle existing recognition
        if (isRecognitionEnabled) {
          recognition.start();
        } else {
          recognition.stop();
        }
      }
    } catch (error) {
      console.error("Error toggling recognition:", error);
      setIsRecognitionEnabled(false);
    }
  };

  const saveAnswer = async () => {
    const studAnswer = transcripts.join(" ");
    console.log("student answers: ", studAnswer);

    setIsLoading(true);
    try {
      // update the interview schema and add the studentAnswers by passing it to EndCall component
      setStudentAnswer(studAnswer);

      // todo: pass the studentAnswers to gemini model and let it generate an evaluation
      const PROMPT = `
        interview questions:

What subject do you enjoy the most?

Which learning method do you find most effective?

How do you prefer to study?

Which type of extracurricular activity interest you the most?

What motivates you to participate in extracurricular activities?

What are your family expectations for your academic
performance?

student answer: ${studAnswer}`;

      const result = await chatSession.sendMessage(PROMPT);

      if (result) {
        const aiResult = result.response.text();
        const cleanedResult = JSON.parse(aiResult);
        setAiFeedback(cleanedResult);
        console.log("ai feedback response: ", cleanedResult);
      } else {
        toast.error("Failed to generate AI feedback");
      }

      // todo: update the interview schema and add the ai feedback by passing it to EndCall component
    } catch (error) {
      console.log(`${error}: failed to save answer and feedback`);
      toast.error("failed to save answer and feedback");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem-1px)]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={25}
          maxSize={100}
          className="relative"
        >
          {/* video layout */}
          <div className="absolute inset-0">
            {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

            {/* PARTICIPANTS LIST OVERLAY */}
            {showParticipants && (
              <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CallParticipantsList
                  onClose={() => setShowParticipants(false)}
                />
              </div>
            )}
          </div>

          {/* VIDEO CONTROLS */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                <CallControls onLeave={() => router.push("/")} />

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="size-10">
                        <LayoutListIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setLayout("grid")}>
                        Grid View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLayout("speaker")}>
                        Speaker View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10"
                    onClick={() => setShowParticipants(!showParticipants)}
                  >
                    <UsersIcon className="size-4" />
                  </Button>

                  {studentAnswer && aiFeedback && (
                    <EndCallButton
                      studentAnswer={studentAnswer}
                      aiFeedback={aiFeedback}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={65}
          minSize={25}
          className="flex flex-col items-start gap-10 p-4 w-full"
        >
          <InterviewQuestions />
          <div className="w-full">
            <div className="mb-4 max-h-60 overflow-y-auto card-scroll rounded border p-2">
              {transcripts.length === 0 ? (
                <p className="text-gray-500">No transcripts yet...</p>
              ) : (
                transcripts.map((text, index) => (
                  <p key={index} className="mb-2">
                    {text}
                  </p>
                ))
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                className={`p-5 px-10 min-w-32 ${
                  isRecognitionEnabled ? "bg-red-100 hover:bg-red-200" : ""
                }`}
                onClick={toggleRecognition}
                title={
                  isRecognitionEnabled
                    ? "Stop speech recognition"
                    : "Start speech recognition"
                }
              >
                {recognition ? (
                  isRecognitionEnabled ? (
                    <div className="flex items-center gap-2">
                      <MicIcon className="size-4 text-red-500 animate-pulse" />
                      <p className="text-sm text-red-500">
                        Speech-to-Text is off
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MicOffIcon className="size-4 text-primary animate-pulse" />
                      <p className="text-sm text-primary">
                        Speech-to-Text is on
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2">
                    <DotIcon className="size-20 animate-pulse" />
                    <p className="text-sm">Turn on Speech-to-Text</p>
                  </div>
                )}
              </Button>

              {transcripts.length > 0 && (
                <Button
                  className="flex items-center justify-center gap-2 p-5 px-10 min-w-32"
                  onClick={saveAnswer}
                  disabled={isLoading}
                >
                  {!studentAnswer &&
                  !aiFeedback.feedback &&
                  !aiFeedback.rating ? (
                    isLoading ? (
                      <>
                        <LoaderIcon className="size-4 animate-spin" />
                        <p className="text-sm">Saving...</p>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="size-4" />
                        <p className="text-sm">Save Answer</p>
                      </>
                    )
                  ) : (
                    <>
                      <CheckIcon className="size-4" />
                      <p className="text-sm">Answer Saved</p>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MeetingRoom;
