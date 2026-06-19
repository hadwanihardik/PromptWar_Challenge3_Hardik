import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const indexHtml = readFileSync(join(process.cwd(), "index.html"), "utf8");
const appSource = readFileSync(join(process.cwd(), "assets/js/app.js"), "utf8");

describe("Security hardening", () => {
  it("ships a restrictive Content Security Policy", () => {
    expect(indexHtml).toContain("Content-Security-Policy");
    expect(indexHtml).toContain("default-src 'self'");
    expect(indexHtml).toContain("script-src 'self'");
    expect(indexHtml).toContain(
      "connect-src 'self' https://generativelanguage.googleapis.com",
    );
    expect(indexHtml).toContain("object-src 'none'");
    expect(indexHtml).toContain("base-uri 'self'");
    expect(indexHtml).toContain("frame-ancestors 'none'");
    expect(indexHtml).not.toContain("upgrade-insecure-requests");
  });

  it("keeps interaction wiring out of inline handlers", () => {
    const inlineHandlerPattern = /\son[a-z]+\s*=\s*["']/i;

    expect(indexHtml).not.toMatch(inlineHandlerPattern);
    expect(appSource).not.toMatch(inlineHandlerPattern);
  });
});
