// rag.routes.js — Upload + Embed Route for RAG
const express = require("express");
const router = express.Router();
const ensureAuth = require("../middlewares/authMiddleware");
const {
  upsertDocuments,
  queryRelevantDocs,
} = require("../services/rag.services");
const openai = require("../utils/openaiClient");

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
    console.log("📥 Document inserted:", JSON.stringify(points[0], null, 2));
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

module.exports = router;
