# WhereWasI

**Pick up where you left off — with a clear head.**

Live at: [she-vibes-builds.vercel.app](https://she-vibes-builds.vercel.app)

---

## What it does

WhereWasI is an AI-powered brief generator for recurring responsibilities.

You answer six plain-English questions about something you manage — a project, a relationship, a process, anything you come back to regularly. WhereWasI turns those answers into a structured "pick up here" brief that puts you back in context immediately.

No AI knowledge needed. The AI is entirely behind the form.

---

## The problem it solves

Every recurring responsibility has a re-entry cost. You step away — for a day, a week, a month — and when you come back, you spend the first stretch of time just remembering where you were. What was the last decision? What's blocking things? What were you about to do?

WhereWasI eliminates that cost. You answer six questions, get a brief, and start working.


---

## How it works

1. User fills six questions about their responsibility
2. Answers are sent to a serverless function
3. The function calls the Claude API with a structured system prompt
4. Claude returns a five-section brief specific to the user's situation
5. The user can ask follow-up questions — the navigator remembers the full session

---

## The brief format

Every brief has five sections:

- **Current state** — Where things actually stand right now
- **What needs attention first** — The single most important direction for this session
- **Constraints in play** — What's limiting them today, named plainly
- **Open question** — The unresolved thing, reframed if possible
- **How to start right now** — One sentence. The smallest possible first action.

---

## The six questions

1. What are you managing?
2. How often do you come back to it?
3. What was the last thing you did or decided?
4. What's getting in your way this time?
5. What's one thing you haven't figured out yet?
6. What would make this session feel worthwhile?

The form went from seven questions to six during build. One question was cut because it made users do the thinking the tool should do. The questions are the product.

---

## Tech stack

| Layer | Tool |
|-------|------|
| Frontend | HTML, CSS, vanilla JavaScript |
| Backend | Vercel serverless functions (Node.js) |
| AI | Claude API (claude-sonnet-4-5) |
| Logging | Airtable |
| Deployment | Vercel |
| Version control | GitHub |

---

## Project structure

```
where_was_i/
├── index.html          # Frontend — form, brief output, follow-up UI
├── api/
│   ├── generate.js     # Handles form submission → Claude API → Airtable
│   └── followup.js     # Handles follow-up questions with session history
└── .env                # Local environment variables (not committed)
```

---

## Environment variables

Two keys required:

```
ANTHROPIC_API_KEY=your_key_here
AIRTABLE_API_KEY=your_key_here
```

Set locally in `.env` for development. Set in Vercel Environment Variables for production. Neither key is ever in the frontend code.

---

## Key decisions and why

**Why no Zapier?**
Zapier is only needed when no human is present to trigger an action. When a person clicks submit, a direct API call is faster, simpler, and cheaper. Zapier would be unnecessary middleware here.

**Why serverless functions?**
The API key cannot live in the HTML file — it would be visible to anyone who inspects the page source. A serverless function acts as a secure middleman: the frontend calls the function, the function calls Claude, the key never leaves the server.

**Why six questions, not seven?**
The original form had a question asking users to describe the ideal outcome in detail. In testing, it made users do the analytical work the tool was supposed to do. It was cut. The brief quality improved.

**Why conversation history in follow-ups?**
The first real tester asked "what do I do next?" after receiving his brief. He needed to continue the conversation, not start over. Follow-up questions now pass the full Q&A history to Claude so each response builds on what came before.

**Why Airtable logging?**
To observe what problems people actually bring — not what was assumed during design. Real submissions reveal patterns that testing cannot.

---

## What's next

- Session ID linking — connect follow-up rows to their original brief in Airtable

---

## Built by

Kamakshi Madan — Product Designer, Viber AI Cohort, Challenge Week build.

[github.com/kamakshimadan/where-was-i](https://github.com/kamakshimadan/where-was-i)

Built in Week 9 of a 66-day structured AI learning cohort. First build for strangers (previous build, a meal planning agent, was for myself and my cook).

The hardest design decision wasn't technical. It was the questions.
