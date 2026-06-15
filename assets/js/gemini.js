/**
 * gemini.js
 * Gemini API wrapper for CarbonSathi AI Eco Assistant.
 *
 * Security rules:
 *  - API key is never committed. Users paste it into the UI or config.local.js.
 *  - App works fully without an API key using offline fallback responses.
 *  - AI responses are NEVER rendered as innerHTML — only textContent.
 *
 * Usage:
 *  import { askGemini, setApiKey } from './gemini.js';
 */

import { getCurrentLanguage } from "./i18n.js";

// ─── API KEY MANAGEMENT ───────────────────────────────────────────────────────

let _apiKey = null;

/**
 * Sets the Gemini API key at runtime.
 * Key is never stored in localStorage — session only.
 * @param {string} key - Gemini API key
 */
const setApiKey = (key) => {
  _apiKey = key && key.trim() ? key.trim() : null;
};

/**
 * Returns whether an API key has been set for this session.
 * @returns {boolean}
 */
const hasApiKey = () => Boolean(_apiKey);

// ─── OFFLINE FALLBACK RESPONSES ───────────────────────────────────────────────

const OFFLINE_RESPONSES = [
  "To reduce your transport footprint: try using public transport or cycling once a week. Even one car-free day can save 2–3 kg CO₂ per week.",
  "Your electricity usage has the biggest impact in many homes. Setting your AC to 24°C and unplugging devices on standby can cut 5–10% of your bill and emissions.",
  "Plant-based meals are one of the highest-impact food changes. Even replacing one meat meal per day with vegetables or lentils saves 1–3 kg CO₂ daily.",
  "Food waste is a hidden contributor to emissions. Planning meals for the week and using leftovers wisely can save 8–20 kg CO₂ per month.",
  "For shopping: the single most effective action is to buy less and use what you have longer. Second-hand clothing has 90% lower carbon impact than new fast fashion.",
  "Waste segregation and recycling reduces landfill methane — a greenhouse gas 25× more potent than CO₂. Separating dry and wet waste takes 2 minutes a day.",
  "A practical starting point: pick one small daily habit this week — a reusable bag, one less meat meal, or cycling one short trip. Small consistent actions add up.",
  "Google Maps can show you public transit options, bike routes, and walking paths for your daily commute. Comparing options takes 30 seconds and can save kilograms of CO₂.",
  "Setting a monthly carbon reduction goal helps you stay motivated. Even a 5% monthly reduction in transport emissions is meaningful progress over a year.",
  "If your electricity comes from India's grid, each kWh emits ~0.82 kg CO₂. Reducing usage by 50 kWh saves about 41 kg CO₂ — equal to not driving 200 km.",
];

/**
 * Returns a context-aware offline fallback response.
 * Tries to match the message to a relevant topic.
 * @param {string} userMessage - The user's question
 * @returns {string} Fallback response text
 */
const getOfflineFallback = (userMessage = "") => {
  const msg = userMessage.toLowerCase();
  if (
    msg.includes("transport") ||
    msg.includes("car") ||
    msg.includes("commut") ||
    msg.includes("bus") ||
    msg.includes("train")
  ) {
    return OFFLINE_RESPONSES[0];
  }
  if (
    msg.includes("energy") ||
    msg.includes("electric") ||
    msg.includes("ac") ||
    msg.includes("appliance")
  ) {
    return OFFLINE_RESPONSES[1];
  }
  if (
    msg.includes("food") ||
    msg.includes("meat") ||
    msg.includes("diet") ||
    msg.includes("vegan")
  ) {
    return OFFLINE_RESPONSES[2];
  }
  if (
    msg.includes("waste") ||
    msg.includes("food waste") ||
    msg.includes("leftover")
  ) {
    return OFFLINE_RESPONSES[3];
  }
  if (
    msg.includes("shop") ||
    msg.includes("cloth") ||
    msg.includes("fashion") ||
    msg.includes("buy")
  ) {
    return OFFLINE_RESPONSES[4];
  }
  if (
    msg.includes("recycl") ||
    msg.includes("compost") ||
    msg.includes("segreg")
  ) {
    return OFFLINE_RESPONSES[5];
  }
  // Default: rotate through general responses using message length as seed
  const index = (userMessage.length % (OFFLINE_RESPONSES.length - 2)) + 1;
  return (
    OFFLINE_RESPONSES[index] +
    "\n\n(Note: AI assistant is offline — showing pre-set guidance. Add your Gemini API key for personalized responses.)"
  );
};

// ─── GEMINI API CALL ──────────────────────────────────────────────────────────

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Builds a context-aware system prompt including the user's footprint data.
 * @param {Object|null} footprintResult - Latest footprint result from calculator
 * @returns {string} System instructions for Gemini
 */
const buildSystemPrompt = (footprintResult) => {
  const langMap = { en: "English", hi: "Hindi", gu: "Gujarati", mr: "Marathi" };
  const responseLang = langMap[getCurrentLanguage()] || "English";

  let context = `You are CarbonSathi Eco Assistant, a friendly and practical sustainability coach. You help users understand their carbon footprint and take simple, real-world actions to reduce it. Keep responses concise (2-4 sentences), practical, and encouraging. Focus on actionable advice. IMPORTANT: Always respond in ${responseLang}.`;

  if (footprintResult) {
    const { monthlyTotal, topCategory, ecoScore } = footprintResult;
    context += ` The user's estimated monthly carbon footprint is ${Math.round(monthlyTotal)} kg CO₂e. Their eco score is ${ecoScore}/100. Their highest emission category is ${topCategory}. Tailor your advice to focus on their top emission area when relevant.`;
  }

  return context;
};

/**
 * Sends a message to the Gemini API and returns the response text.
 * Falls back gracefully to offline responses on any error.
 * @param {string} userMessage - User's question or message
 * @param {Object|null} footprintResult - Latest footprint result for context
 * @param {string[]} [conversationHistory] - Previous turn texts for context
 * @returns {Promise<{text: string, isOffline: boolean}>}
 */
const askGemini = async (
  userMessage,
  footprintResult = null,
  conversationHistory = [],
) => {
  if (!userMessage || !userMessage.trim()) {
    return { text: "Please enter a question to get started.", isOffline: true };
  }

  if (!_apiKey) {
    return {
      text: getOfflineFallback(userMessage),
      isOffline: true,
    };
  }

  try {
    const systemPrompt = buildSystemPrompt(footprintResult);

    // Build conversation contents
    const contents = [];

    // Add recent history (last 3 turns for context window efficiency)
    const recentHistory = conversationHistory.slice(-6);
    for (let i = 0; i < recentHistory.length; i += 2) {
      if (recentHistory[i]) {
        contents.push({ role: "user", parts: [{ text: recentHistory[i] }] });
      }
      if (recentHistory[i + 1]) {
        contents.push({
          role: "model",
          parts: [{ text: recentHistory[i + 1] }],
        });
      }
    }

    // Add current user message
    contents.push({ role: "user", parts: [{ text: userMessage }] });

    const requestBody = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
        topP: 0.9,
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${_apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return { text: text.trim(), isOffline: false };
  } catch (_err) {
    console.warn(
      "CarbonSathi: Gemini API unavailable, using fallback.",
      _err.message,
    );
    return {
      text: getOfflineFallback(userMessage),
      isOffline: true,
    };
  }
};

export { setApiKey, hasApiKey, askGemini, getOfflineFallback };
