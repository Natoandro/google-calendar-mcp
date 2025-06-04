import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs/promises';
import { getKeysFilePath } from './utils.js';

export function initializeOAuth2Client(): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUris = process.env.GOOGLE_REDIRECT_URIS?.split(',') || [];

  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID environment variable is required');
  }
  if (!clientSecret) {
    throw new Error('GOOGLE_CLIENT_SECRET environment variable is required');
  }

  const dummyRedirectUri = "http://localhost:3000/auth/callback";

  // Use the first redirect URI as the default for the base client
  return new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri: redirectUris[0] ?? dummyRedirectUri,
  });
}