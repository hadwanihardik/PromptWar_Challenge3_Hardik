/**
 * assistant.js
 * Chat UI logic for CarbonSathi AI Eco Assistant.
 * Uses textContent exclusively to render safe HTML to prevent XSS.
 */

import { askGemini } from "./gemini.js";
import { loadState } from "./storage.js";
import { t } from "./i18n.js";

let conversationHistory = [];
let messageIdCounter = 0;

/**
 * Initializes the assistant chat UI.
 * @param {HTMLElement} chatContainerEl - Element to hold messages
 * @param {HTMLElement} formEl - The chat form
 * @param {HTMLElement} inputEl - The input field
 */
const initAssistant = (chatContainerEl, formEl, inputEl) => {
  if (!chatContainerEl || !formEl || !inputEl) return;

  // Add initial greeting
  if (chatContainerEl.children.length === 0) {
    addAssistantGreeting(chatContainerEl);
  }

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userText = inputEl.value.trim();
    if (!userText) return;

    // 1. Add user message to UI
    addMessageToUI(chatContainerEl, "user", userText);
    inputEl.value = "";

    // Show typing indicator
    const typingId = addMessageToUI(chatContainerEl, "assistant", "...");

    try {
      const state = loadState();
      // 2. Ask Gemini
      const response = await askGemini(
        userText,
        state.footprint,
        conversationHistory,
      );

      // Update history
      conversationHistory.push(userText);
      conversationHistory.push(response.text);

      // 3. Replace typing indicator with actual response
      updateMessageInUI(chatContainerEl, typingId, response.text);
    } catch (err) {
      updateMessageInUI(
        chatContainerEl,
        typingId,
        t("assistantError"),
      );
    }
  });
};

const addAssistantGreeting = (chatContainerEl) => {
  const id = addMessageToUI(chatContainerEl, "assistant", t("assistantGreeting"));
  const el = chatContainerEl.querySelector(`#${id}`);
  if (el) {
    el.dataset.assistantGreeting = "true";
  }
};

const refreshAssistantGreeting = (chatContainerEl) => {
  if (!chatContainerEl) return;

  const greetingEl = chatContainerEl.querySelector("[data-assistant-greeting]");
  if (greetingEl) {
    greetingEl.textContent = t("assistantGreeting");
  }
};

/**
 * Adds a message to the chat container.
 * @param {HTMLElement} container
 * @param {string} role 'user' or 'assistant'
 * @param {string} text
 * @returns {string} Unique ID for the message element
 */
const addMessageToUI = (container, role, text) => {
  messageIdCounter += 1;
  const id = `msg_${Date.now()}_${messageIdCounter}`;
  const div = document.createElement("div");
  div.className = `assistant__message assistant__message--${role}`;
  div.id = id;

  // SECURE: Only use textContent
  div.textContent = text;

  if (role === "assistant") {
    div.setAttribute("aria-live", "polite");
  }

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return id;
};

/**
 * Updates an existing message in the UI (used to replace typing indicator).
 * @param {HTMLElement} container
 * @param {string} id
 * @param {string} newText
 */
const updateMessageInUI = (container, id, newText) => {
  const el = container.querySelector(`#${id}`);
  if (el) {
    el.textContent = newText;
    container.scrollTop = container.scrollHeight;
  }
};

export { initAssistant, refreshAssistantGreeting };
