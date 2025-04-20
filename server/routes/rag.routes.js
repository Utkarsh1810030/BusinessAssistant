// rag.routes.js — Upload + Embed Route for RAG
const express = require("express");
const router = express.Router();
const ensureAuth = require("../middlewares/authMiddleware");
const {
  upsertDocuments,
  queryRelevantDocs,
} = require("../services/rag.services");
const openai = require("../utils/openaiClient");
const User = require("../models/User");

// POST /api/rag/upload
// Body: { items: [{ text: string, type?: string, source?: string }] }
router.post("/upload", ensureAuth, async (req, res) => {
  const userId = req.user?._id;
  const { items } = req.body;
  const businessName = req.user?.onboarding.name || "one.com";

  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Missing or invalid input." });
  }

  try {
    const result = await upsertDocuments({ userId, items, businessName });
    if (result.success) {
      res.json({ message: "Documents uploaded and embedded successfully." });
    } else {
      res.status(500).json({ message: "Failed to embed documents." });
    }
  } catch (err) {
    console.error("❌ /rag/upload error:", err.message);
    res.status(500).json({ message: "Server error during RAG upload." });
  }
});

// POST /api/rag/query
// Body: { query: "text" }
router.post("/query", ensureAuth, async (req, res) => {
  const userId = req.user?._id;
  const { query } = req.body;

  console.log("@@@", query);

  if (!userId || !query) {
    return res.status(400).json({ message: "Missing user or query input." });
  }

  try {
    const result = await queryRelevantDocs({ userId, query: "anything" });
    res.json(result);
  } catch (err) {
    console.error("❌ /api/rag/query failed:", err.message);
    res.status(500).json({ message: "Failed to fetch business memory." });
  }
});

// POST /api/rag/summary
router.post("/summary", ensureAuth, async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(400).json({ message: "Missing user." });
  }

  try {
    const ragResults = await queryRelevantDocs({
      userId,
      query: "What content can we use to describe the business?",
    });

    const systemPrompt = `You are a website content assistant helping create a landing page for a business.
  Use the following memory data to generate structured content sections:
  
  Business Memory:
  ${ragResults.join("\n")}
  
  Return JSON with:
  - "features": array of 3-6 feature highlights (strings)
  - "testimonials": array of 2 short customer quotes
  - "impact": 1 sentence business win (case study or value stat)
  - "banner": 1-line promotional header for top of page
  
  Respond in JSON format only.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful content formatting assistant.",
        },
        { role: "user", content: systemPrompt },
      ],
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Invalid JSON returned from OpenAI", raw: result });
    }

    res.json(parsed);
  } catch (err) {
    console.error("❌ /rag/summary failed:", err);
    res.status(500).json({ message: "RAG summary generation failed" });
  }
});

router.post("/onecom-roadmap", async (req, res) => {
  const { onboarding } = req.body;
  const userId = req.user?._id;

  if (!userId || !onboarding) {
    return res.status(400).json({ error: "Missing user or onboarding data." });
  }

  const getSuggestedTld = (industry = "") => {
    industry = industry.toLowerCase();
    if (industry.includes("tech")) return ".io";
    if (industry.includes("shop") || industry.includes("retail"))
      return ".shop";
    if (industry.includes("health")) return ".clinic";
    if (industry.includes("edu") || industry.includes("learn"))
      return ".academy";
    return ".com";
  };

  try {
    const memoryMatches = await queryRelevantDocs({
      userId,
      query: `Which One.com offerings can help this business? Here is the context: ${JSON.stringify(
        onboarding
      )}`,
    });

    const tld = getSuggestedTld(onboarding.industry);
    const domainName = `${onboarding.name
      .toLowerCase()
      .replace(/\s+/g, "")}${tld}`;

    const prompt = `You are an onboarding coach for One.com.
Analyze this business:
${JSON.stringify(onboarding)}

Here are relevant One.com features:
${memoryMatches.join("\n")}

Strictly return a JSON object like this from relevant One.com features:
{
  "tagline": "Short benefit headline",
  "featureAlignment": ["Feature: How it helps", "..."],
  "pricingPlans": [
  { "plan": "Beginner", "price": "$0.99/mo", "benefits": ["..."] },
  { "plan": "Enthusiast", "price": "$2.99/mo", "benefits": ["..."] },
  { "plan": "Guru", "price": "$9.99/mo", "benefits": ["..."] }
],
  "trustScore": "3.9/5 from 21,000+ users",
  "testimonials": ["Real customer quotes"],
  "domainSuggestion": "${domainName}",
  "totalCostEstimate": "$0.99/month (domain free with hosting)"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "user", content: prompt },
        {
          role: "system",
          content:
            "You are a JSON-only assistant. Always respond with valid JSON and nothing else.",
        },
      ],
      temperature: 0.7,
    });

    const result = JSON.parse(completion.choices[0].message.content);
    await User.findByIdAndUpdate(userId, {
      $set: {
        roadmap: result,
      },
    });
    res.json(result);
  } catch (err) {
    console.error("❌ onecom-roadmap error:", err.message);
    res.status(500).json({ error: "Failed to generate roadmap." });
  }
});

module.exports = router;
