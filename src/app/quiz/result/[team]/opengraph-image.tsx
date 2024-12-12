import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quiz Result";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

const STABLECOIN_COLORS = {
  "USD Coin (USDC)": "#2775CA",
  "DAI Stablecoin": "#F5AC37",
  "Tether (USDT)": "#26A17B",
  "Frax": "#000000",
};

export default async function Image({ params }: { params: { team: string } }) {
  const teamName = decodeURIComponent(params.team);
  const bgColor = STABLECOIN_COLORS[teamName as keyof typeof STABLECOIN_COLORS] || "#581C87";

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
          Your Stablecoin Match:
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