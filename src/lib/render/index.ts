import { renderCitymapPdf } from "@/lib/render/citymap";
import { renderPhotoprintPdf, renderPuzzlePdf } from "@/lib/render/photo";
import { svgToPdfBuffer } from "@/lib/render/pdf";
import { parseRenderSpec, type RenderSpec } from "@/lib/render/spec";
import { renderStarmapPdf } from "@/lib/render/starmap";

export async function renderProductionPdf(customizationData: unknown) {
  const spec = parseRenderSpec(customizationData);

  switch (spec.productType) {
    case "citymap":
      return renderCitymapPdf(spec);
    case "starmap":
      return renderStarmapPdf(spec);
    case "puzzle":
      return renderPuzzlePdf(spec);
    case "photoprint":
      return renderPhotoprintPdf(spec);
    case "dateprint":
      return renderTemplatePdf(spec, "dateprint");
    case "jewelry":
      return renderTemplatePdf(spec, "jewelry");
  }
}

function renderTemplatePdf(spec: Extract<RenderSpec, { productType: "dateprint" | "jewelry" }>, label: string) {
  const size = spec.productType === "dateprint" ? spec.size : "A4";
  const title = spec.productType === "dateprint" ? spec.title : `${spec.material} ${spec.chainLength}`;
  const subtitle = spec.productType === "dateprint" ? spec.subtitle : spec.date;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2480" height="3508" viewBox="0 0 2480 3508"><rect width="2480" height="3508" fill="#fff"/><text x="1240" y="1500" text-anchor="middle" font-family="Georgia" font-size="150" fill="#111">${escapeXml(title || label)}</text><text x="1240" y="1720" text-anchor="middle" font-family="Arial" font-size="72" fill="#555">${escapeXml(subtitle || "")}</text></svg>`;
  return svgToPdfBuffer(svg, size);
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  }[char] ?? char));
}

