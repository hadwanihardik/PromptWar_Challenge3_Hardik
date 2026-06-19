/**
 * app.js
 * Main entry point for CarbonSathi.
 * Handles DOM events, navigation between sections, and app initialization.
 */

import { calculateTotal } from "./calculator.js";
import {
  saveFootprintResult,
  loadState,
  updatePreferences,
} from "./storage.js";
import { renderDashboard, getBadgeImageSrc } from "./dashboard.js";
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
const DEFAULT_COMMUTE_DAYS_PER_MONTH = 22;
const RECOMMENDATION_COUNT = 6;
const ACTION_LINK_SECTION_CONFIG = {
  maps: {
    container: () => DOM.mapsContainer,
    links: getAllEcoMapLinks,
  },
  calendar: {
    container: () => DOM.calendarContainer,
    links: getAllCalendarReminders,
  },
};

const parsePositiveNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const buildCalculatorInputs = (form) => {
  const formData = new FormData(form);

  return {
    transport: {
      dailyDistanceKm: parsePositiveNumber(formData.get("dailyDistanceKm")),
      vehicleType: formData.get("vehicleType"),
      commuteDaysPerMonth: DEFAULT_COMMUTE_DAYS_PER_MONTH,
      domesticFlightsPerYear: parsePositiveNumber(
        formData.get("domesticFlightsPerYear"),
      ),
    },
    energy: {
      monthlyKwh: parsePositiveNumber(formData.get("monthlyKwh")),
    },
    food: {
      dietType: formData.get("dietType"),
      foodWaste: formData.get("foodWaste"),
    },
    shopping: {
      newClothingItemsPerMonth: parsePositiveNumber(
        formData.get("newClothingItemsPerMonth"),
      ),
    },
    waste: {
      recyclingLevel: formData.get("recyclingLevel"),
    },
  };
};

const runSafely = (label, task) => {
  try {
    task();
  } catch (error) {
    console.warn(`CarbonSathi: ${label} error`, error);
  }
};

let challengePopupPreviousFocus = null;

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
  runSafely("Theme init", setupTheme);
  runSafely("Language init", setupLanguage);

  setupNavigation();
  setupCalculator();
  setupApiKeyForm();
  setupDynamicActions();

  runSafely("Challenges render", renderChallenges);
  runSafely("Maps render", renderMapsLinks);
  runSafely("Calendar render", renderCalendarLinks);

  runSafely("Assistant init", () => {
    if (DOM.assistantChat) {
      initAssistant(DOM.assistantChat, DOM.assistantForm, DOM.assistantInput);
    }
  });

  renderInitialFootprintState();
};

const renderInitialFootprintState = () => {
  const state = loadState();
  if (state.footprint) {
    runSafely("Dashboard render", () => {
      renderDashboard(state.footprint, DOM.dashboardContainer);
      renderRecommendations(state.footprint);
    });
    navigateTo(getInitialSectionId(true), { updateHash: false });
    return;
  }

  renderEmptyDashboard();
  renderEmptyRecommendations();
  navigateTo(getInitialSectionId(false), { updateHash: false });
};

/**
 * Setup Theme
 */
const setupTheme = () => {
  const state = loadState();
  let theme = state.preferences?.theme || "light";

  const applyTheme = (selectedTheme) => {
    if (selectedTheme === "dark") {
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

    updatePreferences({ theme });
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
  refreshFootprintSections();
  renderChallenges();
  renderMapsLinks();
  renderCalendarLinks();
  refreshAssistantGreeting(DOM.assistantChat);
};

const refreshFootprintSections = () => {
  const state = loadState();

  if (state.footprint) {
    renderDashboard(state.footprint, DOM.dashboardContainer);
    renderRecommendations(state.footprint);
  } else {
    renderEmptyDashboard();
    renderEmptyRecommendations();
  }
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
      return;
    }

    const toastCloseButton = e.target.closest("[data-action='close-toast']");
    if (toastCloseButton) {
      e.preventDefault();
      dismissChallengePopup();
      return;
    }

    const popupOverlay = e.target.closest(
      "[data-action='close-popup-overlay']",
    );
    if (popupOverlay && e.target === popupOverlay) {
      dismissChallengePopup();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.querySelector(".challenge-popup")) {
      dismissChallengePopup();
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

    const result = calculateTotal(buildCalculatorInputs(DOM.calcForm));
    saveFootprintResult(result);

    renderDashboard(result, DOM.dashboardContainer);
    renderRecommendations(result);
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
    count: RECOMMENDATION_COUNT,
  });

  if (recs.length === 0) {
    DOM.recsContainer.innerHTML = `<p>${t("recsPlaceholder")}</p>`;
    return;
  }

  const html = recs
    .map(
      (rec) => `
    <div class="card card--recommendation">
      <h3>${t(`${rec.id}_title`, rec.title)}</h3>
      <p>${t(`${rec.id}_desc`, rec.description)}</p>
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
        <h3>${t(`${ch.id}_title`, ch.title)}</h3>
        <p>${t(`${ch.id}_desc`, ch.description)}</p>
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
    showChallengePopup(result);
    renderChallenges();
    refreshFootprintSections();
  }
};

const createElement = (tagName, className, textContent = "") => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
};

const dismissChallengePopup = () => {
  const popupEl = document.querySelector(".challenge-popup");
  if (!popupEl) return;

  popupEl.classList.add("challenge-popup--leaving");
  const removePopup = () => popupEl.remove();
  popupEl.addEventListener("animationend", removePopup, { once: true });
  window.setTimeout(removePopup, 250);

  if (challengePopupPreviousFocus?.focus) {
    challengePopupPreviousFocus.focus();
  }
  challengePopupPreviousFocus = null;
};

const removeChallengePopups = () => {
  document.querySelectorAll(".challenge-popup").forEach((popupEl) => {
    popupEl.remove();
  });
};

const showChallengePopup = (result) => {
  removeChallengePopups();

  const newlyEarnedBadges = result.newlyEarnedBadges || [];
  const fallbackTitle = t("challengeCompletedAlert").split("!")[0];

  const popupEl = createElement("div", "challenge-popup");
  popupEl.dataset.action = "close-popup-overlay";
  popupEl.setAttribute("role", "dialog");
  popupEl.setAttribute("aria-modal", "true");
  popupEl.setAttribute("aria-labelledby", "challenge-popup-title");
  popupEl.setAttribute("aria-describedby", "challenge-popup-copy");

  const panelEl = createElement("div", "challenge-popup__panel");
  const iconEl = createElement("div", "challenge-popup__icon", "✓");
  iconEl.setAttribute("aria-hidden", "true");

  const titleEl = createElement(
    "h3",
    "challenge-popup__title",
    t("challengeCompletedTitle", fallbackTitle),
  );
  titleEl.id = "challenge-popup-title";

  const copyEl = createElement(
    "p",
    "challenge-popup__copy",
    `${t("challengeCompletedAlert")} ${result.pointsAwarded} ${t("pointsLabel")}.`,
  );
  copyEl.id = "challenge-popup-copy";

  panelEl.append(iconEl, titleEl, copyEl);

  if (newlyEarnedBadges.length > 0) {
    const badgeListEl = createElement("div", "challenge-popup__badge-list");
    badgeListEl.setAttribute("aria-label", t("badgeEarnedAlertPrefix"));

    for (const badge of newlyEarnedBadges) {
      const badgeWrapEl = createElement("div", "challenge-popup__badge-card");
      const badgeImageEl = createElement("img", "challenge-popup__badge-image");
      const badgeName = t(`${badge.id}_name`, badge.name);
      badgeImageEl.src = getBadgeImageSrc(badge);
      badgeImageEl.alt = badgeName;
      badgeImageEl.width = 72;
      badgeImageEl.height = 72;

      const badgeTextEl = createElement(
        "p",
        "challenge-popup__badge",
        `${t("badgeEarnedAlertPrefix")} ${badgeName}`,
      );
      badgeWrapEl.append(badgeImageEl, badgeTextEl);
      badgeListEl.appendChild(badgeWrapEl);
    }

    panelEl.appendChild(badgeListEl);
  }

  const closeButtonEl = createElement(
    "button",
    "btn challenge-popup__button",
    t("challengePopupAction", t("completeBtn", "Continue")),
  );
  closeButtonEl.type = "button";
  closeButtonEl.dataset.action = "close-toast";
  closeButtonEl.setAttribute("aria-label", t("closePopupLabel", "Close popup"));
  panelEl.appendChild(closeButtonEl);

  popupEl.appendChild(panelEl);
  challengePopupPreviousFocus = document.activeElement;
  document.body.appendChild(popupEl);
  closeButtonEl.focus();
};

/**
 * Renders Maps Links
 */
const renderActionLinks = (section) => {
  const config = ACTION_LINK_SECTION_CONFIG[section];
  const containerEl = config?.container();
  if (!containerEl) return;
  const links = config.links();
  const html = links
    .map(
      (link) => `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="card card--link">
      <div class="card__icon">${link.icon}</div>
      <div>
        <h4>${t(`${link.id}_title`, link.label)}</h4>
        <p class="text-small">${t(`${link.id}_desc`, link.description)}</p>
      </div>
    </a>
  `,
    )
    .join("");

  containerEl.innerHTML = html;
};

const renderMapsLinks = () => {
  renderActionLinks("maps");
};

/**
 * Renders Calendar Links
 */
const renderCalendarLinks = () => {
  renderActionLinks("calendar");
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
