import { afterEach, describe, expect, it, vi } from "vitest";
import {
  askGemini,
  getOfflineFallback,
  hasApiKey,
  setApiKey,
} from "../assets/js/gemini.js";
import { setLanguage } from "../assets/js/i18n.js";

const footprint = {
  monthlyTotal: 320,
  ecoScore: 72,
  topCategory: "energy",
};

describe("Gemini assistant wrapper", () => {
  afterEach(() => {
    setApiKey(null);
    setLanguage("en", false);
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("keeps API keys session-only and trims blank input", () => {
    setApiKey("  test-key  ");
    expect(hasApiKey()).toBe(true);

    setApiKey("   ");
    expect(hasApiKey()).toBe(false);
  });

  it("returns targeted offline guidance without an API key", async () => {
    const result = await askGemini("How do I reduce electricity usage?");

    expect(result.isOffline).toBe(true);
    expect(result.text).toContain("electricity");
  });

  it("handles empty prompts without calling the API", async () => {
    setApiKey("test-key");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await askGemini("   ");

    expect(result).toEqual({
      text: "Please enter a question to get started.",
      isOffline: true,
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends contextual prompts and returns Gemini text when available", async () => {
    setApiKey("test-key");
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: " Use LEDs and unplug standby devices. " }],
            },
          },
        ],
      }),
    });
    vi.stubGlobal("fetch", fetchSpy);

    const result = await askGemini("What should I do?", footprint, [
      "hello",
      "hi",
    ]);
    const requestBody = JSON.parse(fetchSpy.mock.calls[0][1].body);

    expect(result).toEqual({
      text: "Use LEDs and unplug standby devices.",
      isOffline: false,
    });
    expect(fetchSpy.mock.calls[0][0]).toContain("key=test-key");
    expect(requestBody.system_instruction.parts[0].text).toContain("energy");
    expect(requestBody.contents).toHaveLength(3);
  });

  it("falls back safely when the Gemini API fails", async () => {
    setApiKey("test-key");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );

    const result = await askGemini("transport advice");

    expect(result.isOffline).toBe(true);
    expect(result.text).toBe(getOfflineFallback("transport advice"));
  });
});
