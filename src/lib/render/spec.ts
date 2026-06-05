import { z } from "zod";

export const PRINT_DPI = 300;
export const PRINT_BLEED_MM = 3;

export const PRINT_TARGETS = {
  dpi: PRINT_DPI,
  bleedMm: PRINT_BLEED_MM,
  color: {
    source: "sRGB",
    productionNote:
      "Production files are authored from sRGB inputs and should be converted to CMYK with the print partner ICC profile, e.g. FOGRA39, before press.",
  },
  trimSizes: {
    A4: { widthMm: 210, heightMm: 297 },
    A3: { widthMm: 297, heightMm: 420 },
    "30x40": { widthMm: 300, heightMm: 400 },
    "45x60": { widthMm: 450, heightMm: 600 },
    "50x70": { widthMm: 500, heightMm: 700 },
    "60x80": { widthMm: 600, heightMm: 800 },
  },
} as const;

export type PrintSizeId = keyof typeof PRINT_TARGETS.trimSizes;

export function getPrintBox(size: PrintSizeId) {
  const trim = PRINT_TARGETS.trimSizes[size];
  const bleed = PRINT_TARGETS.bleedMm;

  return {
    trim,
    bleedMm: bleed,
    widthMm: trim.widthMm + bleed * 2,
    heightMm: trim.heightMm + bleed * 2,
    widthPx: mmToPixels(trim.widthMm + bleed * 2),
    heightPx: mmToPixels(trim.heightMm + bleed * 2),
  };
}

export function mmToPixels(mm: number) {
  return Math.round((mm / 25.4) * PRINT_DPI);
}

export function mmToPoints(mm: number) {
  return (mm / 25.4) * 72;
}

const printSizeSchema = z.enum(["A4", "A3", "30x40", "45x60", "50x70", "60x80"]);

const markerSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  label: z.string().optional(),
  icon: z.string().optional(),
  photoUrl: z.string().url().optional(),
});

export const citymapSpecSchema = z.object({
  productType: z.literal("citymap").default("citymap"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    placeName: z.string(),
  }),
  zoom: z.number().min(1).max(20).default(13),
  bearing: z.number().default(0),
  mapStyleId: z.string().default("leon"),
  title: z.string().default(""),
  subtitle: z.string().default(""),
  date: z.string().default(""),
  showCoordinates: z.boolean().default(true),
  markers: z.array(markerSchema).default([]),
  photoUrls: z.array(z.string().url()).default([]),
  size: printSizeSchema.default("30x40"),
  material: z.string().default("poster"),
});

export const starmapSpecSchema = z.object({
  productType: z.literal("starmap").default("starmap"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    placeName: z.string(),
  }),
  datetimeUtc: z.string().datetime(),
  title: z.string().default(""),
  subtitle: z.string().default(""),
  styleId: z.string().default("classic"),
  showConstellations: z.boolean().default(true),
  showGrid: z.boolean().default(false),
  showMilkyWay: z.boolean().default(true),
  magnitudeLimit: z.number().min(-2).max(7).default(6.5),
  size: printSizeSchema.default("30x40"),
  material: z.string().default("poster"),
  foilColour: z.string().optional(),
});

export const puzzleSpecSchema = z.object({
  productType: z.literal("puzzle").default("puzzle"),
  imageUrl: z.string().min(1),
  crop: z.object({
    x: z.number().min(0).max(1).default(0.5),
    y: z.number().min(0).max(1).default(0.5),
    scale: z.number().positive().default(1),
  }).default({}),
  pieces: z.number().int().positive().default(500),
  finish: z.enum(["glossy", "matte"]).default("glossy"),
  size: printSizeSchema.default("30x40"),
});

export const photoprintSpecSchema = z.object({
  productType: z.literal("photoprint").default("photoprint"),
  imageUrl: z.string().min(1),
  crop: z.object({
    x: z.number().min(0).max(1).default(0.5),
    y: z.number().min(0).max(1).default(0.5),
    scale: z.number().positive().default(1),
  }).default({}),
  frame: z.enum(["none", "black", "white", "oak"]).default("none"),
  size: printSizeSchema.default("30x40"),
});

export const dateprintSpecSchema = z.object({
  productType: z.literal("dateprint").default("dateprint"),
  date: z.string(),
  title: z.string().default(""),
  subtitle: z.string().default(""),
  styleId: z.string().default("minimal-black"),
  size: printSizeSchema.default("30x40"),
});

export const jewelrySpecSchema = z.object({
  productType: z.literal("jewelry").default("jewelry"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    placeName: z.string().default(""),
  }),
  date: z.string(),
  material: z.enum(["gold", "silver", "rose-gold"]).default("gold"),
  chainLength: z.string().default("45cm"),
});

export const renderSpecSchema = z.discriminatedUnion("productType", [
  citymapSpecSchema,
  starmapSpecSchema,
  puzzleSpecSchema,
  photoprintSpecSchema,
  dateprintSpecSchema,
  jewelrySpecSchema,
]);

export type CitymapSpec = z.infer<typeof citymapSpecSchema>;
export type StarmapSpec = z.infer<typeof starmapSpecSchema>;
export type PuzzleSpec = z.infer<typeof puzzleSpecSchema>;
export type PhotoprintSpec = z.infer<typeof photoprintSpecSchema>;
export type DateprintSpec = z.infer<typeof dateprintSpecSchema>;
export type JewelrySpec = z.infer<typeof jewelrySpecSchema>;
export type RenderSpec = z.infer<typeof renderSpecSchema>;

export function parseRenderSpec(value: unknown): RenderSpec {
  return renderSpecSchema.parse(value);
}

