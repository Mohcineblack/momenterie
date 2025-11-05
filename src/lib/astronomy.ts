import * as astronomy from 'astronomy-engine';

export interface StarPosition {
  name: string;
  x: number;
  y: number;
  magnitude: number;
  constellation?: string;
}

export interface ConstellationLine {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

// Major bright stars with their coordinates (Right Ascension, Declination, Magnitude)
const BRIGHT_STARS = [
  { name: 'Sirius', ra: 6.7525, dec: -16.7161, mag: -1.46, constellation: 'Canis Major' },
  { name: 'Canopus', ra: 6.3992, dec: -52.6958, mag: -0.72, constellation: 'Carina' },
  { name: 'Arcturus', ra: 14.2612, dec: 19.1872, mag: -0.04, constellation: 'Boötes' },
  { name: 'Vega', ra: 18.6156, dec: 38.7836, mag: 0.03, constellation: 'Lyra' },
  { name: 'Capella', ra: 5.2781, dec: 45.9980, mag: 0.08, constellation: 'Auriga' },
  { name: 'Rigel', ra: 5.2422, dec: -8.2017, mag: 0.13, constellation: 'Orion' },
  { name: 'Procyon', ra: 7.6550, dec: 5.2247, mag: 0.38, constellation: 'Canis Minor' },
  { name: 'Betelgeuse', ra: 5.9195, dec: 7.4069, mag: 0.50, constellation: 'Orion' },
  { name: 'Altair', ra: 19.8464, dec: 8.8683, mag: 0.77, constellation: 'Aquila' },
  { name: 'Aldebaran', ra: 4.5987, dec: 16.5093, mag: 0.85, constellation: 'Taurus' },
  { name: 'Antares', ra: 16.4901, dec: -26.4320, mag: 0.96, constellation: 'Scorpius' },
  { name: 'Spica', ra: 13.4199, dec: -11.1613, mag: 0.98, constellation: 'Virgo' },
  { name: 'Pollux', ra: 7.7553, dec: 28.0262, mag: 1.14, constellation: 'Gemini' },
  { name: 'Fomalhaut', ra: 22.9608, dec: -29.6222, mag: 1.16, constellation: 'Piscis Austrinus' },
  { name: 'Deneb', ra: 20.6905, dec: 45.2803, mag: 1.25, constellation: 'Cygnus' },
  { name: 'Regulus', ra: 10.1395, dec: 11.9672, mag: 1.35, constellation: 'Leo' },
  { name: 'Castor', ra: 7.5767, dec: 31.8883, mag: 1.58, constellation: 'Gemini' },
  { name: 'Bellatrix', ra: 5.4188, dec: 6.3497, mag: 1.64, constellation: 'Orion' },
];

/**
 * Calculate star positions for a specific date, time, and location
 */
export function calculateStarPositions(
  date: Date,
  latitude: number,
  longitude: number,
  canvasWidth: number = 800,
  canvasHeight: number = 600
): StarPosition[] {
  const observer = new astronomy.Observer(latitude, longitude, 0);
  const time = astronomy.MakeTime(date);

  const positions: StarPosition[] = [];

  for (const star of BRIGHT_STARS) {
    try {
      // Convert RA (hours) to degrees
      const raDegrees = star.ra * 15;

      // Calculate horizontal coordinates (altitude and azimuth)
      const equ = astronomy.Equator('JPLH', date, {
        ofdate: true,
      } as any);

      const hor = astronomy.Horizon(time, observer, raDegrees, star.dec, astronomy.Refraction.Normal);

      // Only include stars above the horizon
      if (hor.altitude > 0) {
        // Convert azimuth and altitude to canvas coordinates
        // Azimuth: 0° = North, 90° = East, 180° = South, 270° = West
        // We'll use a stereographic projection centered on zenith

        const azimuthRad = (hor.azimuth * Math.PI) / 180;
        const altitudeRad = (hor.altitude * Math.PI) / 180;

        // Simple stereographic projection
        const radius = canvasWidth / 2;
        const r = radius * (1 - Math.sin(altitudeRad));

        const x = canvasWidth / 2 + r * Math.sin(azimuthRad);
        const y = canvasHeight / 2 - r * Math.cos(azimuthRad);

        // Scale magnitude for display (brighter = larger)
        const displayMagnitude = Math.max(1, 4 - star.mag);

        positions.push({
          name: star.name,
          x,
          y,
          magnitude: displayMagnitude,
          constellation: star.constellation,
        });
      }
    } catch (error) {
      console.error(`Error calculating position for ${star.name}:`, error);
    }
  }

  return positions;
}

/**
 * Generate constellation lines between stars
 * This is a simplified version - in production, you'd use a constellation database
 */
export function generateConstellationLines(
  stars: StarPosition[],
  canvasWidth: number = 800,
  canvasHeight: number = 600
): ConstellationLine[] {
  const lines: ConstellationLine[] = [];

  // Define some basic constellation connections
  const connections: Record<string, string[][]> = {
    'Orion': [
      ['Betelgeuse', 'Bellatrix'],
      ['Bellatrix', 'Rigel'],
    ],
    'Gemini': [
      ['Castor', 'Pollux'],
    ],
  };

  Object.entries(connections).forEach(([constellation, pairs]) => {
    pairs.forEach(([star1Name, star2Name]) => {
      const star1 = stars.find(s => s.name === star1Name);
      const star2 = stars.find(s => s.name === star2Name);

      if (star1 && star2) {
        lines.push({
          from: { x: star1.x, y: star1.y },
          to: { x: star2.x, y: star2.y },
        });
      }
    });
  });

  return lines;
}

/**
 * Calculate the position of planets for a given date and location
 */
export function calculatePlanetPositions(
  date: Date,
  latitude: number,
  longitude: number,
  canvasWidth: number = 800,
  canvasHeight: number = 600
): StarPosition[] {
  const observer = new astronomy.Observer(latitude, longitude, 0);
  const time = astronomy.MakeTime(date);

  const planets = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  const positions: StarPosition[] = [];

  for (const planetName of planets) {
    try {
      const body = astronomy.Body[planetName as keyof typeof astronomy.Body];
      const equ = astronomy.Equator(body, time, observer, true, true);
      const hor = astronomy.Horizon(time, observer, equ.ra * 15, equ.dec, astronomy.Refraction.Normal);

      if (hor.altitude > 0) {
        const azimuthRad = (hor.azimuth * Math.PI) / 180;
        const altitudeRad = (hor.altitude * Math.PI) / 180;

        const radius = canvasWidth / 2;
        const r = radius * (1 - Math.sin(altitudeRad));

        const x = canvasWidth / 2 + r * Math.sin(azimuthRad);
        const y = canvasHeight / 2 - r * Math.cos(azimuthRad);

        positions.push({
          name: planetName,
          x,
          y,
          magnitude: 5, // Planets are typically shown larger
          constellation: 'Planet',
        });
      }
    } catch (error) {
      console.error(`Error calculating position for ${planetName}:`, error);
    }
  }

  return positions;
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(latitude: number, longitude: number): string {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';

  const latAbs = Math.abs(latitude);
  const lonAbs = Math.abs(longitude);

  const latDeg = Math.floor(latAbs);
  const latMin = Math.floor((latAbs - latDeg) * 60);
  const latSec = Math.floor(((latAbs - latDeg) * 60 - latMin) * 60);

  const lonDeg = Math.floor(lonAbs);
  const lonMin = Math.floor((lonAbs - lonDeg) * 60);
  const lonSec = Math.floor(((lonAbs - lonDeg) * 60 - lonMin) * 60);

  return `${latDeg}°${latMin}'${latSec}"${latDir} ${lonDeg}°${lonMin}'${lonSec}"${lonDir}`;
}

/**
 * Get moon phase for a specific date
 */
export function getMoonPhase(date: Date): {
  phase: number;
  phaseName: string;
  illumination: number;
} {
  const time = astronomy.MakeTime(date);
  const moonPhase = astronomy.MoonPhase(time);

  let phaseName: string;
  if (moonPhase < 45) phaseName = 'New Moon';
  else if (moonPhase < 90) phaseName = 'Waxing Crescent';
  else if (moonPhase < 135) phaseName = 'First Quarter';
  else if (moonPhase < 180) phaseName = 'Waxing Gibbous';
  else if (moonPhase < 225) phaseName = 'Full Moon';
  else if (moonPhase < 270) phaseName = 'Waning Gibbous';
  else if (moonPhase < 315) phaseName = 'Last Quarter';
  else phaseName = 'Waning Crescent';

  const illumination = (1 - Math.cos(moonPhase * Math.PI / 180)) / 2 * 100;

  return {
    phase: moonPhase,
    phaseName,
    illumination,
  };
}
