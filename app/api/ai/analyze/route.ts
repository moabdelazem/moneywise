import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { RateLimiter } from "@/lib/rateLimiter";
import { AnalysisCache } from "@/lib/cache";
import { generateFinancialAnalysis } from "@/lib/ai/analysis";
import { AnalysisRequest } from "@/lib/types";

// Initialize rate limiter: 10 requests per minute per user
const rateLimiter = new RateLimiter(10, 60);
const cache = new AnalysisCache();

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { userId } = await verifyToken(token);

    // Check rate limit
    if (!rateLimiter.tryAcquire(userId)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Parse request body
    const analysisRequest: AnalysisRequest = await request.json();
    const { prompt, data } = analysisRequest;

    // Check cache for similar analysis
    const cachedResponse = await cache.get(userId, prompt, data);
    if (cachedResponse) {
      return NextResponse.json({ analysis: cachedResponse });
    }

    // Generate new analysis
    const analysis = await generateFinancialAnalysis(prompt, data);

    // Cache the response
    await cache.set(userId, prompt, data, analysis);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error in AI analysis:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
