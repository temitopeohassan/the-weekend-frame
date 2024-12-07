import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "F1 Team Quiz Result";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

interface Props {
  params: {
    team: string;
  };
}

const TEAM_DESCRIPTIONS = {
  "Mercedes-AMG Petronas": {
    color: "#00D2BE",
    description: "You're precise, calculated, and strive for engineering excellence. Like Mercedes, you believe in the power of innovation and technical perfection.",
  },
  "Scuderia Ferrari": {
    color: "#DC0000",
    description: "Passionate and bold, you embody the Ferrari spirit. You're driven by emotion and have a deep appreciation for tradition and legacy.",
  },
  "Red Bull Racing": {
    color: "#0600EF",
    description: "Dynamic and fearless, you share Red Bull's innovative approach. You're not afraid to push boundaries and challenge conventions.",
  },
  "McLaren F1 Team": {
    color: "#FF8700",
    description: "Forward-thinking and adaptable, you match McLaren's pioneering spirit. You embrace change and always look towards the future.",
  },
};

export default async function Image({ params }: Props) {
  const { team } = params;
  const teamInfo = TEAM_DESCRIPTIONS[team as keyof typeof TEAM_DESCRIPTIONS] || {
    color: "#purple-900",
    description: "Team not found",
  };

  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative p-10" style={{ backgroundColor: teamInfo.color }}>
        <h1 tw="text-4xl font-bold text-center text-white mb-4">You Are:</h1>
        <h2 tw="text-5xl font-bold text-center text-white mb-6">{team}</h2>
        <p tw="text-xl text-center text-white px-8">{teamInfo.description}</p>
      </div>
    ),
    {
      ...size,
    }
  );
} 