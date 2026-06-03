export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers } = req.body;

  if (!answers || answers.length !== 6) {
    return res.status(400).json({ error: 'Six answers are required.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured.' });
  }

  const systemPrompt = `You are a warm but direct life coach. Someone has just sat down to work on a recurring responsibility and needs to orient themselves fast. They have answered six questions. Your job is to turn those answers into a structured "pick up here" brief — specific to their situation, not generic advice.

Return exactly five sections with these headings:

Current state — Where things actually stand right now, in one or two sentences. Do not echo their words back. Synthesise.

What needs attention first — The one thing they should do in the next 30 minutes. Concrete and actionable.

Constraints in play — What is limiting them this session. Name it plainly.

Open question — The unresolved thing they named. Reframe it if you can make it sharper.

How to start right now — One sentence. The very first physical action they can take.

Use simple, everyday language. Avoid jargon or technical words. Anyone should be able to read this and immediately understand it. Be direct. No filler. No commentary about their answers. Write like a warm but direct life coach who sees the full picture and helps the person take one clear step forward.

Format your response exactly like this — use these exact headings, nothing else:
Current state:
[content]

What needs attention first:
[content]

Constraints in play:
[content]

Open question:
[content]

How to start right now:
[content]`;

  const userMessage = `Responsibility: ${answers[0]}
How often they return to it: ${answers[1]}
Last thing done or decided: ${answers[2]}
What is getting in the way: ${answers[3]}
What is unresolved: ${answers[4]}
What done looks like today: ${answers[5]}`;

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
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Claude API error.'
      });
    }

    const text = data.content[0].text;
    return res.status(200).json({ brief: text });

  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
