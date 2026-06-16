/**
 * app.js
 * Main entry point for CarbonSathi.
 * Handles DOM events, navigation between sections, and app initialization.
 */

import { calculateTotal } from "./calculator.js";
import { saveFootprintResult, loadState } from "./storage.js";
import { renderDashboard } from "./dashboard.js";
import { getTopRecommendations } from "./recommendations.js";
import { initAssistant, refreshAssistantGreeting } from "./assistant.js";
import {
  getAvailableChallenges,
  completeChallengeAction,
} from "./challenges.js";
import { setApiKey } from "./gemini.js";
import { getAllEcoMapLinks } from "./maps.js";
import { getAllCalendarReminders } from "./calendar.js";
import { initLanguage, setLanguage, getCurrentLanguage, t } from "./i18n.js";

// Cache DOM elements
const DOM = {
  navLinks: document.querySelectorAll(".nav__link"),
  sections: document.querySelectorAll(".section"),
  calcForm: document.getElementById("calc-form"),
  dashboardContainer: document.getElementById("dashboard-container"),
  recsContainer: document.getElementById("recommendations-container"),
  challengesContainer: document.getElementById("challenges-container"),
  assistantChat: document.getElementById("assistant-chat"),
  assistantForm: document.getElementById("assistant-form"),
  assistantInput: document.getElementById("assistant-input"),
  mapsContainer: document.getElementById("maps-container"),
  calendarContainer: document.getElementById("calendar-container"),
  apiKeyInput: document.getElementById("api-key-input"),
  saveApiKeyBtn: document.getElementById("save-api-key-btn"),
  langSelector: document.getElementById("language-selector"),
  themeToggle: document.getElementById("theme-toggle"),
};

const DEFAULT_SECTION_ID = "home";

const getValidSectionId = (sectionId) => {
  if (!sectionId) return DEFAULT_SECTION_ID;

  const targetSection = document.getElementById(sectionId);
  if (!targetSection || !targetSection.classList.contains("section")) {
    return DEFAULT_SECTION_ID;
  }

  return sectionId;
};

const getInitialSectionId = (hasFootprint) => {
  const hashSectionId = decodeURIComponent(window.location.hash || "").replace(
    "#",
    "",
  );
  if (hashSectionId) return getValidSectionId(hashSectionId);

  return hasFootprint ? "dashboard" : DEFAULT_SECTION_ID;
};

/**
 * Initializes the app
 */
const init = () => {
  try {
    setupTheme();
  } catch (e) {
    console.warn("CarbonSathi: Theme init error", e);
  }
  try {
    setupLanguage();
  } catch (e) {
    console.warn("CarbonSathi: Language init error", e);
  }

  setupNavigation();
  setupCalculator();
  setupApiKeyForm();
  setupDynamicActions();

  // Render initial sections — each wrapped so one failure doesn't block others
  try {
    renderChallenges();
  } catch (e) {
    console.warn("CarbonSathi: Challenges render error", e);
  }
  try {
    renderMapsLinks();
  } catch (e) {
    console.warn("CarbonSathi: Maps render error", e);
  }
  try {
    renderCalendarLinks();
  } catch (e) {
    console.warn("CarbonSathi: Calendar render error", e);
  }

  try {
    if (DOM.assistantChat) {
      initAssistant(DOM.assistantChat, DOM.assistantForm, DOM.assistantInput);
    }
  } catch (e) {
    console.warn("CarbonSathi: Assistant init error", e);
  }

  // Load dashboard if footprint exists
  const state = loadState();
  if (state.footprint) {
    try {
      renderDashboard(state.footprint, DOM.dashboardContainer);
      renderRecommendations(state.footprint);
    } catch (e) {
      console.warn("CarbonSathi: Dashboard render error", e);
    }
    navigateTo(getInitialSectionId(true), { updateHash: false });
  } else {
    // Show helpful empty states
    renderEmptyDashboard();
    renderEmptyRecommendations();
    navigateTo(getInitialSectionId(false), { updateHash: false });
  }
};

/**
 * Setup Theme
 */
const setupTheme = () => {
  const state = loadState();
  let theme = state.preferences?.theme || "light";

  const applyTheme = (t) => {
    if (t === "dark") {
      document.body.classList.add("theme-dark");
      DOM.themeToggle.textContent = "🌙";
    } else {
      document.body.classList.remove("theme-dark");
      DOM.themeToggle.textContent = "☀️";
    }
  };

  applyTheme(theme);

  DOM.themeToggle.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    applyTheme(theme);

    // Save preference
    const currentState = loadState();
    currentState.preferences = currentState.preferences || {};
    currentState.preferences.theme = theme;
    // We update manually via localstorage export if needed, or we just save entire state
    localStorage.setItem("carbonwise_v1", JSON.stringify(currentState));
  });
};

/**
 * Setup Language
 */
const setupLanguage = () => {
  initLanguage(); // Loads saved lang and translates page immediately
  DOM.langSelector.value = getCurrentLanguage();

  DOM.langSelector.addEventListener("change", (e) => {
    setLanguage(e.target.value);
    renderLocalizedDynamicSections();
  });
};

const renderLocalizedDynamicSections = () => {
  const state = loadState();

  if (state.footprint) {
    renderDashboard(state.footprint, DOM.dashboardContainer);
    renderRecommendations(state.footprint);
  } else {
    renderEmptyDashboard();
    renderEmptyRecommendations();
  }

  renderChallenges();
  renderMapsLinks();
  renderCalendarLinks();
  refreshAssistantGreeting(DOM.assistantChat);
};

/**
 * Navigation handler
 */
const setupNavigation = () => {
  DOM.navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      navigateTo(targetId);
    });
  });

  window.addEventListener("hashchange", () => {
    navigateTo(getValidSectionId(window.location.hash.slice(1)), {
      updateHash: false,
    });
  });
};

const navigateTo = (sectionId, options = {}) => {
  const { updateHash = true } = options;
  const validSectionId = getValidSectionId(sectionId);

  DOM.sections.forEach((sec) => sec.classList.remove("section--active"));
  DOM.navLinks.forEach((link) => link.classList.remove("nav__link--active"));

  const targetSec = document.getElementById(validSectionId);
  if (targetSec) targetSec.classList.add("section--active");

  const targetLink = document.querySelector(
    `.nav__link[href="#${validSectionId}"]`,
  );
  if (targetLink) targetLink.classList.add("nav__link--active");

  if (updateHash && window.location.hash !== `#${validSectionId}`) {
    history.pushState(null, "", `#${validSectionId}`);
  }
};

const setupDynamicActions = () => {
  document.addEventListener("click", (e) => {
    const calculatorAction = e.target.closest("[data-action='go-calculator']");
    if (calculatorAction) {
      e.preventDefault();
      navigateTo("calculator");
      return;
    }

    const challengeButton = e.target.closest("[data-challenge-id]");
    if (challengeButton) {
      e.preventDefault();
      handleChallengeCompletion(challengeButton.dataset.challengeId);
    }
  });
};

/**
 * Calculator Form handler
 */
const setupCalculator = () => {
  if (!DOM.calcForm) return;

  DOM.calcForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Gather inputs
    const formData = new FormData(DOM.calcForm);
    const inputs = {
      transport: {
        dailyDistanceKm: parseFloat(formData.get("dailyDistanceKm")) || 0,
        vehicleType: formData.get("vehicleType"),
        commuteDaysPerMonth: 22,
        domesticFlightsPerYear:
          parseFloat(formData.get("domesticFlightsPerYear")) || 0,
      },
      energy: {
        monthlyKwh: parseFloat(formData.get("monthlyKwh")) || 0,
      },
      food: {
        dietType: formData.get("dietType"),
        foodWaste: formData.get("foodWaste"),
      },
      shopping: {
        newClothingItemsPerMonth:
          parseFloat(formData.get("newClothingItemsPerMonth")) || 0,
      },
      waste: {
        recyclingLevel: formData.get("recyclingLevel"),
      },
    };

    // Calculate
    const result = calculateTotal(inputs);

    // Save to localStorage
    saveFootprintResult(result);

    // Render Dashboard & Recommendations
    renderDashboard(result, DOM.dashboardContainer);
    renderRecommendations(result);

    // Navigate to Dashboard
    navigateTo("dashboard");
  });
};

/**
 * Renders recommendations
 */
const renderRecommendations = (footprint) => {
  if (!DOM.recsContainer || !footprint) return;

  const state = loadState();
  const recs = getTopRecommendations({
    categories: footprint.categories,
    completedTipIds: state.completedChallenges,
    count: 3,
  });

  if (recs.length === 0) {
    DOM.recsContainer.innerHTML = `<p>${t("recsPlaceholder")}</p>`;
    return;
  }

  const html = recs
    .map(
      (rec) => `
    <div class="card card--recommendation">
      <h3>${t(rec.id + "_title", rec.title)}</h3>
      <p>${t(rec.id + "_desc", rec.description)}</p>
      <div class="card__meta">
        <span class="badge badge--${rec.difficulty}">${t(rec.difficulty)}</span>
        <span class="badge badge--impact">${t("savesLabel")} ${rec.estimatedSavingKgPerMonth} ${t("kgPerMonth")}</span>
      </div>
    </div>
  `,
    )
    .join("");

  DOM.recsContainer.innerHTML = html;
};

/**
 * Renders a helpful empty state for Dashboard when no footprint exists
 */
const renderEmptyDashboard = () => {
  if (!DOM.dashboardContainer) return;
  DOM.dashboardContainer.innerHTML = `
    <div class="card empty-state">
      <div class="empty-state__icon">📊</div>
      <h3>${t("dashPlaceholder", "Please complete the calculator first.")}</h3>
      <p class="text-small empty-state__copy">
        ${t("dashPlaceholderHint", "Use the Calculator tab to estimate your carbon footprint, then come back here for a detailed breakdown.")}
      </p>
      <button class="btn empty-state__button" data-action="go-calculator">
        ${t("calcStartBtn", "Calculate My Footprint")}
      </button>
    </div>
  `;
};

/**
 * Renders a helpful empty state for Recommendations when no footprint exists
 */
const renderEmptyRecommendations = () => {
  if (!DOM.recsContainer) return;
  DOM.recsContainer.innerHTML = `
    <div class="card empty-state empty-state--wide">
      <div class="empty-state__icon">🌿</div>
      <h3>${t("recsPlaceholder", "Please complete the calculator first.")}</h3>
      <p class="text-small empty-state__copy">
        ${t("recsPlaceholderHint", "Once you calculate your footprint, we'll show personalized actions tailored to your biggest emission areas.")}
      </p>
      <button class="btn empty-state__button" data-action="go-calculator">
        ${t("calcStartBtn", "Calculate My Footprint")}
      </button>
    </div>
  `;
};

/**
 * Renders challenges
 */
const renderChallenges = () => {
  if (!DOM.challengesContainer) return;
  const available = getAvailableChallenges();

  if (available.length === 0) {
    DOM.challengesContainer.innerHTML = `<p>${t("chalAllDone")}</p>`;
    return;
  }

  const html = available
    .map(
      (ch) => `
    <div class="card card--challenge" id="ch_${ch.id}">
      <div class="card__icon">${ch.icon}</div>
      <div class="card__content">
        <h3>${t(ch.id + "_title", ch.title)}</h3>
        <p>${t(ch.id + "_desc", ch.description)}</p>
        <button class="btn btn--small" data-challenge-id="${ch.id}">${t("completeBtn")} (${ch.points} ${t("ptsLabel")})</button>
      </div>
    </div>
  `,
    )
    .join("");

  DOM.challengesContainer.innerHTML = html;
};

const handleChallengeCompletion = (id) => {
  const result = completeChallengeAction(id);
  if (result.success) {
    const messages = [
      `${t("challengeCompletedAlert")} ${result.pointsAwarded} ${t("pointsLabel")}.`,
    ];

    if (result.newlyEarnedBadges && result.newlyEarnedBadges.length > 0) {
      messages.push(
        `${t("badgeEarnedAlertPrefix")} ${t(
          result.newlyEarnedBadges[0].id + "_name",
          result.newlyEarnedBadges[0].name,
        )}`,
      );
    }
    alert(messages.join("\n"));
    renderChallenges();
  }
};

/**
 * Renders Maps Links
 */
const renderMapsLinks = () => {
  if (!DOM.mapsContainer) return;
  const links = getAllEcoMapLinks();

  const html = links
    .map(
      (link) => `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="card card--link">
      <div class="card__icon">${link.icon}</div>
      <div>
        <h4>${t(link.id + "_title", link.label)}</h4>
        <p class="text-small">${t(link.id + "_desc", link.description)}</p>
      </div>
    </a>
  `,
    )
    .join("");

  DOM.mapsContainer.innerHTML = html;
};

/**
 * Renders Calendar Links
 */
const renderCalendarLinks = () => {
  if (!DOM.calendarContainer) return;
  const links = getAllCalendarReminders();

  const html = links
    .map(
      (link) => `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="card card--link">
      <div class="card__icon">${link.icon}</div>
      <div>
        <h4>${t(link.id + "_title", link.label)}</h4>
        <p class="text-small">${t(link.id + "_desc", link.description)}</p>
      </div>
    </a>
  `,
    )
    .join("");

  DOM.calendarContainer.innerHTML = html;
};

/**
 * Setup API Key form
 */
const setupApiKeyForm = () => {
  if (!DOM.saveApiKeyBtn || !DOM.apiKeyInput) return;

  DOM.saveApiKeyBtn.addEventListener("click", () => {
    const key = DOM.apiKeyInput.value.trim();
    if (key) {
      setApiKey(key);
      alert(t("apiSavedAlert"));
      DOM.apiKeyInput.value = "";
    } else {
      alert(t("apiInvalidAlert"));
    }
  });
};

// Start app
document.addEventListener("DOMContentLoaded", init);

export { getInitialSectionId, getValidSectionId, navigateTo };
