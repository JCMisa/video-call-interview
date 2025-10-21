import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconBrain,
  IconClipboardCopy,
  IconFileBroken,
  IconFileText,
  IconMicrophone,
  IconRating12Plus,
  IconSignature,
  IconTableColumn,
  IconUserCheck,
  IconVideo,
} from "@tabler/icons-react";
import Image from "next/image";

export function GuestBentoGrid() {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}

const ImageHeader = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
    <Image src={src} alt={alt} layout="fill" objectFit="cover" />
  </div>
);

const items = [
  {
    title: "Virtual Interview Platform",
    description:
      "Conduct your admission interview seamlessly through a GMeet-like video interface.",
    header: (
      <ImageHeader
        src="https://i.ibb.co/C3qtb0WB/virtual-interview-platform.png"
        alt="Student taking a virtual interview"
      />
    ),
    icon: <IconVideo className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Optional Video Interaction",
    description:
      "Students can choose to open their camera, ensuring a flexible and comfortable interview experience.",
    header: (
      <ImageHeader
        src="https://i.ibb.co/RKdxMGD/optional-video-interaction.png"
        alt="Camera and mic icons on a screen"
      />
    ),
    icon: <IconVideo className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Voice Recording & Capture",
    description:
      "Answers are captured via microphone for accurate and complete response recording.",
    header: (
      <ImageHeader
        src="https://i.ibb.co/Hp7DDxZG/voice-recording-and-capture.png"
        alt="Person speaking into a microphone"
      />
    ),
    icon: <IconMicrophone className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Automated Transcript Generation",
    description:
      "Spoken responses are immediately transcribed into text, ready for detailed analysis.",
    header: (
      <ImageHeader
        src="https://i.ibb.co/4gdQdYsQ/automated-transcript-generator.png"
        alt="Text being transcribed on a tablet"
      />
    ),
    icon: <IconFileText className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Gemini AI Analysis & Suggestions",
    description:
      "Integrated AI provides deep analysis, suggestions, and feedback on the content of the answers.",
    header: (
      <ImageHeader
        src="https://i.ibb.co/KxR0prfv/gemini-ai-analysis.png"
        alt="AI brain with data points"
      />
    ),
    icon: <IconBrain className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Performance Scoring & Rating",
    description:
      "The AI system generates objective ratings and scores for each student's response quality.",
    header: (
      <ImageHeader
        src="https://i.ibb.co/jv12FkZc/performance-scoring.png"
        alt="Rating stars or a score report"
      />
    ),
    icon: <IconRating12Plus className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Informed Decision Support",
    description:
      "Interviewers and admins receive comprehensive AI reports to confidently determine pass/fail status.",
    header: (
      <ImageHeader
        src="https://i.ibb.co/cS96cV2B/informed-decision-support.png"
        alt="Interviewer looking at a report"
      />
    ),
    icon: <IconUserCheck className="h-4 w-4 text-blue-500" />,
  },
];
