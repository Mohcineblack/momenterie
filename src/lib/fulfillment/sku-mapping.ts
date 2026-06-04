/**
 * Maps internal ProductVariant attributes to Prodigi SKU strings.
 *
 * Prodigi SKU format:
 *   - Fine Art Paper (Poster): GLOBAL-FAP-{size}
 *   - Framed Print: GLOBAL-FRA-{size}-{frameColor}
 *
 * Supported products: custom-city-map, custom-star-map
 * Supported materials: Poster (Fine Art Paper), Framed
 * Supported sizes: A4, A3, 30x40cm, 50x70cm
 * Supported frame colours (Framed only): black (BLK), white (WHT), oak (OAK)
 */

export interface VariantInput {
  productSlug: string;
  size: string | null;
  material: string | null;
  color: string | null;
}

export interface ProdigiPrintAttributes {
  widthPx: number;
  heightPx: number;
  dpi: number;
  format: "pdf" | "png" | "jpg";
  bleedMm: number;
}

interface SkuEntry {
  prodigiSku: string;
  printAttributes: ProdigiPrintAttributes;
}

/** Prodigi size codes for our internal size labels */
const SIZE_MAP: Record<string, string> = {
  A4: "A4",
  A3: "A3",
  "30x40cm": "30x40",
  "50x70cm": "50x70",
};

/** Frame color codes for Prodigi */
const FRAME_COLOR_MAP: Record<string, string> = {
  black: "BLK",
  white: "WHT",
  oak: "OAK",
};

/**
 * Print dimensions per Prodigi size code (including 3mm bleed on each side).
 * Calculated at 300 DPI.
 */
const PRINT_DIMENSIONS: Record<string, { widthPx: number; heightPx: number }> =
  {
    A4: { widthPx: 2551, heightPx: 3579 }, // (210+6)mm x (297+6)mm at 300dpi
    A3: { widthPx: 3579, heightPx: 5031 }, // (297+6)mm x (420+6)mm at 300dpi
    "30x40": { widthPx: 3614, heightPx: 4795 }, // (300+6)mm x (400+6)mm at 300dpi
    "50x70": { widthPx: 5976, heightPx: 8339 }, // (500+6)mm x (700+6)mm at 300dpi
  };

/** Products eligible for Prodigi fulfillment */
const SUPPORTED_PRODUCTS = new Set(["custom-city-map", "custom-star-map"]);

function makePrintAttributes(
  sizeCode: string
): ProdigiPrintAttributes {
  const dims = PRINT_DIMENSIONS[sizeCode];
  if (!dims) {
    throw new Error(`No print dimensions for size code "${sizeCode}"`);
  }
  return {
    widthPx: dims.widthPx,
    heightPx: dims.heightPx,
    dpi: 300,
    format: "pdf",
    bleedMm: 3,
  };
}

function buildSkuEntry(
  material: string,
  sizeCode: string,
  color: string | null
): SkuEntry {
  const normalMaterial = material.toLowerCase();

  if (normalMaterial === "poster") {
    return {
      prodigiSku: `GLOBAL-FAP-${sizeCode}`,
      printAttributes: makePrintAttributes(sizeCode),
    };
  }

  if (normalMaterial === "framed") {
    const frameColor = color ? color.toLowerCase() : "black";
    const frameCode = FRAME_COLOR_MAP[frameColor];
    if (!frameCode) {
      throw new Error(
        `Unsupported frame color "${color}". Supported: ${Object.keys(FRAME_COLOR_MAP).join(", ")}`
      );
    }
    return {
      prodigiSku: `GLOBAL-FRA-${sizeCode}-${frameCode}`,
      printAttributes: makePrintAttributes(sizeCode),
    };
  }

  throw new Error(
    `Material "${material}" is not mapped to a Prodigi product. Only "Poster" and "Framed" are supported.`
  );
}

/**
 * Resolves a product variant to its Prodigi SKU and associated print attributes.
 *
 * @throws Error if the variant cannot be mapped (unsupported product, material, size, or color)
 */
export function resolveProdigiSku(variant: VariantInput): SkuEntry {
  if (!SUPPORTED_PRODUCTS.has(variant.productSlug)) {
    throw new Error(
      `Product "${variant.productSlug}" is not fulfilled via Prodigi. Supported: ${[...SUPPORTED_PRODUCTS].join(", ")}`
    );
  }

  if (!variant.size) {
    throw new Error("Variant size is required for Prodigi fulfillment");
  }

  if (!variant.material) {
    throw new Error("Variant material is required for Prodigi fulfillment");
  }

  const sizeCode = SIZE_MAP[variant.size];
  if (!sizeCode) {
    throw new Error(
      `Size "${variant.size}" is not mapped to a Prodigi size code. Supported: ${Object.keys(SIZE_MAP).join(", ")}`
    );
  }

  return buildSkuEntry(variant.material, sizeCode, variant.color);
}
