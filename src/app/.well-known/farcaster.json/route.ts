import { type FarcasterManifest } from '../../../types/farcaster';
import { generateAccountAssociation } from '../../../utils/farcaster';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || "https://the-weekend-frame-seven.vercel.app";
  const FARCASTER_PRIVATE_KEY = process.env.FARCASTER_PRIVATE_KEY;

  if (!FARCASTER_PRIVATE_KEY) {
    throw new Error('FARCASTER_PRIVATE_KEY environment variable is required');
  }

  const domain = new URL(appUrl).hostname;
  const accountAssociation = await generateAccountAssociation(domain, FARCASTER_PRIVATE_KEY);

  const config: FarcasterManifest = {
    accountAssociation,
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
    },
    triggers: [
      // Add triggers if needed
    ]
  };

  return Response.json(config, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
