let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get Spotify API access token using Client Credentials flow
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  // Note: In production, you should add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env
  // For now, we'll use a placeholder - this will need to be configured
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Failed to get Spotify access token');
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // Refresh 1 minute early
    return accessToken;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
}

/**
 * Search for tracks on Spotify
 */
export async function searchTrack(query: string, limit: number = 10) {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search Spotify');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching Spotify:', error);
    throw error;
  }
}

/**
 * Get track details by ID
 */
export async function getTrack(trackId: string) {
  try {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to get track from Spotify');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting track from Spotify:', error);
    throw error;
  }
}

/**
 * Extract track ID from Spotify URL or URI
 */
export function extractTrackId(input: string): string | null {
  // Spotify URL: https://open.spotify.com/track/TRACK_ID
  const urlMatch = input.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (urlMatch) return urlMatch[1];

  // Spotify URI: spotify:track:TRACK_ID
  const uriMatch = input.match(/spotify:track:([a-zA-Z0-9]+)/);
  if (uriMatch) return uriMatch[1];

  // Direct track ID
  if (/^[a-zA-Z0-9]{22}$/.test(input)) return input;

  return null;
}

/**
 * Generate Spotify Code SVG URL
 * Note: This uses Spotify's undocumented API - may break in the future
 */
export function generateSpotifyCodeUrl(
  trackUri: string,
  format: 'svg' | 'png' = 'svg',
  size: number = 640,
  backgroundColor: string = 'ffffff',
  barColor: string = '000000'
): string {
  return `https://scannables.scdn.co/uri/plain/${format}/${backgroundColor}/${barColor}/${size}/${trackUri}`;
}

/**
 * Format track data for display
 */
export interface FormattedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  previewUrl: string | null;
  spotifyUrl: string;
  uri: string;
}

export function formatTrackData(track: any): FormattedTrack {
  return {
    id: track.id,
    name: track.name,
    artist: track.artists.map((a: any) => a.name).join(', '),
    album: track.album.name,
    albumArt: track.album.images[0]?.url || '',
    duration: track.duration_ms,
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
    uri: track.uri,
  };
}
