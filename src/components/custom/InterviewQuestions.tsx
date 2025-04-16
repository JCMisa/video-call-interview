import { LightbulbIcon } from "lucide-react";
import React from "react";

const InterviewQuestions = () => {
  return (
    <div className="w-full flex flex-col space-y-6 overflow-auto card-scroll">
      <div className="w-full bg-primary/10 p-6 rounded-xl text-xs mb-5">
        <div className="flex items-center gap-3">
          <LightbulbIcon />
          <h2 className="text-sm font-bold">Take Note!</h2>
        </div>
        <p className="mt-2">
          Please answer the following questions honestly and to the best of your
          ability. To answer, please open your{" "}
          <span className="text-primary font-bold text-[13px]">microphone</span>{" "}
          and turn on the{" "}
          <span className="text-primary font-bold text-[13px]">
            speech-to-text
          </span>{" "}
          button before speaking to convert your voice to text. You can provide
          other answers aside from the options provided for each question. Rest
          assured that the answers collected will only be used for{" "}
          <span className="text-primary font-bold text-[13px]">analysis</span>{" "}
          and{" "}
          <span className="text-primary font-bold text-[13px]">evaluation</span>{" "}
          for school admission purposes. Don&apos;t forget to click on{" "}
          <span className="text-primary font-bold text-[13px]">
            "Submit Answer"
          </span>{" "}
          button first before{" "}
          <span className="text-primary font-bold text-[13px]">"Ending"</span>{" "}
          the call to save your answer, neglecting to click it before ending the
          call will result to negative feedback and lead to interview{" "}
          <span className="text-red-600 font-bold text-[13px]">failure</span>.
        </p>
      </div>
      <div className="w-full flex flex-col space-y-6 overflow-auto card-scroll">
        <div className="flex items-start flex-col gap-3">
          <h2 className="text-2xl font-bold">ACADEMIC INTERESTS</h2>
          {/* q1 */}
          <div className="flex flex-col gap-2 w-full">
            <p className="text-lg font-semibold">
              What subject do you enjoy the most?
            </p>
            <div className="grid grid-cols-2 gap-3 justify-between w-full">
              <span>🟢 Math</span>
              <span>🟢 Science</span>
              <span>🟢 Literature</span>
              <span>🟢 Filipino</span>
            </div>
          </div>
          {/* q2 */}
          <div className="flex flex-col gap-2 w-full">
            <p className="text-lg font-semibold">
              Which learning method do you find most effective?
            </p>
            <div className="grid grid-cols-2 gap-3 justify-between w-full">
              <span>🟢 Lectures</span>
              <span>🟢 Face-to-Face</span>
              <span>🟢 Modular</span>
              <span>🟢 Online Class</span>
            </div>
          </div>
          {/* q3 */}
          <div className="flex flex-col gap-2 w-full">
            <p className="text-lg font-semibold">How do you prefer to study?</p>
            <div className="grid grid-cols-2 gap-3 justify-between w-full">
              <span>🟢 Alone</span>
              <span>🟢 With a group</span>
              <span>🟢 With a tutor</span>
              <span>🟢 Using online resources</span>
            </div>
          </div>
        </div>

        <hr className="w-full bg-blend-screen" />

        <div className="flex items-start flex-col gap-3">
          <h2 className="text-2xl font-bold">EXTRACURRICULAR ACTIVITIES</h2>
          {/* q4 */}
          <div className="flex flex-col gap-2 w-full">
            <p className="text-lg font-semibold">
              Which type of extracurricular activity interest you the most?
            </p>
            <div className="grid grid-cols-2 gap-3 justify-between w-full">
              <span>🟢 Sports</span>
              <span>🟢 Music and Arts</span>
              <span>🟢 Academic Clubs</span>
              <span>🟢 Leadership</span>
            </div>
          </div>
          {/* q5 */}
          <div className="flex flex-col gap-2 w-full">
            <p className="text-lg font-semibold">
              What motivates you to participate in extracurricular activities?
            </p>
            <div className="grid grid-cols-2 gap-3 justify-between w-full">
              <span>🟢 Personal enjoyment</span>
              <span>🟢 Skill development</span>
              <span>🟢 Social interaction</span>
              <span>🟢 Certificates and awards</span>
            </div>
          </div>
        </div>

        <hr className="w-full bg-blend-screen" />

        <div className="flex items-start flex-col gap-3">
          <h2 className="text-2xl font-bold">FAMILY BACKGROUND</h2>
          {/* q6 */}
          <div className="flex flex-col gap-2 w-full">
            <p className="text-lg font-semibold">
              What are your family&apos;s expectations for your academic
              performance?
            </p>
            <div className="grid grid-cols-2 gap-3 justify-between w-full">
              <span>🟢 High expectations, but supportive</span>
              <span>🟢 Reasonable expectations, focused on effort</span>
              <span>🟢 Minimal expectations</span>
              <span>🟢 Others, explain</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestions;
