import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const indexHtml = readFileSync(join(process.cwd(), "index.html"), "utf8");
const readme = readFileSync(join(process.cwd(), "README.md"), "utf8");

const parser = new DOMParser();
const parsedDocument = parser.parseFromString(indexHtml, "text/html");

describe("Project standards alignment", () => {
  it("uses required semantic landmarks from the quality guide", () => {
    for (const selector of ["header", "nav", "main", "section", "footer"]) {
      expect(parsedDocument.querySelector(selector)).not.toBeNull();
    }
  });

  it("keeps calculator fields labelled and required", () => {
    const controls = [
      ...parsedDocument.querySelectorAll("#calc-form input, #calc-form select"),
    ];

    expect(controls.length).toBeGreaterThan(0);
    for (const control of controls) {
      expect(control.hasAttribute("required")).toBe(true);
      expect(
        parsedDocument.querySelector(`label[for="${control.id}"]`),
      ).not.toBeNull();
    }
  });

  it("keeps external links protected against opener access", () => {
    const externalLinks = [
      ...parsedDocument.querySelectorAll('a[target="_blank"]'),
    ];

    for (const link of externalLinks) {
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("documents implemented gamification and privacy features", () => {
    expect(readme).toContain("Earn badges");
    expect(readme).toContain("Local-first persistence");
    expect(indexHtml).toContain("footerPrivacy");
  });
});
