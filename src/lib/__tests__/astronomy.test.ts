import {
  getStarPositions,
  getConstellations,
  calculateStarMapData,
} from '../astronomy'

describe('Astronomy Utilities', () => {
  describe('getStarPositions', () => {
    it('returns star positions for a given date and location', () => {
      const date = new Date('2024-01-01T20:00:00Z')
      const latitude = 51.5074 // London
      const longitude = -0.1278

      const stars = getStarPositions(date, latitude, longitude)

      expect(stars).toBeDefined()
      expect(Array.isArray(stars)).toBe(true)
      expect(stars.length).toBeGreaterThan(0)
    })

    it('returns different positions for different dates', () => {
      const date1 = new Date('2024-01-01T20:00:00Z')
      const date2 = new Date('2024-07-01T20:00:00Z')
      const latitude = 40.7128 // New York
      const longitude = -74.006

      const stars1 = getStarPositions(date1, latitude, longitude)
      const stars2 = getStarPositions(date2, latitude, longitude)

      expect(stars1).not.toEqual(stars2)
    })

    it('returns different positions for different locations', () => {
      const date = new Date('2024-01-01T20:00:00Z')

      const starsNY = getStarPositions(date, 40.7128, -74.006) // New York
      const starsLA = getStarPositions(date, 34.0522, -118.2437) // Los Angeles

      expect(starsNY).not.toEqual(starsLA)
    })

    it('handles edge case: North Pole', () => {
      const date = new Date('2024-01-01T00:00:00Z')
      const stars = getStarPositions(date, 90, 0)

      expect(stars).toBeDefined()
      expect(Array.isArray(stars)).toBe(true)
    })

    it('handles edge case: South Pole', () => {
      const date = new Date('2024-01-01T00:00:00Z')
      const stars = getStarPositions(date, -90, 0)

      expect(stars).toBeDefined()
      expect(Array.isArray(stars)).toBe(true)
    })

    it('handles edge case: Equator', () => {
      const date = new Date('2024-01-01T00:00:00Z')
      const stars = getStarPositions(date, 0, 0)

      expect(stars).toBeDefined()
      expect(Array.isArray(stars)).toBe(true)
    })
  })

  describe('getConstellations', () => {
    it('returns constellation data', () => {
      const constellations = getConstellations()

      expect(constellations).toBeDefined()
      expect(Array.isArray(constellations)).toBe(true)
      expect(constellations.length).toBeGreaterThan(0)
    })

    it('includes major constellations', () => {
      const constellations = getConstellations()
      const names = constellations.map((c) => c.name)

      // Check for some well-known constellations
      expect(names).toContain('Ursa Major')
      expect(names).toContain('Orion')
      expect(names).toContain('Cassiopeia')
    })

    it('each constellation has required properties', () => {
      const constellations = getConstellations()

      constellations.forEach((constellation) => {
        expect(constellation).toHaveProperty('name')
        expect(constellation).toHaveProperty('stars')
        expect(constellation).toHaveProperty('lines')
        expect(Array.isArray(constellation.stars)).toBe(true)
        expect(Array.isArray(constellation.lines)).toBe(true)
      })
    })
  })

  describe('calculateStarMapData', () => {
    it('calculates complete star map data', () => {
      const params = {
        date: new Date('2024-01-01T20:00:00Z'),
        latitude: 51.5074,
        longitude: -0.1278,
        showConstellations: true,
      }

      const mapData = calculateStarMapData(params)

      expect(mapData).toBeDefined()
      expect(mapData).toHaveProperty('stars')
      expect(mapData).toHaveProperty('constellations')
      expect(mapData).toHaveProperty('metadata')
    })

    it('includes metadata about the observation', () => {
      const params = {
        date: new Date('2024-01-01T20:00:00Z'),
        latitude: 51.5074,
        longitude: -0.1278,
        showConstellations: true,
      }

      const mapData = calculateStarMapData(params)

      expect(mapData.metadata).toHaveProperty('date')
      expect(mapData.metadata).toHaveProperty('latitude')
      expect(mapData.metadata).toHaveProperty('longitude')
      expect(mapData.metadata.latitude).toBe(51.5074)
      expect(mapData.metadata.longitude).toBe(-0.1278)
    })

    it('excludes constellations when showConstellations is false', () => {
      const params = {
        date: new Date('2024-01-01T20:00:00Z'),
        latitude: 51.5074,
        longitude: -0.1278,
        showConstellations: false,
      }

      const mapData = calculateStarMapData(params)

      expect(mapData.constellations).toEqual([])
    })

    it('includes constellations when showConstellations is true', () => {
      const params = {
        date: new Date('2024-01-01T20:00:00Z'),
        latitude: 51.5074,
        longitude: -0.1278,
        showConstellations: true,
      }

      const mapData = calculateStarMapData(params)

      expect(mapData.constellations.length).toBeGreaterThan(0)
    })

    it('filters visible stars based on magnitude', () => {
      const params = {
        date: new Date('2024-01-01T20:00:00Z'),
        latitude: 51.5074,
        longitude: -0.1278,
        showConstellations: true,
        magnitudeLimit: 3.0,
      }

      const mapData = calculateStarMapData(params)

      // All stars should have magnitude <= 3.0
      mapData.stars.forEach((star) => {
        if (star.magnitude !== undefined) {
          expect(star.magnitude).toBeLessThanOrEqual(3.0)
        }
      })
    })

    it('produces consistent results for same inputs', () => {
      const params = {
        date: new Date('2024-01-01T20:00:00Z'),
        latitude: 51.5074,
        longitude: -0.1278,
        showConstellations: true,
      }

      const mapData1 = calculateStarMapData(params)
      const mapData2 = calculateStarMapData(params)

      expect(mapData1).toEqual(mapData2)
    })

    it('handles invalid dates gracefully', () => {
      const params = {
        date: new Date('invalid'),
        latitude: 51.5074,
        longitude: -0.1278,
        showConstellations: true,
      }

      expect(() => calculateStarMapData(params)).not.toThrow()
    })

    it('handles extreme latitudes', () => {
      const paramsNorth = {
        date: new Date('2024-01-01T20:00:00Z'),
        latitude: 89,
        longitude: 0,
        showConstellations: true,
      }

      const paramsSouth = {
        date: new Date('2024-01-01T20:00:00Z'),
        latitude: -89,
        longitude: 0,
        showConstellations: true,
      }

      expect(() => calculateStarMapData(paramsNorth)).not.toThrow()
      expect(() => calculateStarMapData(paramsSouth)).not.toThrow()
    })
  })

  describe('Star positions validation', () => {
    it('star positions have valid coordinates', () => {
      const date = new Date('2024-01-01T20:00:00Z')
      const stars = getStarPositions(date, 40, -74)

      stars.forEach((star) => {
        expect(star).toHaveProperty('x')
        expect(star).toHaveProperty('y')
        expect(typeof star.x).toBe('number')
        expect(typeof star.y).toBe('number')
        expect(Number.isNaN(star.x)).toBe(false)
        expect(Number.isNaN(star.y)).toBe(false)
      })
    })

    it('star positions include magnitude data', () => {
      const date = new Date('2024-01-01T20:00:00Z')
      const stars = getStarPositions(date, 40, -74)

      stars.forEach((star) => {
        if (star.magnitude !== undefined) {
          expect(typeof star.magnitude).toBe('number')
          expect(Number.isNaN(star.magnitude)).toBe(false)
        }
      })
    })
  })
})
