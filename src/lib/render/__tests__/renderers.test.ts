import { renderCitymapPdf } from "@/lib/render/citymap";
import { renderStarmapPdf } from "@/lib/render/starmap";

describe("production renderers", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockRejectedValue(new Error("offline"));
  });

  it("renders a citymap PDF with trim size plus 3mm bleed at 300 DPI", async () => {
    const pdf = await renderCitymapPdf({
      productType: "citymap",
      location: { lat: 48.8566, lng: 2.3522, placeName: "Paris" },
      zoom: 13,
      bearing: 0,
      mapStyleId: "classic",
      title: "Paris",
      subtitle: "Where it started",
      date: "June 3, 2026",
      showCoordinates: true,
      markers: [],
      photoUrls: [],
      size: "30x40",
      material: "poster",
    });

    expect(pdf.dpi).toBe(300);
    expect(Math.round(pdf.widthMm)).toBe(306);
    expect(Math.round(pdf.heightMm)).toBe(406);
    expect(pdf.buffer.subarray(0, 4).toString()).toBe("%PDF");
  });

  it("renders a starmap PDF with trim size plus 3mm bleed at 300 DPI", async () => {
    const pdf = await renderStarmapPdf({
      productType: "starmap",
      location: { lat: 48.8566, lng: 2.3522, placeName: "Paris" },
      datetimeUtc: "2026-06-03T21:00:00.000Z",
      title: "Our Stars",
      subtitle: "Paris",
      styleId: "classic",
      showConstellations: true,
      showGrid: true,
      showMilkyWay: true,
      magnitudeLimit: 6.5,
      size: "30x40",
      material: "poster",
    });

    expect(pdf.dpi).toBe(300);
    expect(Math.round(pdf.widthMm)).toBe(306);
    expect(Math.round(pdf.heightMm)).toBe(406);
    expect(pdf.buffer.subarray(0, 4).toString()).toBe("%PDF");
  });
});
