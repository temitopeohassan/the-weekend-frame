import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "F1 Team Quiz Question";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

interface Props {
  params: {
    id: string;
  };
}

const QUESTIONS = [
  {
    id: "1",
    text: "What's your approach to competition?",
  },
  {
    id: "2",
    text: "Pick your ideal racing conditions:",
  },
  {
    id: "3",
    text: "What's your team philosophy?",
  },
  {
    id: "4",
    text: "Choose your team color:",
  },
  {
    id: "5",
    text: "What's most important to you?",
  },
];

export default async function Image({ params }: Props) {
  const { id } = params;
  const question = QUESTIONS.find(q => q.id === id)?.text || "Question not found";

  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-purple-900 text-white p-10">
        <h1 tw="text-4xl font-bold text-center mb-4">Which F1 Team Are You?</h1>
        <h2 tw="text-3xl font-bold text-center">Question {id}/5</h2>
        <p tw="text-2xl mt-8 text-center">{question}</p>
      </div>
    ),
    {
      ...size,
    }
  );
} 