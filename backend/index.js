import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY not set. Exiting.");
  process.exit(1);
}

const client = new GoogleGenerativeAI({
  apiKey,
});

// Compose prompt for Gemini (update as required to suit your needs)
function composePrompt(company, fromDate, toDate) {
  return `You are a data analyst. Provide a detailed analytics summary for the company named "${company}". Analyze sales, revenue, and user base.

Date range: from ${fromDate || "the beginning"} to ${toDate || "now"}.

Please output JSON in this format ONLY:

{
  "sales": [{ "date": "YYYY-MM-DD", "value": number }, ...],
  "revenue": number,
  "users": number,
  "summary": "Brief textual summary"
}`;
}

function parseGeminiResponse(text) {
  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("Invalid JSON in response");
    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to parse Gemini response JSON:", err);
    return null;
  }
}

app.get("/api/analytics", async (req, res) => {
  const { company, from, to } = req.query;

  if (!company) {
    return res.status(400).json({ error: "Missing required 'company' query parameter." });
  }

  const prompt = composePrompt(company, from, to);

  try {
    const model = client.getModel("models/text-bison-001");
    const response = await model.generateText({
      prompt: { text: prompt },
      temperature: 0.3,
      maxOutputTokens: 800,
    });

    const outputText = response?.candidates?.[0]?.content || response?.text || "";

    const analyticsData = parseGeminiResponse(outputText);

    if (!analyticsData) {
      return res.status(500).json({
        error: "Failed to parse analytics data from Gemini response.",
        rawResponse: outputText,
      });
    }

    res.json(analyticsData);
  } catch (err) {
    console.error("Error fetching Gemini analytics:", err);
    res.status(500).json({ error: "Failed to fetch data from Gemini API." });
  }
});

app.get("/", (req, res) => res.send("Backend works"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
