const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Ensure this is set in your environment variables
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export async function getGeminiResponse(
  prompt: string,
  data: any
): Promise<string> {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${prompt} Here is the data: ${JSON.stringify(data)}` },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch Gemini API response: ${errorData.error.message}`
      );
    }

    const responseData = await response.json();
    return responseData.candidates[0].content.parts[0].text; // Adjust this according to the actual response structure
  } catch (error) {
    console.error("Error fetching Gemini API response:", error);
    throw error;
  }
}
