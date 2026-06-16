import { describe, it, expect, beforeEach } from "vitest";
import {
  getDashboardInsights,
  renderDashboard,
} from "../assets/js/dashboard.js";
import { setLanguage } from "../assets/js/i18n.js";

const footprint = {
  monthlyTotal: 578,
  yearlyTotal: 6936,
  ecoScore: 42,
  topCategory: "energy",
  categories: {
    transport: 135,
    energy: 262,
    food: 100,
    shopping: 60,
    waste: 20,
  },
};

describe("Dashboard insight rendering", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    setLanguage("en", false);
  });

  it("calculates a 10% top-category reduction scenario", () => {
    const insights = getDashboardInsights(footprint);

    expect(insights.monthlySavingKg).toBeCloseTo(26.2);
    expect(insights.yearlySavingKg).toBeCloseTo(314.4);
    expect(insights.equivalentCarKm).toBe(1638);
    expect(insights.nextActionKey).toBe("nextAction_energy");
  });

  it("shows best next action and what-if savings on the dashboard", () => {
    const container = document.createElement("div");
    renderDashboard(footprint, container);

    expect(container.textContent).toContain("Best next action");
    expect(container.textContent).toContain(
      "Set AC to 24°C and unplug standby devices",
    );
    expect(container.textContent).toContain(
      "What if you cut your top category by 10%?",
    );
    expect(container.textContent).toContain("314 kg");
  });
});
