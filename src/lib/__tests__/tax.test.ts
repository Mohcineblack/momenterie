import { calculateTax, DESTINATION_VAT_RATES } from "@/lib/utils";

describe("destination VAT", () => {
  it.each([
    ["NL", 2100],
    ["IT", 2200],
    ["BE", 2100],
    ["DE", 1900],
    ["FR", 2000],
    ["AT", 2000],
  ])("calculates %s VAT by destination", (country, expectedTax) => {
    expect(calculateTax(10000, country)).toBe(expectedTax);
  });

  it("normalizes lowercase country codes", () => {
    expect(calculateTax(10000, "nl")).toBe(2100);
  });

  it("keeps the served-market VAT table explicit", () => {
    expect(DESTINATION_VAT_RATES).toMatchObject({
      NL: 0.21,
      IT: 0.22,
      BE: 0.21,
      DE: 0.19,
      FR: 0.20,
      AT: 0.20,
    });
  });
});
