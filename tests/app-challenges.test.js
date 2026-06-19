import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadState, saveState } from "../assets/js/storage.js";

const footprint = {
  monthlyTotal: 420,
  yearlyTotal: 5040,
  ecoScore: 68,
  topCategory: "transport",
  categories: {
    transport: 180,
    energy: 120,
    food: 80,
    shopping: 30,
    waste: 10,
  },
};

const renderAppShell = () => {
  document.body.innerHTML = `
    <header>
      <nav>
        <a href="#home" class="nav__link">Home</a>
        <a href="#calculator" class="nav__link">Calculator</a>
        <a href="#dashboard" class="nav__link">Dashboard</a>
        <a href="#recommendations" class="nav__link">Actions</a>
        <a href="#challenges" class="nav__link">Challenges</a>
        <a href="#assistant" class="nav__link">Assistant</a>
      </nav>
      <select id="language-selector">
        <option value="en">English</option>
      </select>
      <button id="theme-toggle">Theme</button>
    </header>
    <main>
      <section id="home" class="section">Home</section>
      <section id="calculator" class="section">
        <form id="calc-form"></form>
      </section>
      <section id="dashboard" class="section">
        <div id="dashboard-container"></div>
      </section>
      <section id="recommendations" class="section">
        <div id="recommendations-container"></div>
      </section>
      <section id="challenges" class="section">
        <div id="challenges-container"></div>
      </section>
      <section id="assistant" class="section">
        <div id="assistant-chat"></div>
        <form id="assistant-form"></form>
        <input id="assistant-input" />
      </section>
      <div id="maps-container"></div>
      <div id="calendar-container"></div>
      <input id="api-key-input" />
      <button id="save-api-key-btn">Save</button>
    </main>
  `;
};

describe("Challenge interactions", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/#challenges");
    renderAppShell();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("completes a rendered challenge with an on-screen popup", async () => {
    saveState({ ...loadState(), footprint });
    vi.resetModules();
    await import("../assets/js/app.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const challengeButton = document.querySelector(
      "[data-challenge-id='ch_t4']",
    );
    expect(challengeButton).not.toBeNull();

    const challengeId = challengeButton.dataset.challengeId;
    challengeButton.click();

    const state = loadState();
    expect(state.completedChallenges).toContain(challengeId);
    expect(state.totalPoints).toBeGreaterThan(0);
    expect(window.alert).not.toHaveBeenCalled();

    const popup = document.querySelector(".challenge-popup");
    expect(popup).not.toBeNull();
    expect(popup.getAttribute("role")).toBe("dialog");
    expect(popup.getAttribute("aria-modal")).toBe("true");
    expect(popup.textContent).toContain("Challenge completed");
    expect(
      document.querySelectorAll(".challenge-popup__badge-image"),
    ).toHaveLength(3);
    expect(popup.textContent).toContain("First Step");
    expect(popup.textContent).toContain("Century Saver");
    expect(popup.textContent).toContain("Carbon Cutter");
    expect(document.querySelector(".badge-card__image")).not.toBeNull();
    expect(
      document.querySelector("#dashboard-container").textContent,
    ).toContain("First Step");

    document.querySelector("[data-action='close-toast']").click();
    expect(document.querySelector(".challenge-popup--leaving")).not.toBeNull();
  });
});
