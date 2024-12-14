import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Stablecoin Quiz";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-purple-900 text-white p-8">
        <h1 tw="text-4xl font-bold text-center mb-6">Stablecoin Personality Quiz</h1>
        <p tw="text-2xl text-center">Find out which stablecoin matches your personality!</p>
      </div>
    ),
    {
      ...size,
    }
  );
}
