import { NextRequest } from "next/server";

const appUrl = process.env.NEXT_PUBLIC_URL || "https://the-weekend-frame-seven.vercel.app";

console.log("API Route - App URL:", appUrl);

interface Question {
  id: number;
  text: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What's your approach to financial stability?",
    options: [
      "Traditional and Regulated",
      "Algorithmic and Dynamic",
      "Asset-Backed and Secure",
      "Community-Driven"
    ]
  },
  {
    id: 2,
    text: "Pick your ideal backing asset:",
    options: [
      "US Dollar",
      "Crypto Assets",
      "Multiple Currencies",
      "Gold and Commodities"
    ]
  },
  {
    id: 3,
    text: "What's most important to you?",
    options: [
      "Regulatory Compliance",
      "Innovation",
      "Transparency",
      "Decentralization"
    ]
  },
  {
    id: 4,
    text: "Choose your preferred blockchain:",
    options: [
      "Ethereum",
      "Multiple Chains",
      "Layer 2 Solutions",
      "Alternative L1s"
    ]
  },
  {
    id: 5,
    text: "What's your risk tolerance?",
    options: [
      "Very Low",
      "Moderate",
      "Low",
      "Balanced"
    ]
  }
];

const STABLECOINS = {
  USDC: "USD Coin (USDC)",
  DAI: "DAI Stablecoin",
  USDT: "Tether (USDT)",
  FRAX: "Frax"
};

function calculateStablecoin(answers: number[]): string {
  const scores = {
    [STABLECOINS.USDC]: 0,
    [STABLECOINS.DAI]: 0,
    [STABLECOINS.USDT]: 0,
    [STABLECOINS.FRAX]: 0
  };

  answers.forEach((answer) => {
    switch (answer) {
      case 1: scores[STABLECOINS.USDC]++; break;
      case 2: scores[STABLECOINS.DAI]++; break;
      case 3: scores[STABLECOINS.USDT]++; break;
      case 4: scores[STABLECOINS.FRAX]++; break;
    }
  });

  return Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];
}

let currentAnswers: number[] = [];

export async function POST(req: NextRequest) {
  try {
    console.log("Received POST request");
    const data = await req.json();
    const { untrustedData } = data;
    const { buttonIndex } = untrustedData;
    console.log("Button index:", buttonIndex);

    // Record the answer
    currentAnswers.push(buttonIndex);
    console.log("Current answers after recording:", currentAnswers);
    
    // Get the next question (or show result if quiz is complete)
    const nextQuestionIndex = currentAnswers.length - 1;
    console.log("Next question index:", nextQuestionIndex);

    if (nextQuestionIndex >= QUESTIONS.length) {
      console.log("Quiz complete, calculating result");
      const team = calculateStablecoin(currentAnswers);
      console.log("Calculated team:", team);
      const shareText = `I got ${team} in the Stablecoin Personality Quiz! Which team are you? 🏎️`;
      const frameHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Your Stablecoin Result</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${appUrl}/quiz/result/${team}/opengraph-image" />
            <meta property="og:image" content="${appUrl}/quiz/result/${team}/opengraph-image" />
            <meta property="fc:frame:button:1" content="Start Over" />
            <meta property="fc:frame:button:2" content="Share Result" />
            <meta property="fc:frame:post_url" content="${appUrl}/api/quiz" />
            <meta property="fc:frame:button:2:action" content="post" />
            <meta property="fc:frame:button:2:target" content="https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}" />
          </head>
        </html>
      `;

      // Reset for next quiz only if "Start Over" is clicked
      if (buttonIndex === 1) {
        currentAnswers = [];
      }
      
      return new Response(frameHtml, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Show current question
    const currentQuestion = QUESTIONS[nextQuestionIndex];
    console.log("Showing question:", currentQuestion);
    const frameHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${currentQuestion.text}</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${appUrl}/quiz/${currentQuestion.id}/opengraph-image" />
          <meta property="og:image" content="${appUrl}/quiz/${currentQuestion.id}/opengraph-image" />
          ${currentQuestion.options.map((option, index) => 
            `<meta property="fc:frame:button:${index + 1}" content="${option}" />`
          ).join('\n')}
          <meta property="fc:frame:post_url" content="${appUrl}/api/quiz" />
        </head>
      </html>
    `;

    return new Response(frameHtml, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET() {
  console.log("Received GET request");
  console.log("Current answers at GET start:", currentAnswers);
  
  currentAnswers = [];
  console.log("Reset answers in GET:", currentAnswers);
  
  const firstQuestion = QUESTIONS[0];
  console.log("Showing first question in GET:", firstQuestion);
  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${firstQuestion.text}</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${appUrl}/quiz/${firstQuestion.id}/opengraph-image" />
        <meta property="og:image" content="${appUrl}/quiz/${firstQuestion.id}/opengraph-image" />
        ${firstQuestion.options.map((option, index) => 
          `<meta property="fc:frame:button:${index + 1}" content="${option}" />`
        ).join('\n')}
        <meta property="fc:frame:post_url" content="${appUrl}/api/quiz" />
      </head>
    </html>
  `;

  return new Response(frameHtml, {
    headers: { "Content-Type": "text/html" },
  });
} 