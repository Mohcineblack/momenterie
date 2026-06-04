import { resolveProdigiSku, VariantInput } from "../sku-mapping";

describe("resolveProdigiSku", () => {
  describe("citymap Poster variants", () => {
    const cases: Array<{ size: string; expectedSku: string }> = [
      { size: "A4", expectedSku: "GLOBAL-FAP-A4" },
      { size: "A3", expectedSku: "GLOBAL-FAP-A3" },
      { size: "30x40cm", expectedSku: "GLOBAL-FAP-30x40" },
      { size: "50x70cm", expectedSku: "GLOBAL-FAP-50x70" },
    ];

    it.each(cases)(
      "resolves CM $size Poster to $expectedSku",
      ({ size, expectedSku }) => {
        const variant: VariantInput = {
          productSlug: "custom-city-map",
          size,
          material: "Poster",
          color: null,
        };
        const result = resolveProdigiSku(variant);
        expect(result.prodigiSku).toBe(expectedSku);
        expect(result.printAttributes.dpi).toBe(300);
        expect(result.printAttributes.bleedMm).toBe(3);
        expect(result.printAttributes.format).toBe("pdf");
        expect(result.printAttributes.widthPx).toBeGreaterThan(0);
        expect(result.printAttributes.heightPx).toBeGreaterThan(0);
      }
    );
  });

  describe("citymap Framed variants", () => {
    const cases: Array<{
      size: string;
      color: string;
      expectedSku: string;
    }> = [
      { size: "A4", color: "black", expectedSku: "GLOBAL-FRA-A4-BLK" },
      { size: "A3", color: "white", expectedSku: "GLOBAL-FRA-A3-WHT" },
      { size: "30x40cm", color: "oak", expectedSku: "GLOBAL-FRA-30x40-OAK" },
      { size: "50x70cm", color: "black", expectedSku: "GLOBAL-FRA-50x70-BLK" },
    ];

    it.each(cases)(
      "resolves CM $size Framed $color to $expectedSku",
      ({ size, color, expectedSku }) => {
        const variant: VariantInput = {
          productSlug: "custom-city-map",
          size,
          material: "Framed",
          color,
        };
        const result = resolveProdigiSku(variant);
        expect(result.prodigiSku).toBe(expectedSku);
      }
    );

    it("defaults to black frame when color is null", () => {
      const variant: VariantInput = {
        productSlug: "custom-city-map",
        size: "A4",
        material: "Framed",
        color: null,
      };
      const result = resolveProdigiSku(variant);
      expect(result.prodigiSku).toBe("GLOBAL-FRA-A4-BLK");
    });
  });

  describe("starmap Poster variants", () => {
    const cases: Array<{ size: string; expectedSku: string }> = [
      { size: "A4", expectedSku: "GLOBAL-FAP-A4" },
      { size: "A3", expectedSku: "GLOBAL-FAP-A3" },
      { size: "30x40cm", expectedSku: "GLOBAL-FAP-30x40" },
      { size: "50x70cm", expectedSku: "GLOBAL-FAP-50x70" },
    ];

    it.each(cases)(
      "resolves SM $size Poster to $expectedSku",
      ({ size, expectedSku }) => {
        const variant: VariantInput = {
          productSlug: "custom-star-map",
          size,
          material: "Poster",
          color: null,
        };
        const result = resolveProdigiSku(variant);
        expect(result.prodigiSku).toBe(expectedSku);
      }
    );
  });

  describe("starmap Framed variants", () => {
    it("resolves SM A4 Framed black", () => {
      const variant: VariantInput = {
        productSlug: "custom-star-map",
        size: "A4",
        material: "Framed",
        color: "black",
      };
      const result = resolveProdigiSku(variant);
      expect(result.prodigiSku).toBe("GLOBAL-FRA-A4-BLK");
    });

    it("resolves SM A3 Framed white", () => {
      const variant: VariantInput = {
        productSlug: "custom-star-map",
        size: "A3",
        material: "Framed",
        color: "white",
      };
      const result = resolveProdigiSku(variant);
      expect(result.prodigiSku).toBe("GLOBAL-FRA-A3-WHT");
    });
  });

  describe("unmapped variants throw clear errors", () => {
    it("throws for unsupported product (puzzle)", () => {
      const variant: VariantInput = {
        productSlug: "photo-puzzle",
        size: "30x40cm",
        material: "Poster",
        color: null,
      };
      expect(() => resolveProdigiSku(variant)).toThrow(
        /not fulfilled via Prodigi/
      );
    });

    it("throws for unsupported product (jewelry)", () => {
      const variant: VariantInput = {
        productSlug: "star-map-necklace",
        size: null,
        material: "Gold",
        color: null,
      };
      expect(() => resolveProdigiSku(variant)).toThrow(
        /not fulfilled via Prodigi/
      );
    });

    it("throws for Canvas material", () => {
      const variant: VariantInput = {
        productSlug: "custom-city-map",
        size: "30x40cm",
        material: "Canvas",
        color: null,
      };
      expect(() => resolveProdigiSku(variant)).toThrow(
        /not mapped to a Prodigi product/
      );
    });

    it("throws for Gold Foil material", () => {
      const variant: VariantInput = {
        productSlug: "custom-star-map",
        size: "A4",
        material: "Gold Foil",
        color: null,
      };
      expect(() => resolveProdigiSku(variant)).toThrow(
        /not mapped to a Prodigi product/
      );
    });

    it("throws for unsupported size", () => {
      const variant: VariantInput = {
        productSlug: "custom-city-map",
        size: "60x80cm",
        material: "Poster",
        color: null,
      };
      expect(() => resolveProdigiSku(variant)).toThrow(
        /not mapped to a Prodigi size code/
      );
    });

    it("throws for null size", () => {
      const variant: VariantInput = {
        productSlug: "custom-city-map",
        size: null,
        material: "Poster",
        color: null,
      };
      expect(() => resolveProdigiSku(variant)).toThrow(
        /size is required/
      );
    });

    it("throws for null material", () => {
      const variant: VariantInput = {
        productSlug: "custom-city-map",
        size: "A4",
        material: null,
        color: null,
      };
      expect(() => resolveProdigiSku(variant)).toThrow(
        /material is required/
      );
    });

    it("throws for unsupported frame color", () => {
      const variant: VariantInput = {
        productSlug: "custom-city-map",
        size: "A4",
        material: "Framed",
        color: "pink",
      };
      expect(() => resolveProdigiSku(variant)).toThrow(
        /Unsupported frame color/
      );
    });
  });
});
