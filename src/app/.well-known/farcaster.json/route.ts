export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || "https://the-weekend-frame-seven.vercel.app";

  const config = {
    frame: {
      image: `${appUrl}/opengraph-image`,
      version: "vNext",
      buttons: [
        {
          label: "Start Quiz",
          action: "post"
        }
      ],
      post_url: `${appUrl}/api/quiz`
    }
  };

  return Response.json(config);
}
