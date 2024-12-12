"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";

const appUrl = process.env.NEXT_PUBLIC_URL || "https://the-weekend-frame-seven.vercel.app";

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const startQuiz = useCallback(() => {
    sdk.actions.openUrl(`${appUrl}/api/quiz`);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
        Stablecoin Personality Quiz
      </h1>
      
      {context?.client?.isInFrame ? (
        <button
          onClick={startQuiz}
          className="mt-8 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Start Quiz
        </button>
      ) : (
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          View this page in Warpcast to start the quiz!
        </p>
      )}

      {isSDKLoaded && context && (
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Connected as FID: {context.user?.fid || 'Not connected'}
        </div>
      )}
    </div>
  );
}
