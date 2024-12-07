import { NextRequest } from "next/server";

const appUrl = process.env.NEXT_PUBLIC_URL;

console.log("API Route - App URL:", appUrl);

interface Question {
  id: number;
  text: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What's your approach to competition?",
    options: [
      "Calculated and Strategic",
      "Aggressive and Bold",
      "Traditional and Methodical",
      "Innovative and Dynamic"
    ]
  },
  {
    id: 2,
    text: "Pick your ideal racing conditions:",
    options: [
      "High-pressure situations",
      "Wet and challenging",
      "Technical circuits",
      "High-speed tracks"
    ]
  },
  {
    id: 3,
    text: "What's your team philosophy?",
    options: [
      "Excellence through precision",
      "Push the boundaries",
      "Honor the legacy",
      "Embrace the future"
    ]
  },
  {
    id: 4,
    text: "Choose your team color:",
    options: [
      "Silver",
      "Red",
      "Dark Blue",
      "Orange"
    ]
  },
  {
    id: 5,
    text: "What's most important to you?",
    options: [
      "Engineering perfection",
      "Passion and emotion",
      "Team history",
      "Innovation"
    ]
  }
];

const TEAMS = {
  MERCEDES: "Mercedes-AMG Petronas",
  FERRARI: "Scuderia Ferrari",
  RED_BULL: "Red Bull Racing",
  MCLAREN: "McLaren F1 Team"
};

function calculateTeam(answers: number[]): string {
  // Simple scoring system
  const scores = {
    [TEAMS.MERCEDES]: 0,
    [TEAMS.FERRARI]: 0,
    [TEAMS.RED_BULL]: 0,
    [TEAMS.MCLAREN]: 0
  };

  // Map answers to team scores
  answers.forEach((answer) => {
    switch (answer) {
      case 1: scores[TEAMS.MERCEDES]++; break;
      case 2: scores[TEAMS.FERRARI]++; break;
      case 3: scores[TEAMS.RED_BULL]++; break;
      case 4: scores[TEAMS.MCLAREN]++; break;
    }
  });

  // Find team with highest score
  return Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];
}

let currentAnswers: number[] = [];

export async function POST(req: NextRequest) {
  try {
    console.log("Received POST request");
    console.log("Current answers before processing:", currentAnswers);
    const data = await req.json();
    console.log("Request data:", data);

    const { untrustedData } = data;
    const { buttonIndex } = untrustedData;
    console.log("Button index:", buttonIndex);

    // If it's a "Start Over" action, reset the answers
    if (currentAnswers.length >= QUESTIONS.length) {
      console.log("Quiz completed, resetting answers");
      currentAnswers = [];
      // Show first question
      const firstQuestion = QUESTIONS[0];
      console.log("Showing first question after reset:", firstQuestion);
      const frameHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${firstQuestion.text}</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${appUrl}/quiz/${firstQuestion.id}/opengraph-image" />
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

    // Record the answer
    currentAnswers.push(buttonIndex);
    console.log("Current answers after recording:", currentAnswers);
    
    // Get the next question (or show result if quiz is complete)
    const currentQuestionIndex = currentAnswers.length - 1;
    const nextQuestionIndex = currentAnswers.length;
    console.log("Current question index:", currentQuestionIndex);
    console.log("Next question index:", nextQuestionIndex);

    if (nextQuestionIndex >= QUESTIONS.length) {
      console.log("Quiz complete, calculating result");
      const team = calculateTeam(currentAnswers);
      console.log("Calculated team:", team);
      const shareText = `I got ${team} in the F1 Team Personality Quiz! Which team are you? 🏎️`;
      const frameHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Your F1 Team Result</title>
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

    // Show next question
    const nextQuestion = QUESTIONS[nextQuestionIndex];
    console.log("Showing next question:", nextQuestion);
    const frameHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${nextQuestion.text}</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${appUrl}/quiz/${nextQuestion.id}/opengraph-image" />
          <meta property="og:image" content="${appUrl}/quiz/${nextQuestion.id}/opengraph-image" />
          ${nextQuestion.options.map((option, index) => 
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