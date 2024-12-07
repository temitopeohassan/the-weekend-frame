import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Quiz Question";
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

export default async function Image({ params }: Props) {
  const { id } = params;
  
  // In a real app, fetch question from database
  const question = "What is the capital of France?";

  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-purple-900 text-white p-10">
        <h1 tw="text-4xl font-bold text-center">Question {id}</h1>
        <p tw="text-2xl mt-8 text-center">{question}</p>
      </div>
    ),
    {
      ...size,
    }
  );
} 