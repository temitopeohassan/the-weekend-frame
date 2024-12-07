import { NextRequest } from "next/server";

const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

console.log("API Route - App URL:", appUrl);

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
];

export async function POST(req: NextRequest) {
  try {
    console.log("Received POST request");
    const data = await req.json();
    console.log("Request data:", data);

    const { untrustedData } = data;
    const { buttonIndex } = untrustedData;
    console.log("Button index:", buttonIndex);

    const currentQuestion = 0;
    const question = questions[currentQuestion];

    // Create HTML content for the frame
    const frameHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${question.text}</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${appUrl}/quiz/${question.id}/opengraph-image" />
          ${question.options.map((option, index) => 
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