/**
 * dashboard.js
 * Logic for rendering the CarbonSathi dashboard.
 * Separated from app.js to keep concerns modular.
 */

import { getEcoProfile } from "./recommendations.js";
import { t } from "./i18n.js";
import { loadState } from "./storage.js";
import BADGES from "./data/badges.js";

const TOP_CATEGORY_REDUCTION_RATE = 0.1;
const PETROL_CAR_KG_CO2_PER_KM = 0.192;
const DEFAULT_BADGE_COLOR = "#1f9d55";
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

const escapeSvgText = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
};

const getBadgeImageSrc = (badge) => {
  const badgeColor = HEX_COLOR_PATTERN.test(badge.color)
    ? badge.color
    : DEFAULT_BADGE_COLOR;
  const badgeIcon = escapeSvgText(badge.icon);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112" role="img">
      <defs>
        <radialGradient id="shine" cx="35%" cy="25%" r="70%">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/>
          <stop offset="0.45" stop-color="${badgeColor}" stop-opacity="0.95"/>
          <stop offset="1" stop-color="${badgeColor}" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <circle cx="56" cy="56" r="50" fill="url(#shine)" stroke="#ffffff" stroke-width="6"/>
      <circle cx="56" cy="56" r="40" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="3"/>
      <text x="56" y="68" text-anchor="middle" font-size="36" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif">${badgeIcon}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const getDashboardInsights = (footprint) => {
  const topValue = footprint.categories[footprint.topCategory] || 0;
  const monthlySavingKg = topValue * TOP_CATEGORY_REDUCTION_RATE;
  const yearlySavingKg = monthlySavingKg * 12;
  const equivalentCarKm = Math.round(yearlySavingKg / PETROL_CAR_KG_CO2_PER_KM);

  return {
    monthlySavingKg,
    yearlySavingKg,
    equivalentCarKm,
    nextActionKey: `nextAction_${footprint.topCategory}`,
  };
};

const getEarnedBadges = () => {
  const state = loadState();
  const earnedBadgeIds = new Set(state.earnedBadges || []);
  return BADGES.filter((badge) => earnedBadgeIds.has(badge.id));
};

const renderBadges = () => {
  const earnedBadges = getEarnedBadges();
  const badgeCountLabel = t("badgesEarnedCount", "earned");

  if (earnedBadges.length === 0) {
    return `
      <section class="dashboard__card dashboard__badges" aria-labelledby="dashboard-badges-title">
        <div class="dashboard__section-header">
          <div>
            <h3 id="dashboard-badges-title">${t("badgesTitle", "Earned Badges")}</h3>
            <p class="dashboard__section-copy">${t("badgesEmpty", "Complete eco challenges to unlock badge images here.")}</p>
          </div>
        </div>
      </section>
    `;
  }

  const badgesHTML = earnedBadges
    .map((badge) => {
      const badgeName = t(`${badge.id}_name`, badge.name);
      const badgeDescription = t(`${badge.id}_desc`, badge.description);

      return `
        <article class="badge-card">
          <img class="badge-card__image" src="${getBadgeImageSrc(badge)}" alt="${badgeName}" width="72" height="72" loading="lazy" />
          <div class="badge-card__body">
            <h4 class="badge-card__title">${badgeName}</h4>
            <p class="badge-card__copy">${badgeDescription}</p>
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="dashboard__card dashboard__badges" aria-labelledby="dashboard-badges-title">
      <div class="dashboard__section-header">
        <div>
          <h3 id="dashboard-badges-title">${t("badgesTitle", "Earned Badges")}</h3>
          <p class="dashboard__section-copy">${earnedBadges.length} ${badgeCountLabel}</p>
        </div>
      </div>
      <div class="badge-gallery">
        ${badgesHTML}
      </div>
    </section>
  `;
};

/**
 * Renders the dashboard UI with the given footprint result.
 * @param {Object} footprint - Footprint result object
 * @param {HTMLElement} containerEl - The DOM element to render into
 */
const renderDashboard = (footprint, containerEl) => {
  if (!footprint || !containerEl) return;

  const { monthlyTotal, yearlyTotal, ecoScore, categories, topCategory } =
    footprint;
  const profile = getEcoProfile(topCategory);
  const insights = getDashboardInsights(footprint);

  // Clear container
  containerEl.innerHTML = "";

  // 1. Header with Score & Totals
  const headerHTML = `
    <div class="dashboard__summary">
      <div class="dashboard__card dashboard__card--primary">
        <h3>${t("dashMonthly")}</h3>
        <p class="dashboard__value">${Math.round(monthlyTotal)} <span class="dashboard__unit">kg CO₂e</span></p>
        <p class="dashboard__subtext">${t("dashYearly")}: ${Math.round(yearlyTotal)} kg</p>
      </div>
      <div class="dashboard__card">
        <h3>${t("dashEcoScore")}</h3>
        <div class="dashboard__score-circle" style="background: conic-gradient(var(--color-primary) ${ecoScore}%, #e0e0e0 0);">
          <span>${ecoScore}/100</span>
        </div>
      </div>
    </div>
  `;

  // 2. Profile insights
  const profileLabel = t(`profile_${topCategory}_label`, profile.label);
  const profileDesc = t(`profile_${topCategory}_desc`, profile.description);
  const profileHTML = `
    <div class="dashboard__profile">
      <h3>${t("profileTitle")}: ${profile.icon} ${profileLabel}</h3>
      <p>${profileDesc}</p>
    </div>
  `;

  const insightsHTML = `
    <div class="dashboard__insights">
      <div class="dashboard__card dashboard__insight">
        <span class="dashboard__insight-kicker">${t("bestNextAction")}</span>
        <p class="dashboard__insight-value">${t(insights.nextActionKey)}</p>
        <p class="dashboard__insight-copy">${t("bestNextActionHint")}</p>
      </div>
      <div class="dashboard__card dashboard__insight">
        <span class="dashboard__insight-kicker">${t("whatIfTitle")}</span>
        <p class="dashboard__insight-value">${Math.round(insights.yearlySavingKg)} kg</p>
        <p class="dashboard__insight-copy">
          ${t("whatIfCopy")} ${insights.equivalentCarKm} ${t("carKmEquivalent")}
        </p>
      </div>
    </div>
  `;

  // 3. Category Breakdown (CSS Bar Chart)
  const maxCategory = Math.max(...Object.values(categories));
  let barsHTML = '<div class="dashboard__bars">';

  for (const [cat, val] of Object.entries(categories)) {
    const percentage = maxCategory > 0 ? (val / maxCategory) * 100 : 0;
    const catLabel = t(cat, cat.charAt(0).toUpperCase() + cat.slice(1));
    barsHTML += `
      <div class="dashboard__bar-row">
        <span class="dashboard__bar-label">${catLabel}</span>
        <div class="dashboard__bar-track">
          <div class="dashboard__bar-fill ${cat === topCategory ? "dashboard__bar-fill--highlight" : ""}" style="width: ${percentage}%"></div>
        </div>
        <span class="dashboard__bar-value">${Math.round(val)} kg</span>
      </div>
    `;
  }
  barsHTML += "</div>";

  containerEl.innerHTML = `
    ${headerHTML}
    ${insightsHTML}
    ${profileHTML}
    ${renderBadges()}
    <div class="dashboard__card">
      <h3>${t("dashCategoryTitle")}</h3>
      ${barsHTML}
    </div>
  `;
};

export { renderDashboard, getDashboardInsights, getBadgeImageSrc };
