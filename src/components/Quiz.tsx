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
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
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

  const questions = [
    {
      text: "What's your approach to financial stability?",
      options: [
        "Traditional and Regulated",
        "Algorithmic and Dynamic",
        "Asset-Backed and Secure",
        "Community-Driven"
      ]
    },
    {
      text: "Pick your ideal backing asset:",
      options: [
        "US Dollar",
        "Crypto Assets",
        "Multiple Currencies",
        "Gold and Commodities"
      ]
    },
    {
      text: "What's most important to you?",
      options: [
        "Regulatory Compliance",
        "Innovation",
        "Transparency",
        "Decentralization"
      ]
    },
    {
      text: "Choose your preferred blockchain:",
      options: [
        "Ethereum",
        "Multiple Chains",
        "Layer 2 Solutions",
        "Alternative L1s"
      ]
    },
    {
      text: "What's your risk tolerance?",
      options: [
        "Very Low",
        "Moderate",
        "Low",
        "Balanced"
      ]
    }
  ];

  const startQuiz = useCallback(async () => {
    try {
      setQuizStarted(true);
      setCurrentQuestion(0);
      setAnswers([]);
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
      const newAnswers = [...answers, answerIndex];
      setAnswers(newAnswers);
      
      const response = await fetch(`${appUrl}/api/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          untrustedData: {
            buttonIndex: answerIndex
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const html = await response.text();
      console.log('Response HTML:', html); // Debug log
      
      if (currentQuestion >= questions.length - 1) {
        // Updated regex to specifically match the fc:frame:image meta tag
        const resultPattern = /<meta property="fc:frame:image" content="[^"]*\/quiz\/result\/([^/"]+)\/opengraph-image"/;
        const teamMatch = html.match(resultPattern);
        const result = teamMatch ? decodeURIComponent(teamMatch[1]) : "Unknown Result";
        console.log('Match found:', !!teamMatch); // Debug log
        console.log('Extracted Result:', result); // Debug log
        setQuizResult(result);
        setQuizComplete(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  }, [answers, currentQuestion, questions.length]);

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
          <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion].text}</h2>
          <div className="space-y-2">
            {questions[currentQuestion].options.map((option, index) => (
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