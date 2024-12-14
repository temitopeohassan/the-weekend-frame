import { ImageResponse } from "next/og";

export const alt = "The Weekend Quiz";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-purple-900 text-white">
        <h1 tw="text-6xl font-bold">The Weekend Frame</h1>
        <p tw="text-2xl mt-4">What Stablecoin Are You?</p>
      </div>
    ),
    {
      ...size,
    }
  );
}
