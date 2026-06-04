export const MIN_PRINT_IMAGE_WIDTH = 2000;
export const MIN_PRINT_IMAGE_HEIGHT = 2000;

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file);

  try {
    const image = new Image();
    const loaded = new Promise<{ width: number; height: number }>((resolve, reject) => {
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => reject(new Error("Unable to read image dimensions"));
    });

    image.src = url;
    return await loaded;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function validatePrintImageResolution(file: File) {
  const dimensions = await getImageDimensions(file);
  const valid =
    dimensions.width >= MIN_PRINT_IMAGE_WIDTH &&
    dimensions.height >= MIN_PRINT_IMAGE_HEIGHT;

  return { valid, ...dimensions };
}
