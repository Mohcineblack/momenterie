const editorRoutesByCategory: Record<string, string> = {
  "city-maps": "/editor/citymaps",
  "star-maps": "/editor/starmaps",
  puzzles: "/editor/puzzles",
  jewelry: "/editor/jewelry",
  "photo-prints": "/editor/photo-prints",
  "date-prints": "/editor/dateprints",
};

export function getEditorRoute(categorySlug: string, productSlug: string) {
  const route = editorRoutesByCategory[categorySlug];

  if (!route) {
    return null;
  }

  return `${route}?product=${encodeURIComponent(productSlug)}`;
}
