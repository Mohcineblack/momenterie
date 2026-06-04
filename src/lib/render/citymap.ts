import { renderCitymapArtworkSvg } from "@/lib/render/citymap-artwork";
import { svgToPdfBuffer, type RenderedPdf } from "@/lib/render/pdf";
import type { CitymapSpec } from "@/lib/render/spec";

export async function renderCitymapPdf(spec: CitymapSpec): Promise<RenderedPdf> {
  const svg = await renderCitymapSvg(spec);
  return svgToPdfBuffer(svg, spec.size);
}

export function renderCitymapSvg(spec: CitymapSpec): Promise<string> {
  return renderCitymapArtworkSvg(spec);
}

export { renderCitymapArtworkSvg };
