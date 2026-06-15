/**
 * dashboard.js
 * Logic for rendering the CarbonSathi dashboard.
 * Separated from app.js to keep concerns modular.
 */

import { getEcoProfile } from "./recommendations.js";
import { t } from "./i18n.js";

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
  const profileLabel = t("profile_" + topCategory + "_label", profile.label);
  const profileDesc = t(
    "profile_" + topCategory + "_desc",
    profile.description,
  );
  const profileHTML = `
    <div class="dashboard__profile">
      <h3>${t("profileTitle")}: ${profile.icon} ${profileLabel}</h3>
      <p>${profileDesc}</p>
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
    ${profileHTML}
    <div class="dashboard__card">
      <h3>${t("dashCategoryTitle")}</h3>
      ${barsHTML}
    </div>
  `;
};

export { renderDashboard };
