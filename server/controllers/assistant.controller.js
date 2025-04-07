// controllers/assistant.controller.js
const openai = require('../utils/openaiClient');
const User = require('../models/User')

exports.generateActions = async (req, res) => {
  const onboarding = req.body.onboarding;
  const chatHistory = req.body.chatHostory || '';

  try {
    const prompt = `You are a business AI. Given the following onboarding data:\n${JSON.stringify(onboarding)}\n and user's chat history\n${JSON.stringify(chatHistory)}\n:Return 3 helpful action suggestions without numbering (JSON format): [{ label }]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;
    const actions = JSON.parse(text);

    res.json({ actions });
  } catch (err) {
    console.error('LLM error:', err.message);
    res.status(500).json({ message: 'Failed to generate actions' });
  }
};

exports.generateStrategy = async (req, res) => {
  const onboarding = req.body.onboarding;

  try {
    const prompt = `Suggest a personalized business content strategy based on this onboarding data:\n${JSON.stringify(onboarding)}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    res.json({ result: completion.choices[0].message.content });
  } catch (err) {
    console.error('Strategy error:', err.message);
    res.status(500).json({ message: 'Failed to generate strategy.' });
  }
}

exports.generateInsights = async (req, res) => {
  try {
    const { messages, onboarding, forceRefresh = false } = req.body;
    console.log(messages)
    const userId = req.user?._id;
    if (!messages || !onboarding || !userId) {
      return res.status(400).json({ error: 'Missing messages, onboarding data, or user' });
    }

    // Check if insights already exist
    const existing = await User.findById(userId).select('insights');
    if (!forceRefresh && existing?.insights?.summary) {
      return res.json(existing.insights);
    }


    const context = [
      "You're a business coach AI helping small businesses grow based on their input.",
      `Business Info: ${JSON.stringify(onboarding)}`,
      `Chat History: ${messages.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n')}`,
      "Now give an actionable summary, checklist, roadmap and estimated monthly revenue for the next 5 years.",
      "Format the revenue section like this: \n- Quarter: [Month 3, $3500]\n- 6 Months: [Month 6, $4000]\n- 1 Year: [Month 12, $5000]\n- 5 Years: [Month 60, $10000]"
    ].join('\n\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: context }],
      temperature: 0.7
    });

    const output = completion.choices[0]?.message?.content || '';
    const parsed = parseInsights(output, onboarding);

    // 💾 Save to user document
    await User.findByIdAndUpdate(userId, {
      $set: {
        chatHistory: messages,
        insights: parsed,
        updatedAt: new Date()
      }},
      { new: true, runValidators: true }
    );

    res.json(parsed);
  } catch (err) {
    console.error('generateInsights error:', err);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};

exports.saveChatHistoryManually =  async (req, res) => {
  const userId = req.user?._id;
  const { messages } = req.body;

  if (!userId || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing user or invalid messages' });
  }

  try {
    await User.findByIdAndUpdate(userId, {
      chatHistory: messages,
      updatedAt: new Date()
    });
    res.json({ success: true });
  } catch (err) {
    console.error('💥 Failed to save chat history:', err.message);
    res.status(500).json({ error: 'Failed to save chat history' });
  }
} 

function parseInsights(text, onboarding) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const summaryLines = [], checklist = [], roadmap = [], revenueData = {
    quarter: [],
    '6months': [],
    '1year': [],
    '5years': []
  };
  let mode = 'summary';
  let initialRevenue = !isNaN(Number(onboarding.revenue)) ? Number(onboarding.revenue): 0;

  for (let line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('checklist')) mode = 'checklist';
    else if (lower.includes('roadmap')) mode = 'roadmap';
    else if (lower.includes('revenue')) mode = 'revenue';
    else if (mode === 'revenue') {
      const match = line.match(/-\s*(quarter|6\s*months|1\s*year|5\s*years):\s*\[([^\]]+)\]/i);
      if (match) {
        const tf = match[1].toLowerCase().replace(/\s/g, '');
        const [monthRaw, valueRaw] = match[2].split(',').map(s => s.trim());
        const monthNum = Number(monthRaw.replace(/[^\d]/g, ''));
        const value = Number(valueRaw.replace(/[^\d]/g, ''));
        if (!monthNum || !value) continue;

        const key = tf;
        const timeline = [];

        // Always add month 0
        timeline.push({ month: 'Month 0', amount: initialRevenue });
        timeline.push({ month: `Month ${monthNum}`, amount: value });

        revenueData[key] = timeline;
      }
    } else {
      if (mode === 'summary') summaryLines.push(line);
      else if (mode === 'checklist') checklist.push(line.replace(/^[-*\d.\)]\s*/, ''));
      else if (mode === 'roadmap') roadmap.push(line.replace(/^[-*\d.\)]\s*/, ''));
    }
  }

  return {
    summary: summaryLines.join(' '),
    checklist,
    roadmap,
    revenue: revenueData
  };
}

exports.websiteAudit = async (req, res) => {
  const { website, onboarding } = req.body;

  const prompt = `
You are a website audit expert. Respond ONLY in JSON. No explanations. No apologies.

Given the website URL: ${website}
And the business onboarding context: ${JSON.stringify(onboarding, null, 2)}

Simulate analyzing the website and return a structured audit report with:

{
  "purpose": "Summary of website’s purpose",
  "design": "Design & UX evaluation",
  "seo": "SEO and content analysis",
  "conversion": "Conversion flow analysis",
  "suggestions": [
    "Improve call-to-action buttons",
    "Add meta descriptions for all pages",
    ...
  ]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a business website audit expert." },
        { role: "user", content: prompt }
      ],
    });

    const result = JSON.parse(response.choices[0].message.content);
    req.user.websiteReport = result;
    await req.user.save();
    res.json(result);
  } catch (err) {
    console.error("Website audit failed:", err.message);
    res.status(500).json({ error: "Audit failed", details: err.message });
  }
};