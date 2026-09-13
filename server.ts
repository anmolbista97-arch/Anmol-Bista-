import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { cleanMathAndLaTeX } from "./src/utils/mathCleaner.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    appName: "StudyMate AI by Anmol Bista"
  });
});

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
  faculty?: string;
}

// Stable active models in this environment
const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

app.post("/api/chat", async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  try {
    const { message, history = [], faculty = "Science" } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Unable to load response. Click to retry." });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are "StudyMate AI by Anmol Bista", an elite high-performance academic AI assistant designed specifically to help students excel in their studies.

Current Selected Faculty Focus: ${faculty} (You must tailor your academic depth, terminology, and relevant syllabus context to ${faculty}, but accurately answer ANY academic or factual question asked).

CRITICAL DIRECTIVES:
1. Direct Answers Only (No Generic Boilerplate):
   - When a user asks a factual, curriculum, or general knowledge question (e.g., "nepal ko pahilo pradhan mantri ko ho?"), ANSWER DIRECTLY AND IMMEDIATELY with the accurate fact (e.g., "नेपालको पहिलो प्रधानमन्त्री भीमसेन थापा हुन्। / Bhimsen Thapa is the first Prime Minister of Nepal.").
   - NEVER output generic boilerplate phrases like "Academic Summary: [Faculty]", "Core Academic Focus", "Key Methodological Steps", or artificial filler text.
   - Deliver clear, concise, syllabus-accurate explanations without conversational bloat.
2. Multilingual & Script Support:
   - Full native support for English.
   - Full native support for Nepali in Devanagari script (e.g. नेपालको इतिहास, भौतिक विज्ञान, आदि).
   - Full native support for Romanized Nepali (Nepali written using English alphabet, e.g. "IC ko fulform k ho?", "Ohm's law k ho bujhaidinu na", "Nepal ma kasto government system chha?", "nepal ko pahilo pradhan mantri ko ho?"). When a student queries in Romanized Nepali, reply directly and clearly in natural Romanized Nepali or Nepali.
3. Mathematical, Scientific & Formula Formatting (STRICT - NO LATEX CODE):
   - You MUST NEVER return LaTeX code syntax or LaTeX delimiters. Strictly do NOT use $$, $, \\frac, \\rho, \\text{}, \\times, \\cdot, \\sqrt, \\begin{...}, or raw LaTeX markup.
   - Render ALL mathematical equations, physics formulas, chemical equations, and units in clean, human-readable plain text using standard Unicode characters and standard math operators (+, -, ×, ÷, =, /).
   - Rules and Examples:
     * Write: Density = Mass / Volume (NEVER write \\rho = \\frac{m}{V} or $...$)
     * Write units in clean plain text: kg/m³, g/cm³, m/s², N, J, W, Pa, Ω
     * Write Ohm's Law as: V = I × R with units Volts (V), Amperes (A), Ohms (Ω)
     * Write Newton's Second Law as: F = m × a (Force = Mass × Acceleration)
     * Use standard Unicode superscripts/subscripts: x², y³, H₂O, CO₂, NO₃⁻, Ca²⁺
     * Write chemical reactions as: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (in presence of sunlight and chlorophyll)
     * For derivations: list each algebraic step with clean bullet points and bold labels, never enclosing equations in dollar signs.
4. Formatting & Layout:
   - Use clean Markdown with bold keywords, clean bullet lists when listing points, and code blocks ONLY for computer programming languages (like C, Python, JavaScript). Do NOT put plain math formulas in code blocks or LaTeX fences.
5. Tone: Intellectual, helpful, direct, and encouraging without being verbose.`;

    // Construct multi-turn contents for Gemini
    const contents = [
      ...history.slice(-10).map((msg) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [{ text: message.trim() }],
      },
    ];

    let replyText: string | null = null;
    let lastError: any = null;

    // Retry loop with exponential delay across candidate models
    const MAX_ATTEMPTS = 3;
    let modelIndex = 0;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const currentModel = CANDIDATE_MODELS[modelIndex % CANDIDATE_MODELS.length];
      try {
        const response = await ai.models.generateContent({
          model: currentModel,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response && response.text && response.text.trim()) {
          replyText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        console.warn(`[StudyMate AI] Attempt ${attempt} with model ${currentModel} failed: ${errMsg}`);

        if (errMsg.includes("404") || err?.status === 404) {
          modelIndex++;
          continue;
        }

        if (attempt < MAX_ATTEMPTS) {
          const delayMs = attempt * 800;
          await sleep(delayMs);
        }
        modelIndex++;
      }
    }

    // If Gemini models succeeded, return dynamic AI response
    if (replyText) {
      res.json({ reply: cleanMathAndLaTeX(replyText) });
      return;
    }

    console.error("[StudyMate AI] All dynamic model attempts exhausted.", lastError);
    res.status(503).json({ error: "Unable to load response. Click to retry." });

  } catch (error: any) {
    console.error("Gemini API Top-Level Error:", error);
    res.status(500).json({ error: "Unable to load response. Click to retry." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyMate AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
