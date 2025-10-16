# Random Cat Fact API

**GitHub:** `https://github.com/domistro16/HNGStage0`

A simple Express service exposing a single endpoint:

- `GET /me` — returns a live cat fact from `https://catfact.ninja/fact`, a `user` object, a dynamic UTC timestamp (ISO 8601) and the status of the query.

---

## What it returns

```json
{
  "status": "success",
  "user": { "name": "...", "email": "...", "stack": "..." },
  "timestamp": "2025-10-15T12:34:56.789Z",
  "fact": "A freshly fetched cat fact or a friendly fallback"
}
```

- `timestamp` is generated per request with `new Date().toISOString()` (UTC, ISO 8601).
- `fact` is fetched live from the Cat Facts API on every request. If the external API fails, a fallback is returned and the response contains a helpful reason and status.

---

## Quick setup (local)

1. Clone the repo

```bash
git clone https://github.com/domistro16/HNGStage0.git
cd HNGStage0
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Create a `.env` file in project root (see **Environment variables** section or copy the template below).

4. Start the app

```bash
# development (with nodemon if installed)
npm run dev
# or
node index.js

# production
npm start
```

---

## Dependencies

Install via `npm install` — these are the packages the app uses:

- `express` — web server
- `axios` — HTTP client for fetching the cat fact
- `cors` — CORS support
- `morgan` — HTTP access logging
- `express-rate-limit` — basic rate limiting
- `dotenv` — environment variable loader

Install command:

```bash
npm install express axios cors morgan express-rate-limit dotenv
```

For Testing:

```bash
npm install --save-dev nodemon
```

Add scripts to `package.json`:

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

---

## Environment variables

Copy `.env.example` into `.env` in the project root. Example template:

```env
# Server
PORT=3000
NODE_ENV=development

# Cat Facts API (override for tests or mirrors)
CATFACT_URL=https://catfact.ninja/fact
CATFACT_TIMEOUT_MS=5000

# Rate limiting
RATE_LIMIT_MAX=60

# Fallback / UX
FALLBACK_CAT_FACT="Cat fact currently unavailable. Please try again later."

# User object returned by /me
USER_NAME="Esih Egwurube"
USER_EMAIL=desmondesih@gmail.com
USER_STACK="NodeJS/Express"

# CORS (optional)
CORS_ORIGIN=*
```

> **Security note:** Do **not** commit `.env` to git. Add it to `.gitignore`.

---

## How to use / test

Start the server and call the endpoint:

```bash
curl http://localhost:3000/me
```

Successful example response:

```json
{
  "status": "success",
  "user": {
    "name": "Esih Egwurube",
    "email": "desmondesih@gmail.com",
    "stack": "NodeJS/Express"
  },
  "timestamp": "2025-10-15T12:34:56.789Z",
  "fact": "Cats have five toes on their front paws, but only four toes on their back paws."
}
```

If the Cat Facts API is down, the app returns a friendly fallback and an appropriate HTTP status code (502).

---

## Best practices & notes

- `timestamp` is fresh for every request and formatted as ISO 8601 UTC (`new Date().toISOString()`).
- The service sets `Cache-Control: no-store` to prevent proxy caching of dynamic responses.
- Add proper `CORS_ORIGIN` for production (don’t use `*` in prod as it isn't best practice to allow all origins access to the API).

---

## Contact

For questions or help, open an issue or contact `desmondesih@gmail.com`.

---
