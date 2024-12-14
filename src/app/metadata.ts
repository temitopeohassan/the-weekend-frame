import { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_URL || "https://the-weekend-frame-seven.vercel.app";

const frame = {
  version: "vNext",
  image: `${appUrl}/opengraph-image`,
  buttons: [
    {
      label: "Start Quiz",
      action: "post"
    }
  ],
  post_url: `${appUrl}/api/quiz`
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