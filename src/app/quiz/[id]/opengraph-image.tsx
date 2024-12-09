import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quiz Question";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const questions = [
    "What's your approach to competition?",
    "Pick your ideal racing conditions:",
    "What's your team philosophy?",
    "Choose your team color:",
    "What's most important to you?"
  ];

  const questionIndex = parseInt(params.id) - 1;
  const questionText = questions[questionIndex] || "Loading...";

  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-purple-900 text-white p-8">
        <h1 tw="text-4xl font-bold text-center mb-6">F1 Team Quiz</h1>
        <p tw="text-2xl text-center">{questionText}</p>
      </div>
    ),
    {
      ...size,
    }
  );
} 