/**
 * Validates required environment variables at startup.
 * Throws a clear, actionable error rather than letting the app
 * fail silently with a 400/403 from the YouTube API.
 */
export function validateEnv(): void {
  const key = import.meta.env.VITE_YT_API_KEY

  if (!key || key === 'your_youtube_data_api_v3_key_here') {
    throw new Error(
      'Missing VITE_YT_API_KEY.\n\n' +
      '1. Copy .env.example to .env\n' +
      '2. Replace the placeholder with your YouTube Data API v3 key\n' +
      '3. Restart the dev server (npm run dev)\n\n' +
      'Get a key at: https://console.cloud.google.com'
    )
  }
}
