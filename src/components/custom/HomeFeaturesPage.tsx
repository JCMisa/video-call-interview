"use client";

import Image from "next/image";
import {
  IconVideo,
  IconMicrophone,
  IconFileText,
  IconBrain,
  IconRating12Plus,
  IconUserCheck,
} from "@tabler/icons-react";

export default function FeaturesPage() {
  return (
    <section className="w-full bg-background">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-20">
        {/* HEADING */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Everything you need for smarter admission interviews
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            An all-in-one platform that blends human interaction with AI-powered
            insights to help you make confident, data-driven decisions.
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid gap-16">
          {features.map((feat) => (
            <FeatureRow key={feat.title} {...feat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  title,
  description,
  image,
  icon,
  reverse = false,
}: {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-8 lg:gap-12 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* TEXT */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </span>
          <h3 className="text-xl md:text-2xl font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground md:text-lg leading-relaxed">
          {description}
        </p>
      </div>

      {/* IMAGE */}
      <div className="flex-1 w-full">
        <div className="relative aspect-video w-full rounded-xl overflow-hidden border bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- DATA ---------- */
const features = [
  {
    title: "Virtual Interview Platform",
    description:
      "Conduct admission interviews seamlessly through a GMeet-like video interface—no extra plugins required.",
    image: "https://i.ibb.co/C3qtb0WB/virtual-interview-platform.png",
    icon: <IconVideo className="h-5 w-5" />,
  },
  {
    title: "Optional Video Interaction",
    description:
      "Students choose whether to turn on their camera, ensuring a comfortable and flexible experience.",
    image: "https://i.ibb.co/RKdxMGD/optional-video-interaction.png",
    icon: <IconVideo className="h-5 w-5" />,
    reverse: true,
  },
  {
    title: "Voice Recording & Capture",
    description:
      "Every answer is captured through the microphone for accurate, complete response recording.",
    image: "https://i.ibb.co/Hp7DDxZG/voice-recording-and-capture.png",
    icon: <IconMicrophone className="h-5 w-5" />,
  },
  {
    title: "Automated Transcript Generation",
    description:
      "Spoken responses are instantly transcribed into text, ready for detailed analysis.",
    image: "https://i.ibb.co/4gdQdYsQ/automated-transcript-generator.png",
    icon: <IconFileText className="h-5 w-5" />,
    reverse: true,
  },
  {
    title: "Gemini AI Analysis & Suggestions",
    description:
      "Integrated AI delivers deep insights, suggestions, and feedback on every answer.",
    image: "https://i.ibb.co/KxR0prfv/gemini-ai-analysis.png",
    icon: <IconBrain className="h-5 w-5" />,
  },
  {
    title: "Performance Scoring & Rating",
    description:
      "Objective, AI-generated ratings and scores quantify each student's response quality.",
    image: "https://i.ibb.co/jv12FkZc/performance-scoring.png",
    icon: <IconRating12Plus className="h-5 w-5" />,
    reverse: true,
  },
  {
    title: "Informed Decision Support",
    description:
      "Admins and interviewers receive comprehensive AI reports to confidently determine pass/fail status.",
    image: "https://i.ibb.co/cS96cV2B/informed-decision-support.png",
    icon: <IconUserCheck className="h-5 w-5" />,
  },
];
