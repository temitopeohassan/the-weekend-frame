"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  FrameNotificationDetails,
  type FrameContext,
} from "@farcaster/frame-sdk";

const appUrl = process.env.NEXT_PUBLIC_URL || "https://the-weekend-frame-seven.vercel.app";

export default function Quiz(
  { title }: { title?: string } = { title: "Stablecoin Personality Quiz" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [notificationDetails, setNotificationDetails] =
    useState<FrameNotificationDetails | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    setNotificationDetails(context?.client.notificationDetails ?? null);
  }, [context]);

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
    setQuizStarted(true);
    sdk.actions.openUrl(`${appUrl}/api/quiz`);
  }, []);

  const shareResult = useCallback(() => {
    sdk.actions.openUrl("https://warpcast.com/~/compose");
  }, []);

  const toggleContext = useCallback(() => {
    setIsContextOpen((prev) => !prev);
  }, []);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>

      {!quizStarted ? (
        <div className="mb-8">
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
            Find out which stablecoin matches your personality!
          </p>
          <button
            onClick={startQuiz}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="mb-8">
          <button
            onClick={shareResult}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Share Result
          </button>
        </div>
      )}

      <div className="mb-4">
        <h2 className="font-2xl font-bold mb-2">Debug Info</h2>
        <button
          onClick={toggleContext}
          className="flex items-center gap-2 transition-colors"
        >
          <span
            className={`transform transition-transform ${
              isContextOpen ? "rotate-90" : ""
            }`}
          >
            ➤
          </span>
          Show Frame Context
        </button>

        {isContextOpen && (
          <div className="p-4 mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              {JSON.stringify(context, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          {context?.client.clientFid ? (
            <p>Connected as FID: {context.client.clientFid}</p>
          ) : (
            <p>Not connected to Farcaster</p>
          )}
          {notificationDetails && <p>Notifications enabled</p>}
        </div>
      </div>
    </div>
  );
}
