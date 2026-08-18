# JARVIS V0.3

PWA iPhone + Cloudflare Worker + OpenAI Realtime WebRTC.

## Architecture

iPhone Safari/PWA -> `/api/realtime-token` -> Cloudflare Worker -> OpenAI `/v1/realtime/client_secrets` -> short-lived token -> WebRTC -> GPT-Realtime.

The permanent OpenAI API key is a server secret and is never shipped to the browser.

## Deploy

1. Create a Cloudflare account.
2. Create a Worker project from this folder, or connect the repository to Cloudflare Workers Builds.
3. Set the secret `OPENAI_API_KEY` in the Worker.
4. Deploy.
5. Open the resulting HTTPS URL on iPhone Safari.
6. Share -> Add to Home Screen.

Cloudflare Workers Static Assets serves `public/` and the Worker handles `/api/*`.

## Local development

Requires Node.js:
`npm install`
`npm run dev`

## Production notes

- Do not put an OpenAI `sk-...` key in `public/`.
- Realtime client secrets are short-lived.
- Add authentication/rate limiting before exposing the Worker publicly.
- The current memory is localStorage only.
