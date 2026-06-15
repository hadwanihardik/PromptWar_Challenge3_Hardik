import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initAssistant } from "../assets/js/assistant.js";

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("Assistant chat UI", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <div id="assistant-chat"></div>
      <form id="assistant-form">
        <label for="assistant-input">Message</label>
        <input id="assistant-input" />
        <button type="submit">Send</button>
      </form>
    `;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("replaces the typing indicator without overwriting the user's message", async () => {
    vi.spyOn(Date, "now").mockReturnValue(12345);

    const chatEl = document.getElementById("assistant-chat");
    const formEl = document.getElementById("assistant-form");
    const inputEl = document.getElementById("assistant-input");

    initAssistant(chatEl, formEl, inputEl);

    inputEl.value = "How can I reduce electricity usage this week?";
    formEl.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await flushPromises();

    const messages = [...chatEl.querySelectorAll(".assistant__message")].map(
      (el) => el.textContent,
    );

    expect(messages).toContain("How can I reduce electricity usage this week?");
    expect(messages).toContain(
      "Your electricity usage has the biggest impact in many homes. Setting your AC to 24°C and unplugging devices on standby can cut 5–10% of your bill and emissions.",
    );
    expect(messages).not.toContain("...");
  });
});
