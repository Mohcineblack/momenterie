import sharp from "sharp";
import { getPrintBox, type PhotoprintSpec, type PuzzleSpec } from "@/lib/render/spec";
import { svgToPdfBuffer, type RenderedPdf } from "@/lib/render/pdf";
import { MIN_PRINT_IMAGE_HEIGHT, MIN_PRINT_IMAGE_WIDTH } from "@/lib/image-validation";

export async function renderPhotoprintPdf(spec: PhotoprintSpec): Promise<RenderedPdf> {
  return renderImagePdf(spec.imageUrl, spec.size);
}

export async function renderPuzzlePdf(spec: PuzzleSpec): Promise<RenderedPdf> {
  return renderImagePdf(spec.imageUrl, spec.size);
}

async function renderImagePdf(imageUrl: string, size: PhotoprintSpec["size"]): Promise<RenderedPdf> {
  const box = getPrintBox(size);
  const input = await loadImage(imageUrl);
  const metadata = await sharp(input).metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (width < MIN_PRINT_IMAGE_WIDTH || height < MIN_PRINT_IMAGE_HEIGHT) {
    throw new Error(
      `Image resolution ${width}x${height}px is below the ${MIN_PRINT_IMAGE_WIDTH}x${MIN_PRINT_IMAGE_HEIGHT}px print minimum`
    );
  }

  const jpeg = await sharp(input)
    .resize(box.widthPx, box.heightPx, { fit: "cover", position: "centre" })
    .jpeg({ quality: 95 })
    .toBuffer();
  const dataUri = `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${box.widthPx}" height="${box.heightPx}" viewBox="0 0 ${box.widthPx} ${box.heightPx}"><image href="${dataUri}" x="0" y="0" width="${box.widthPx}" height="${box.heightPx}" preserveAspectRatio="xMidYMid slice"/></svg>`;

  return svgToPdfBuffer(svg, size);
}

async function loadImage(imageUrl: string) {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  return imageUrl;
}
