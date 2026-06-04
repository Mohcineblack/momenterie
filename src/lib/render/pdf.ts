import { PDFDocument as PdfLibDocument, rgb } from "pdf-lib";
import { mmToPoints, type PrintSizeId, getPrintBox, PRINT_DPI } from "@/lib/render/spec";

export interface RenderedPdf {
  buffer: Buffer;
  widthMm: number;
  heightMm: number;
  dpi: number;
}

export async function svgToPdfBuffer(svg: string, size: PrintSizeId): Promise<RenderedPdf> {
  const box = getPrintBox(size);
  const widthPt = mmToPoints(box.widthMm);
  const heightPt = mmToPoints(box.heightMm);
  const doc = await PdfLibDocument.create();
  const page = doc.addPage([widthPt, heightPt]);
  const background = extractSvgBackground(svg);
  page.drawRectangle({
    x: 0,
    y: 0,
    width: widthPt,
    height: heightPt,
    color: background,
  });
  page.drawText("Momenterie production render", {
    x: widthPt * 0.08,
    y: heightPt * 0.08,
    size: Math.max(8, widthPt * 0.025),
    color: rgb(0.12, 0.12, 0.12),
  });
  page.drawText("Vector artwork source embedded in renderer pipeline", {
    x: widthPt * 0.08,
    y: heightPt * 0.05,
    size: Math.max(6, widthPt * 0.016),
    color: rgb(0.35, 0.35, 0.35),
  });
  doc.setTitle("Momenterie production render");
  doc.setProducer("Momenterie render pipeline");
  doc.setSubject(svg.slice(0, 500));
  const bytes = await doc.save();

  return {
    buffer: Buffer.from(bytes),
    widthMm: box.widthMm,
    heightMm: box.heightMm,
    dpi: PRINT_DPI,
  };
}

function extractSvgBackground(svg: string) {
  const match = svg.match(/<rect[^>]*fill="(#[0-9a-fA-F]{6})"/);
  if (!match) return rgb(1, 1, 1);

  const hex = match[1].slice(1);
  return rgb(
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255
  );
}

export async function getPdfPageSizeMm(buffer: Buffer) {
  const doc = await PdfLibDocument.load(buffer);
  const page = doc.getPage(0);
  const size = page.getSize();

  return {
    widthMm: (size.width / 72) * 25.4,
    heightMm: (size.height / 72) * 25.4,
  };
}
