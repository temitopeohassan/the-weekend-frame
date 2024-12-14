import { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_URL || "https://the-weekend-frame-seven.vercel.app";

const frame = {
  version: "next",
  imageUrl: `${appUrl}/opengraph-image`,
  button: {
    title: "Start Quiz",
    action: {
      type: "launch_frame",
      name: "Stablecoin Personality Quiz",
      url: `${appUrl}/api/quiz`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#581C87"
    }
  }
};

export async function generateMetadata(): Promise<Metadata> {
  return {
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
      "fc:frame": JSON.stringify(frame),
    },
  };
}