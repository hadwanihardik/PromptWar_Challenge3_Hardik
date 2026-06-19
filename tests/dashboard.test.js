import { describe, it, expect, beforeEach } from "vitest";
import {
  getBadgeImageSrc,
  getDashboardInsights,
  renderDashboard,
} from "../assets/js/dashboard.js";
import { setLanguage } from "../assets/js/i18n.js";
import { updateStateKey } from "../assets/js/storage.js";

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
    localStorage.clear();
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

  it("shows earned badges with badge images on the dashboard", () => {
    updateStateKey("earnedBadges", ["badge_first_step"]);
    const container = document.createElement("div");

    renderDashboard(footprint, container);

    const badgeImage = container.querySelector(".badge-card__image");
    expect(container.textContent).toContain("Earned Badges");
    expect(container.textContent).toContain("First Step");
    expect(badgeImage).not.toBeNull();
    expect(badgeImage.getAttribute("src")).toContain("data:image/svg+xml");
    expect(badgeImage.getAttribute("alt")).toBe("First Step");
  });

  it("sanitizes generated badge SVG image data", () => {
    const src = getBadgeImageSrc({
      color: "not-a-hex-color",
      icon: "<script>",
    });
    const decoded = decodeURIComponent(src);

    expect(decoded).toContain("#1f9d55");
    expect(decoded).toContain("&lt;script&gt;");
    expect(decoded).not.toContain("not-a-hex-color");
  });
});
