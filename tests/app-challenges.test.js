import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadState } from "../assets/js/storage.js";

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

  it("completes a rendered challenge with one combined alert", async () => {
    vi.resetModules();
    await import("../assets/js/app.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const challengeButton = document.querySelector("[data-challenge-id]");
    expect(challengeButton).not.toBeNull();

    const challengeId = challengeButton.dataset.challengeId;
    challengeButton.click();

    const state = loadState();
    expect(state.completedChallenges).toContain(challengeId);
    expect(state.totalPoints).toBeGreaterThan(0);
    expect(window.alert).toHaveBeenCalledTimes(1);
  });
});
