import { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_URL || "https://the-weekend-frame-seven.vercel.app";

console.log("App URL:", appUrl);

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    metadataBase: new URL(appUrl),
    title: "Stablecoin Personality Quiz",
    description: "Which Stablecoin Are You?",
    openGraph: {
      title: "Stablecoin Personality Quiz",
      description: "Which Stablecoin Are You?",
      images: [{
        url: `/opengraph-image`,
        width: 600,
        height: 400,
      }],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": `/opengraph-image`,
      "fc:frame:button:1": "Start Quiz",
      "fc:frame:post_url": `/api/quiz`,
    },
  };

  return metadata;
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Stablecoin Personality Quiz</h1>
      <p className="mt-4 text-xl">View this page in Warpcast to start the quiz!</p>
    </div>
  );
}
