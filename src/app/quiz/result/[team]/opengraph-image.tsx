import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quiz Result";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

const TEAM_COLORS = {
  "Mercedes-AMG Petronas": "#00D2BE",
  "Scuderia Ferrari": "#DC0000",
  "Red Bull Racing": "#0600EF",
  "McLaren F1 Team": "#FF8700",
};

export default async function Image({ params }: { params: { team: string } }) {
  const teamName = decodeURIComponent(params.team);
  const bgColor = TEAM_COLORS[teamName as keyof typeof TEAM_COLORS] || "#581C87";

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bgColor,
        }}
      >
        <h1 style={{ color: 'white', fontSize: '48px', marginBottom: '16px' }}>
          Your F1 Team Match:
        </h1>
        <p style={{ color: 'white', fontSize: '36px' }}>
          {teamName}
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
} 