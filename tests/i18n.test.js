import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  initLanguage,
  setLanguage,
  t,
  getCurrentLanguage,
  translatePage,
  TRANSLATIONS,
} from "../assets/js/i18n.js";

describe("Internationalization (i18n) Module", () => {
  beforeEach(() => {
    localStorage.clear();
    setLanguage("en", false);
    // Reset document state
    document.documentElement.lang = "en";
    document.body.innerHTML = "";
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should default to English and fetch the correct language", () => {
    expect(getCurrentLanguage()).toBe("en");
    expect(t("appName")).toBe("🌿 CarbonSathi");
  });

  it("should initialize language from storage if saved", () => {
    localStorage.setItem(
      "carbonwise_v1",
      JSON.stringify({ preferences: { language: "hi" } }),
    );
    initLanguage();
    expect(getCurrentLanguage()).toBe("hi");
  });

  it("should set language and translate correctly", () => {
    setLanguage("hi");
    expect(getCurrentLanguage()).toBe("hi");
    expect(t("appName")).toBe("🌿 कार्बन साथी (CarbonSathi)");

    setLanguage("gu");
    expect(getCurrentLanguage()).toBe("gu");
    expect(t("appName")).toBe("🌿 કાર્બન સાથી (CarbonSathi)");

    setLanguage("mr");
    expect(getCurrentLanguage()).toBe("mr");
    expect(t("appName")).toBe("🌿 कार्बन साथी (CarbonSathi)");
  });

  it("should fall back to English if key is missing in selected language", () => {
    // Inject a dummy key in English only
    TRANSLATIONS.en.dummyKey = "English Dummy";
    delete TRANSLATIONS.hi.dummyKey;

    setLanguage("hi");
    expect(t("dummyKey")).toBe("English Dummy");

    // Clean up
    delete TRANSLATIONS.en.dummyKey;
  });

  it("should use fallback parameter if key is missing completely", () => {
    expect(t("nonExistentKey", "Custom Fallback")).toBe("Custom Fallback");
  });

  it("should translate DOM elements textContent via data-i18n", () => {
    const div = document.createElement("div");
    div.setAttribute("data-i18n", "navHome");
    div.textContent = "Original Text";
    document.body.appendChild(div);

    translatePage();
    expect(div.textContent).toBe("Home");

    setLanguage("hi");
    expect(div.textContent).toBe("होम");
  });

  it("should translate DOM element placeholders via data-i18n-ph", () => {
    const input = document.createElement("input");
    input.setAttribute("data-i18n-ph", "apiPlaceholder");
    input.placeholder = "Original Placeholder";
    document.body.appendChild(input);

    translatePage();
    expect(input.placeholder).toBe("Enter Gemini API Key (session only)");

    setLanguage("gu");
    expect(input.placeholder).toBe("જેમિની API કી દાખલ કરો");
  });

  it("should update the html lang attribute correctly", () => {
    setLanguage("mr");
    expect(document.documentElement.lang).toBe("mr");

    setLanguage("en");
    expect(document.documentElement.lang).toBe("en");
  });
});
