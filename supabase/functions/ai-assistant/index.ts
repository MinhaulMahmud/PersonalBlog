import { GoogleGenerativeAI } from "npm:@google/generative-ai@^0.2.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface RequestBody {
  content: string;
  type: "summarize" | "seo";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    const { content, type }: RequestBody = await req.json();

    let prompt = "";
    if (type === "summarize") {
      prompt = `You are a Flash Summary AI model. Create an extremely concise yet informative summary of the following blog post in exactly 2 sentences. Focus on the key points and main takeaways. Make it engaging and clear.

      Blog content:
      ${content}`;
    } else if (type === "seo") {
      prompt = `You are an SEO optimization expert. Analyze the following content and provide SEO optimization suggestions in JSON format. Focus on creating engaging, click-worthy titles while maintaining accuracy. Include trending keywords where relevant.

      Required JSON format:
      {
        "suggestedTitle": "SEO-optimized title that is engaging and accurate",
        "metaDescription": "Compelling meta description under 160 characters that drives clicks",
        "keywords": ["5-7 relevant and trending keywords"]
      }
      
      Content to analyze:
      ${content}`;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return new Response(
      JSON.stringify({ result: text }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});