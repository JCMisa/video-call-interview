import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.85,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

export const chatSession = model.startChat({
  generationConfig,
  safetySettings,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `interview questions:

What subject do you enjoy the most?

Which learning method do you find most effective?

How do you prefer to study?

Which type of extracurricular activity interest you the most?

What motivates you to participate in extracurricular activities?

What are your family expectations for your academic
performance?

student answer:
Hello i am ian maloles and my favorite subject is math. So i like to. The learning method i. Want the most is a modular method. So i want to study alone. And. I like sports. The reason why i. Participate in extra curricular activities is to enhance my skills and also about my family background. My family have a. A reasonable expectations, focus on effort about my academic performance.

based on the interview questions and student answer, generate an object with properties such as feedback which is your feedback on student answer, rating which is a number rating from 1 to 10, and suggestions which is your possible suggestions if any for the improvement of the student answer in an HTML format, make it in a JSON format.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `\`\`\`json
{
  "feedback": "Ian, thanks for sharing your answers! While your response gives a basic understanding of your interests and preferences, it could be improved with more detail and clarity. For example, you mention liking math but don't explain *why* you enjoy it. Similarly, you state a preference for modular learning and studying alone, but it would be beneficial to explain *how* these methods help you learn best. The answer about extracurricular activities is a little vague – specifying which sports you enjoy would make your answer stronger. Finally, elaborating on what 'reasonable expectations' means in your family would provide a more complete picture.",
  "rating": 5,
  "suggestions": "<h3>Suggestions for Improvement</h3>\\n<ul>\\n  <li><b>Favorite Subject (Math):</b> Instead of just saying you like math, explain *why*. Is it the problem-solving aspect? The logical thinking? Give a specific example of something you enjoyed learning in math. For instance:  <i>\\"My favorite subject is math because I enjoy the challenge of problem-solving. I particularly liked learning about trigonometry because it helped me understand how angles and distances are related.\\"</i></li>\\n  <li><b>Learning Method (Modular):</b> Expand on why you prefer modular learning. What benefits does it offer *you*? How does it help you learn? For example: <i>\\"I find the modular learning method most effective because it allows me to learn at my own pace and focus on areas where I need more help. Being able to study the materials independently helps me absorb the information better.\\"</i></li>\\n  <li><b>Study Preference (Alone):</b> Explain why you prefer studying alone. Is it because you concentrate better? Or do you like to set your own schedule? For example: <i>\\"I prefer to study alone because I can concentrate better without distractions. It also allows me to set my own schedule and focus on the areas where I need the most work.\\"</i></li>\\n  <li><b>Extracurricular Activity (Sports):</b> Be specific! Which sports interest you? Why? What skills do you hope to gain from participating? For example: <i>\\"I'm most interested in basketball and volleyball. I enjoy the teamwork and physical activity involved. I hope to improve my coordination and learn better teamwork skills.\\"</i></li>\\n  <li><b>Motivation for Extracurriculars:</b> You mentioned enhancing skills. Be specific! Which skills? What else motivates you? Is it about making friends, staying active, or learning new things? For example: <i>\\"I participate in extracurricular activities to enhance my leadership and teamwork skills. I also enjoy meeting new people and trying new things. It's a great way to stay active and learn outside of the classroom.\\"</i></li>\\n  <li><b>Family Expectations:</b> Instead of just saying \\"reasonable expectations, focus on effort,\\" give a specific example of what that means to you and your family. For example: <i>\\"My family expects me to put in my best effort and strive for improvement, even if I don't always get perfect grades. They value hard work and dedication above all else.\\"</i></li>\\n</ul>\\n<p>Remember to speak clearly and confidently in your interview, and provide detailed answers. Good luck!</p>"
}
\`\`\`
`,
        },
      ],
    },
  ],
});
