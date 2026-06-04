const PRODIGI_ENVS = {
  sandbox: "https://api.sandbox.prodigi.com",
  live: "https://api.prodigi.com",
} as const;

type ProdigiEnv = keyof typeof PRODIGI_ENVS;

export function getProdigiApiBase(): string {
  const env = (process.env.PRODIGI_ENV || "sandbox") as ProdigiEnv;
  const base = PRODIGI_ENVS[env];
  if (!base) {
    throw new Error(
      `Invalid PRODIGI_ENV "${env}". Must be "sandbox" or "live".`
    );
  }
  return base;
}

export function getProdigiApiKey(): string {
  const key = process.env.PRODIGI_API_KEY;
  if (!key) {
    throw new Error("PRODIGI_API_KEY environment variable is required");
  }
  return key;
}

export const PRODIGI_API_BASE = getProdigiApiBase();
