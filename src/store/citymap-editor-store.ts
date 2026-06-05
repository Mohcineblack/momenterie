import { create } from "zustand";
import {
  EMapStyle,
  EFont,
  EMarkerType,
  EMarkerIcon,
  EMarkerSize,
  EMarkerColorLayer,
  EShapeOverlay,
  EPosterPadding,
  EGradientOverlay,
  ETextLayout,
  ETextVariant,
  EPrintType,
  EPrintSize,
  EFrameColor,
  MARKER_COLORS,
} from "@/lib/citymap/citymap-model";

export interface EditorLocation {
  lat: number;
  lng: number;
  placeName: string;
}

export interface CitymapMarker {
  id: string;
  type: EMarkerType;
  /** lat/lng of the marker on the map */
  lat: number;
  lng: number;
  /** optional label text shown near the marker */
  text: string;
  // icon markers
  icon: EMarkerIcon;
  size: EMarkerSize;
  color: string; // hex without leading #
  colorLayer: EMarkerColorLayer;
  // photo markers
  photoUrl: string | null;
  markerIndex: number;
}

export interface CitymapEditorState {
  // --- Location / viewport ---
  location: EditorLocation | null;
  zoom: number;

  // --- Style ---
  mapStyle: EMapStyle;

  // --- Text ---
  headline: string;
  subheadline: string;
  tagline: string;
  dedication: string;
  textLayout: ETextLayout;
  textVariant: ETextVariant;
  font: EFont;
  showCoordinates: boolean;

  // --- Markers ---
  markers: CitymapMarker[];
  selectedMarkerId: string | null;

  // --- Overlays / framing ---
  shapeOverlay: EShapeOverlay;
  posterPadding: EPosterPadding;
  showOutline: boolean;
  gradientOverlay: EGradientOverlay;

  // --- Product ---
  printType: EPrintType;
  printSize: EPrintSize;
  frameColor: EFrameColor;

  // --- Actions: location/viewport ---
  setLocation: (location: EditorLocation) => void;
  setZoom: (zoom: number) => void;

  // --- Actions: style ---
  setMapStyle: (style: EMapStyle) => void;

  // --- Actions: text ---
  setHeadline: (v: string) => void;
  setSubheadline: (v: string) => void;
  setTagline: (v: string) => void;
  setDedication: (v: string) => void;
  setTextLayout: (v: ETextLayout) => void;
  setTextVariant: (v: ETextVariant) => void;
  setFont: (v: EFont) => void;
  setShowCoordinates: (v: boolean) => void;

  // --- Actions: markers ---
  addMarker: (partial?: Partial<CitymapMarker>) => void;
  addPhotoMarker: (photoUrl: string, partial?: Partial<CitymapMarker>) => void;
  updateMarker: (id: string, patch: Partial<CitymapMarker>) => void;
  removeMarker: (id: string) => void;
  selectMarker: (id: string | null) => void;

  // --- Actions: overlays ---
  setShapeOverlay: (v: EShapeOverlay) => void;
  setPosterPadding: (v: EPosterPadding) => void;
  setShowOutline: (v: boolean) => void;
  setGradientOverlay: (v: EGradientOverlay) => void;

  // --- Actions: product ---
  setPrintType: (v: EPrintType) => void;
  setPrintSize: (v: EPrintSize) => void;
  setFrameColor: (v: EFrameColor) => void;

  // --- Bulk / preset application ---
  applyDesign: (patch: Partial<CitymapEditorState>) => void;
  resetEditor: () => void;
}

let markerCounter = 0;
function nextMarkerId(): string {
  markerCounter += 1;
  return `m_${Date.now().toString(36)}_${markerCounter}`;
}

function makeMarker(state: CitymapEditorState, partial: Partial<CitymapMarker> = {}): CitymapMarker {
  // Default a new marker to the current map center (or location), so it's visible.
  const lat = partial.lat ?? state.location?.lat ?? 48.8566;
  const lng = partial.lng ?? state.location?.lng ?? 2.3522;
  return {
    id: nextMarkerId(),
    type: EMarkerType.ICON,
    lat,
    lng,
    text: "",
    icon: EMarkerIcon.PIN_HEART,
    size: EMarkerSize.MEDIUM,
    color: MARKER_COLORS[0],
    colorLayer: EMarkerColorLayer.MARKER,
    photoUrl: null,
    markerIndex: state.markers.length,
    ...partial,
  };
}

const INITIAL: Pick<
  CitymapEditorState,
  | "location" | "zoom" | "mapStyle" | "headline" | "subheadline" | "tagline" | "dedication"
  | "textLayout" | "textVariant" | "font" | "showCoordinates" | "markers" | "selectedMarkerId"
  | "shapeOverlay" | "posterPadding" | "showOutline" | "gradientOverlay"
  | "printType" | "printSize" | "frameColor"
> = {
  location: null,
  zoom: 13,
  mapStyle: EMapStyle.GLACIER,
  headline: "",
  subheadline: "",
  tagline: "",
  dedication: "",
  textLayout: ETextLayout.REGULAR,
  textVariant: ETextVariant.DEFAULT,
  font: EFont.CORMORANT,
  showCoordinates: true,
  markers: [],
  selectedMarkerId: null,
  shapeOverlay: EShapeOverlay.NONE,
  posterPadding: EPosterPadding.NONE,
  showOutline: false,
  gradientOverlay: EGradientOverlay.NONE,
  printType: EPrintType.POSTER,
  printSize: EPrintSize._45X60,
  frameColor: EFrameColor.WHITE,
};

export const useCitymapEditor = create<CitymapEditorState>((set) => ({
  ...INITIAL,

  setLocation: (location) => set({ location }),
  setZoom: (zoom) => set({ zoom }),

  setMapStyle: (mapStyle) => set({ mapStyle }),

  setHeadline: (headline) => set({ headline }),
  setSubheadline: (subheadline) => set({ subheadline }),
  setTagline: (tagline) => set({ tagline }),
  setDedication: (dedication) => set({ dedication }),
  setTextLayout: (textLayout) => set({ textLayout }),
  setTextVariant: (textVariant) => set({ textVariant }),
  setFont: (font) => set({ font }),
  setShowCoordinates: (showCoordinates) => set({ showCoordinates }),

  addMarker: (partial) =>
    set((s) => {
      const marker = makeMarker(s, partial);
      return { markers: [...s.markers, marker], selectedMarkerId: marker.id };
    }),
  addPhotoMarker: (photoUrl, partial) =>
    set((s) => {
      const marker = makeMarker(s, { ...partial, type: EMarkerType.PHOTO, photoUrl });
      return { markers: [...s.markers, marker], selectedMarkerId: marker.id };
    }),
  updateMarker: (id, patch) =>
    set((s) => ({ markers: s.markers.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
  removeMarker: (id) =>
    set((s) => ({
      markers: s.markers.filter((m) => m.id !== id).map((m, i) => ({ ...m, markerIndex: i })),
      selectedMarkerId: s.selectedMarkerId === id ? null : s.selectedMarkerId,
    })),
  selectMarker: (selectedMarkerId) => set({ selectedMarkerId }),

  setShapeOverlay: (shapeOverlay) => set({ shapeOverlay }),
  setPosterPadding: (posterPadding) =>
    set((s) => ({
      posterPadding,
      // outline only meaningful when there is padding
      showOutline: posterPadding === EPosterPadding.NONE ? false : s.showOutline,
    })),
  setShowOutline: (showOutline) => set({ showOutline }),
  setGradientOverlay: (gradientOverlay) => set({ gradientOverlay }),

  setPrintType: (printType) => set({ printType }),
  setPrintSize: (printSize) => set({ printSize }),
  setFrameColor: (frameColor) => set({ frameColor }),

  applyDesign: (patch) => set(patch),
  resetEditor: () => set({ ...INITIAL }),
}));
