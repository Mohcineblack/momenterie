import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";

describe("payment lifecycle invariant", () => {
  it("only the Stripe webhook writes paymentStatus PAID", () => {
    const srcRoot = path.join(process.cwd(), "src");
    const matches: string[] = [];

    walk(srcRoot).forEach((file) => {
      const source = readFileSync(file, "utf8");
      if (/paymentStatus\s*:\s*["']PAID["']/.test(source) && /prisma\.order\.update/.test(source)) {
        matches.push(path.relative(process.cwd(), file).replace(/\\/g, "/"));
      }
    });

    expect(matches).toEqual(["src/app/api/webhooks/stripe/route.ts"]);
  });
});

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === "__tests__") return [];
      return walk(full);
    }
    return full.endsWith(".ts") || full.endsWith(".tsx") ? [full] : [];
  });
}
