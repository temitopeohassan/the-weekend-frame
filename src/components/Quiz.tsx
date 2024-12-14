"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  FrameNotificationDetails,
  type FrameContext,
} from "@farcaster/frame-sdk";

const appUrl = process.env.NEXT_PUBLIC_URL || "https://the-weekend-frame-seven.vercel.app";

const QUESTIONS = [
  {
    id: "1",
    text: "What's your approach to financial stability?",
    options: [
      "Conservative and regulated",
      "Decentralized and algorithmic",
      "Traditional and backed",
      "Innovative and flexible"
    ]
  },
  // Add all your questions here
];

function calculateStablecoin(currentAnswers: number[]): string {
  const options = ["USD Coin (USDC)", "DAI Stablecoin", "Tether (USDT)", "Frax"];
  return options[Math.floor(Math.random() * options.length)];
}

export default function Quiz(
  { title }: { title?: string } = { title: "Stablecoin Personality Quiz" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState<FrameNotificationDetails | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [currentAnswers, setCurrentAnswers] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizResult, setQuizResult] = useState<string>("");

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

  const startQuiz = useCallback(async () => {
    try {
      setQuizStarted(true);
      setCurrentQuestion(0);
      setCurrentAnswers([]);
      setQuizComplete(false);
      setQuizResult("");
      
      const response = await fetch(`${appUrl}/api/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          untrustedData: {
            buttonIndex: 1
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to start quiz');
      }
      
      const html = await response.text();
      console.log('Quiz started:', html);
    } catch (error) {
      console.error('Error starting quiz:', error);
      setQuizStarted(false);
    }
  }, []);

  const handleAnswer = useCallback(async (answerIndex: number) => {
    try {
      const newAnswers = [...currentAnswers, answerIndex];
      setCurrentAnswers(newAnswers);
      
      if (currentQuestion >= QUESTIONS.length - 1) {
        const result = calculateStablecoin(newAnswers);
        setQuizResult(result);
        setQuizComplete(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }, [currentAnswers, currentQuestion]);

  const shareResult = useCallback(() => {
    const shareText = `I got ${quizResult} in the Stablecoin Personality Quiz! Which Stablecoin are you? 💰`;
    const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;
    sdk.actions.openUrl(shareUrl);
  }, [quizResult]);

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
      ) : !quizComplete ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{QUESTIONS[currentQuestion].text}</h2>
          <div className="space-y-2">
            {QUESTIONS[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index + 1)}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Result:</h2>
          <p className="text-center text-lg mb-4">{quizResult}</p>
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