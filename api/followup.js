export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, brief, history } = req.body;

  if (!question || !brief) {
    return res.status(400).json({ error: 'Question and brief are required.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured.' });
  }

  const systemPrompt = `You are a warm but direct navigator. You have already given someone a "pick up here" brief to help them orient themselves on a recurring responsibility. They now have follow-up questions.

Here is the brief you gave them:
${brief}

Answer their follow-up questions in the same voice — warm, direct, simple language, no jargon. Be specific to their situation. Keep your answers focused and practical. No more than 3-4 sentences unless the question genuinely needs more. You remember everything you have said in this conversation.`;

  // Build full conversation history for Claude
  const messages = [];

  // Add previous Q&A pairs as alternating user/assistant turns
  if (history && history.length > 0) {
    history.forEach(turn => {
      messages.push({ role: 'user', content: turn.question });
      messages.push({ role: 'assistant', content: turn.answer });
    });
  }

  // Add the new question
  messages.push({ role: 'user', content: question });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 500,
        system: systemPrompt,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Claude API error.'
      });
    }

    const text = data.content[0].text;
    return res.status(200).json({ answer: text });

  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
