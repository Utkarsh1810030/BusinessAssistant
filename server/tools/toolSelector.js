const openai = require('../utils/openaiClient');

const getPrompt = (tool, onboarding) => {
  switch (tool.toLowerCase()) {
    case 'project management':
      return `Based on this data:\n${JSON.stringify(onboarding)}\nExplain how project management tools can benefit the user.`;
    case 'crm':
      return `Based on this:\n${JSON.stringify(onboarding)}\nHow can CRM software help this business grow?`;
    case 'email marketing':
      return `Based on:\n${JSON.stringify(onboarding)}\nWhat are the best email marketing automation tools for this business?`;
    default:
      return `Using this data:\n${JSON.stringify(onboarding)}\nGive suggestions for: ${tool}`;
  }
};

const toolSelector = async (label, onboarding) => {
  let tool = '';
  if (label.toLowerCase().includes('project')) tool = 'project management';
  else if (label.toLowerCase().includes('crm')) tool = 'crm';
  else if (label.toLowerCase().includes('email')) tool = 'email marketing';
  else tool = label;

  const prompt = getPrompt(tool, onboarding);

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
};

module.exports = toolSelector;
