// whoop.ts (Expo / React Native)
// Requires: expo-auth-session, expo-secure-store
// Redirect registered in WHOOP: zeph://redirect
// app.json must include: { "expo": { "scheme": "zeph" } }

import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

// ===== WHOOP endpoints =====
const AUTHORIZATION_ENDPOINT = 'https://api.prod.whoop.com/oauth/oauth2/auth';
const TOKEN_ENDPOINT         = 'https://api.prod.whoop.com/oauth/oauth2/token';
const API_BASE               = 'https://api.prod.whoop.com/developer';

// ===== Your WHOOP OAuth app creds =====
// PROD: DO NOT SHIP CLIENT_SECRET. Leave it empty for public/PKCE clients.
const CLIENT_ID      = 'c26a9e93-83aa-4869-adbc-f8a61656eadb';
const CLIENT_SECRET  = 'c3579fd9e730803cf2a24f3254c253514894bbc78f31866bb6f8dccefdf2892d'; // e.g. 'xxxx' for quick local testing ONLY. Keep '' in prod.

// Request only what you need. Start with profile, add others later.
const SCOPES = [
  'read:profile',
  'read:body_measurement',
  'read:cycles',
  'read:sleep',
  'read:recovery',
  'read:workout',
].join(' ');

// ===== Types / storage =====
const SECURE_KEY = 'whoop_tokens_v1';

type TokenSet = {
  access_token: string;
  refresh_token?: string;
  token_type: 'Bearer';
  expires_in?: number;     // seconds
  obtained_at?: number;    // epoch ms
};

const now = () => Date.now();

async function saveTokens(tokens: TokenSet) {
  tokens.obtained_at = now();
  await SecureStore.setItemAsync(SECURE_KEY, JSON.stringify(tokens));
}
export async function loadTokens(): Promise<TokenSet | null> {
  const raw = await SecureStore.getItemAsync(SECURE_KEY);
  return raw ? (JSON.parse(raw) as TokenSet) : null;
}
export async function clearTokens() {
  await SecureStore.deleteItemAsync(SECURE_KEY);
}
function isExpired(t: TokenSet) {
  if (!t.expires_in || !t.obtained_at) return false;
  return now() > t.obtained_at + (t.expires_in - 60) * 1000; // refresh 60s early
}

// Helper: x-www-form-urlencoded body as STRING (RN iOS needs string, not URLSearchParams)
function toFormBody(params: Record<string, string | undefined>) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}

// ===== Public API map (nice to have) =====
export const WHOOP_API = {
  baseUrl: API_BASE,
  endpoints: {
    profile: '/v2/user/profile/basic',
    body: '/v2/user/measurement/body',
    cycles: '/v2/cycle',
    cycleById: (id: number) => `/v2/cycle/${id}`,
    cycleSleep: (id: number) => `/v2/cycle/${id}/sleep`,
    sleeps: '/v2/activity/sleep',
    sleepById: (id: string) => `/v2/activity/sleep/${id}`,
    recoveries: '/v2/recovery',
    recoveryForCycle: (cycleId: number) => `/v2/cycle/${cycleId}/recovery`,
    workouts: '/v2/activity/workout',
    workoutById: (id: string) => `/v2/activity/workout/${id}`,
  },
};

// ===== OAuth: Authorization Code + PKCE =====
export async function authorizeWhoop() {
  // Using Expo Dev Client / production build → native deep link
  // const redirectUri = AuthSession.makeRedirectUri({ scheme: 'zeph', path: 'redirect' });
  const redirectUri = "zeph://redirect"; // FORCE IT

  // console.log('WHOOP redirectUri -->', redirectUri); // should be "zeph://redirect"

  const request = new AuthSession.AuthRequest({
    clientId: CLIENT_ID,
    redirectUri,
    usePKCE: true,
    responseType: AuthSession.ResponseType.Code,
    scopes: SCOPES.split(' '),
  });

  // Prepare the authorize URL (old SDKs want this; do not pass discovery to promptAsync)
  await request.makeAuthUrlAsync({ authorizationEndpoint: AUTHORIZATION_ENDPOINT });

  // Open WHOOP consent screen
  const result = await request.promptAsync();
  if (result.type !== 'success' || !result.params?.code) {
    throw new Error(
      `Auth not successful: ${result.type} ${result.params?.error ?? ''} ${result.params?.error_description ?? ''}`
    );
  }

  // Exchange code for tokens (string body; add client_secret ONLY if you set it)
  const body = toFormBody({
    grant_type: 'authorization_code',
    code: result.params.code,
    redirect_uri: redirectUri,
    client_id: CLIENT_ID,
    code_verifier: request.codeVerifier || '',
    ...(CLIENT_SECRET ? { client_secret: CLIENT_SECRET } : undefined),
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body,
  });

  const txt = await res.text();
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${txt}`);
  const json = JSON.parse(txt);

  const tokens: TokenSet = {
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    token_type: 'Bearer',
    expires_in: json.expires_in,
    obtained_at: now(),
  };
  await saveTokens(tokens);
  return tokens;
}

// ===== Token refresh =====
export async function refreshWhoopTokensIfNeeded() {
  let tokens = await loadTokens();
  if (!tokens) return null;
  if (!isExpired(tokens)) return tokens;
  if (!tokens.refresh_token) {
    await clearTokens();
    return null;
  }

  const body = toFormBody({
    grant_type: 'refresh_token',
    refresh_token: tokens.refresh_token,
    client_id: CLIENT_ID,
    ...(CLIENT_SECRET ? { client_secret: CLIENT_SECRET } : undefined),
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body,
  });

  const txt = await res.text();
  if (!res.ok) {
    await clearTokens();
    throw new Error(`Refresh failed: ${res.status} ${txt}`);
  }
  const json = JSON.parse(txt);

  tokens = {
    access_token: json.access_token,
    refresh_token: json.refresh_token ?? tokens.refresh_token,
    token_type: 'Bearer',
    expires_in: json.expires_in,
    obtained_at: now(),
  };
  await saveTokens(tokens);
  return tokens;
}

// ===== Authorized fetch helper =====
export async function whoopFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  let tokens = await loadTokens();
  tokens = tokens ? (await refreshWhoopTokensIfNeeded()) : null;
  if (!tokens) tokens = await authorizeWhoop();

  const res = await fetch(`${WHOOP_API.baseUrl}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`,
      'Accept': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (res.status === 401) {
    await clearTokens();
    throw new Error('Unauthorized (401) — sign in again.');
  }
  if (res.status === 429) {
    throw new Error('Rate limited (429) — retry later.');
  }
  if (!res.ok) {
    throw new Error(`WHOOP error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}
