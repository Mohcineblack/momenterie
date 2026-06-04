export interface CatalogStar {
  id: string;
  name: string;
  raHours: number;
  decDegrees: number;
  magnitude: number;
  constellation: string;
}

export const YALE_BRIGHT_STAR_SUBSET: CatalogStar[] = [
  { id: "HR2491", name: "Sirius", raHours: 6.7525, decDegrees: -16.7161, magnitude: -1.46, constellation: "Canis Major" },
  { id: "HR2326", name: "Canopus", raHours: 6.3992, decDegrees: -52.6958, magnitude: -0.72, constellation: "Carina" },
  { id: "HR5340", name: "Arcturus", raHours: 14.2612, decDegrees: 19.1872, magnitude: -0.04, constellation: "Bootes" },
  { id: "HR7001", name: "Vega", raHours: 18.6156, decDegrees: 38.7836, magnitude: 0.03, constellation: "Lyra" },
  { id: "HR1708", name: "Capella", raHours: 5.2781, decDegrees: 45.998, magnitude: 0.08, constellation: "Auriga" },
  { id: "HR1713", name: "Rigel", raHours: 5.2422, decDegrees: -8.2017, magnitude: 0.13, constellation: "Orion" },
  { id: "HR2943", name: "Procyon", raHours: 7.655, decDegrees: 5.2247, magnitude: 0.38, constellation: "Canis Minor" },
  { id: "HR2061", name: "Betelgeuse", raHours: 5.9195, decDegrees: 7.4069, magnitude: 0.5, constellation: "Orion" },
  { id: "HR7557", name: "Altair", raHours: 19.8464, decDegrees: 8.8683, magnitude: 0.77, constellation: "Aquila" },
  { id: "HR1457", name: "Aldebaran", raHours: 4.5987, decDegrees: 16.5093, magnitude: 0.85, constellation: "Taurus" },
  { id: "HR6134", name: "Antares", raHours: 16.4901, decDegrees: -26.432, magnitude: 0.96, constellation: "Scorpius" },
  { id: "HR5056", name: "Spica", raHours: 13.4199, decDegrees: -11.1613, magnitude: 0.98, constellation: "Virgo" },
  { id: "HR2990", name: "Pollux", raHours: 7.7553, decDegrees: 28.0262, magnitude: 1.14, constellation: "Gemini" },
  { id: "HR8728", name: "Fomalhaut", raHours: 22.9608, decDegrees: -29.6222, magnitude: 1.16, constellation: "Piscis Austrinus" },
  { id: "HR7924", name: "Deneb", raHours: 20.6905, decDegrees: 45.2803, magnitude: 1.25, constellation: "Cygnus" },
  { id: "HR3982", name: "Regulus", raHours: 10.1395, decDegrees: 11.9672, magnitude: 1.35, constellation: "Leo" },
  { id: "HR2891", name: "Castor", raHours: 7.5767, decDegrees: 31.8883, magnitude: 1.58, constellation: "Gemini" },
  { id: "HR1790", name: "Bellatrix", raHours: 5.4188, decDegrees: 6.3497, magnitude: 1.64, constellation: "Orion" },
  { id: "HR1852", name: "Alnilam", raHours: 5.6036, decDegrees: -1.2019, magnitude: 1.69, constellation: "Orion" },
  { id: "HR1903", name: "Alnitak", raHours: 5.6793, decDegrees: -1.9426, magnitude: 1.74, constellation: "Orion" },
  { id: "HR1948", name: "Saiph", raHours: 5.7959, decDegrees: -9.6696, magnitude: 2.06, constellation: "Orion" },
  { id: "HR5953", name: "Dschubba", raHours: 16.0056, decDegrees: -22.6217, magnitude: 2.29, constellation: "Scorpius" },
  { id: "HR6241", name: "Shaula", raHours: 17.5601, decDegrees: -37.1038, magnitude: 1.62, constellation: "Scorpius" },
  { id: "HR4295", name: "Merak", raHours: 11.0307, decDegrees: 56.3824, magnitude: 2.37, constellation: "Ursa Major" },
  { id: "HR4301", name: "Dubhe", raHours: 11.0621, decDegrees: 61.751, magnitude: 1.79, constellation: "Ursa Major" },
  { id: "HR4554", name: "Phecda", raHours: 11.8972, decDegrees: 53.6948, magnitude: 2.44, constellation: "Ursa Major" },
  { id: "HR4660", name: "Megrez", raHours: 12.2571, decDegrees: 57.0326, magnitude: 3.32, constellation: "Ursa Major" },
  { id: "HR4905", name: "Alioth", raHours: 12.9005, decDegrees: 55.9598, magnitude: 1.76, constellation: "Ursa Major" },
  { id: "HR5054", name: "Mizar", raHours: 13.3987, decDegrees: 54.9254, magnitude: 2.23, constellation: "Ursa Major" },
  { id: "HR5191", name: "Alkaid", raHours: 13.7924, decDegrees: 49.3133, magnitude: 1.85, constellation: "Ursa Major" },
];

export const CONSTELLATION_LINES: Array<[string, string]> = [
  ["Betelgeuse", "Bellatrix"],
  ["Bellatrix", "Alnilam"],
  ["Alnilam", "Alnitak"],
  ["Alnilam", "Rigel"],
  ["Rigel", "Saiph"],
  ["Saiph", "Betelgeuse"],
  ["Castor", "Pollux"],
  ["Antares", "Dschubba"],
  ["Antares", "Shaula"],
  ["Dubhe", "Merak"],
  ["Merak", "Phecda"],
  ["Phecda", "Megrez"],
  ["Megrez", "Dubhe"],
  ["Megrez", "Alioth"],
  ["Alioth", "Mizar"],
  ["Mizar", "Alkaid"],
];

