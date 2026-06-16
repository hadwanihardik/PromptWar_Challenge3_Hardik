import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const renderAppShell = () => {
  document.body.innerHTML = `
    <header>
      <nav>
        <a href="#home" class="nav__link nav__link--active">Home</a>
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
      <section id="home" class="section section--active">Home</section>
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

const importAndStartApp = async (hash = "") => {
  window.history.replaceState(null, "", `/${hash}`);
  renderAppShell();
  vi.resetModules();
  await import("../assets/js/app.js");
  document.dispatchEvent(new Event("DOMContentLoaded"));
};

describe("App navigation and interactive controls", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("opens the calculator section from a shared hash URL", async () => {
    await importAndStartApp("#calculator");

    expect(document.querySelector("#calculator").classList).toContain(
      "section--active",
    );
    expect(document.querySelector(".nav__link--active").getAttribute("href"))
      .toBe("#calculator");
  });

  it("updates the visible section and URL hash when nav links are clicked", async () => {
    await importAndStartApp();

    document.querySelector('.nav__link[href="#challenges"]').click();

    expect(document.querySelector("#challenges").classList).toContain(
      "section--active",
    );
    expect(window.location.hash).toBe("#challenges");
  });

});
