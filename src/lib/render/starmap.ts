import { svgToPdfBuffer, type RenderedPdf } from "@/lib/render/pdf";
import type { StarmapSpec } from "@/lib/render/spec";
import { renderStarmapArtworkSvg } from "@/lib/render/starmap-artwork";

export async function renderStarmapPdf(spec: StarmapSpec): Promise<RenderedPdf> {
  const svg = renderStarmapSvg(spec);
  return svgToPdfBuffer(svg, spec.size);
}

export function renderStarmapSvg(spec: StarmapSpec): string {
  return renderStarmapArtworkSvg(spec);
}

export { renderStarmapArtworkSvg };
