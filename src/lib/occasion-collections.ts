export interface OccasionCollection {
  slug: string;
  title: string;
  description: string;
  categorySlugs: string[];
}

export const OCCASION_COLLECTIONS: OccasionCollection[] = [
  {
    slug: "cadeaux-couple",
    title: "Cadeaux de couple",
    description: "Offrez un souvenir unique de votre histoire : le lieu de votre rencontre, votre premier rendez-vous, ou le ciel de votre nuit sp\u00e9ciale.",
    categorySlugs: ["city-maps", "star-maps"],
  },
  {
    slug: "cadeaux-anniversaire",
    title: "Cadeaux d'anniversaire",
    description: "Un cadeau personnalis\u00e9 qui immortalise un moment, un lieu ou une date qui compte.",
    categorySlugs: ["city-maps", "star-maps"],
  },
  {
    slug: "cadeaux-naissance",
    title: "Cadeaux de naissance",
    description: "C\u00e9l\u00e9brez l'arriv\u00e9e d'un b\u00e9b\u00e9 avec une carte du ciel de sa naissance ou un plan de la ville natale.",
    categorySlugs: ["city-maps", "star-maps"],
  },
  {
    slug: "cadeaux-mariage",
    title: "Cadeaux pour mariages",
    description: "Le lieu de la c\u00e9r\u00e9monie, la date du grand jour \u2014 un cadeau de mariage inoubliable.",
    categorySlugs: ["city-maps", "star-maps"],
  },
  {
    slug: "cadeaux-saint-valentin",
    title: "Cadeaux de Saint-Valentin",
    description: "Racontez votre histoire d'amour \u00e0 travers un cadeau unique et personnalis\u00e9.",
    categorySlugs: ["city-maps", "star-maps"],
  },
  {
    slug: "cadeaux-maman",
    title: "Cadeaux pour Maman",
    description: "Un cadeau qui vient du c\u0153ur \u2014 le lieu o\u00f9 tout a commenc\u00e9 pour votre famille.",
    categorySlugs: ["city-maps", "star-maps"],
  },
  {
    slug: "cadeaux-papa",
    title: "Cadeaux pour Papa",
    description: "Un cadeau personnalis\u00e9 qui raconte une histoire \u2014 sa ville, son stade, son moment.",
    categorySlugs: ["city-maps", "star-maps"],
  },
  {
    slug: "la-ou-tout-a-commence",
    title: "L\u00e0 o\u00f9 tout a commenc\u00e9",
    description: "Immortalisez le lieu exact d'un moment qui a chang\u00e9 votre vie.",
    categorySlugs: ["city-maps", "star-maps"],
  },
];

export function getOccasionBySlug(slug: string) {
  return OCCASION_COLLECTIONS.find((c) => c.slug === slug);
}
