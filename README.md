# TalkNest

### TalkNest - a place where friends chat

A simple secure direct chat app built with `Express`, `Socket.IO`, sessions, and password-based login.

## What it does

- Create account and log in
- Registration uses real email OTP verification before account creation
- Account is created only after valid OTP and then stored in MongoDB
- See who is online
- Choose a specific person to chat with
- Send and receive direct messages instantly
- Persist direct message history across refresh/reopen
- Password hashing with `bcryptjs`
- Session-based login persistence

## Project structure

- `server.js` — Node.js server, auth APIs, sessions, and Socket.IO events
- `public/index.html` — Chat page
- `public/styles.css` — Styling
- `public/script.js` — Browser-side chat logic
- `data/users.json` — Legacy local users data used one time for startup migration
- `data/messages.json` — Legacy local messages data used one time for startup migration

## Run locally

1. Install dependencies if needed.
2. Start the server.
3. Open `http://localhost:3000` in two browser tabs.
4. Create two accounts in different tabs or devices.
5. Log in with both accounts.
6. Click the other person's name and start chatting.

## Use from different Wi-Fi (internet access)

If users are not on the same network, your backend must be reachable from the internet.

1. Deploy this Node.js app to a public host (for example Render, Railway, VPS, or Azure).
2. Set backend environment variables:
	- `CLIENT_ORIGINS=https://your-frontend-domain.com`
	- `SESSION_COOKIE_SECURE=true`
	- `SESSION_COOKIE_SAME_SITE=none`
	- `TRUST_PROXY=true` (recommended behind reverse proxy/load balancer)
3. Set one of these backend environment variables:
	- `PUBLIC_SERVER_URL=https://your-backend-domain.com` (recommended)
	- or `SERVER_URL=https://your-backend-domain.com` (fallback)
4. Restart backend after changing env values.
5. Start the backend and open the frontend URL from any network.

Notes:

- For cross-domain login/session to work, HTTPS is required.
- If frontend and backend are same domain, keep `PUBLIC_SERVER_URL` (or `SERVER_URL`) empty.
- Localhost is only for local testing, not internet users.

## Real email OTP + MongoDB setup

Set these environment variables before starting the server:

- `SMTP_HOST` (example: `smtp.gmail.com`)
- `SMTP_PORT` (example: `587`)
- `SMTP_SECURE` (`true` for SSL/465, otherwise `false`)
- `SMTP_TLS_REJECT_UNAUTHORIZED` (`true` by default, set `false` only for local self-signed SMTP certificates)
- `SMTP_USER` (your SMTP login email/user)
- `SMTP_PASS` (your SMTP app password/token)
- `SMTP_FROM` (sender address shown in verification email)

Also set MongoDB variables:

- `MONGODB_URI` (MongoDB Atlas/local connection string)
- `MONGODB_DB_NAME` (example: `mychattingapplication`)
- `MESSAGE_ENCRYPTION_KEY` (optional but recommended, used to encrypt message text at rest in MongoDB)

Without SMTP and MongoDB, OTP registration will not work.

Message encryption notes:

- If `MESSAGE_ENCRYPTION_KEY` is set, message text is encrypted before storing in MongoDB and decrypted when reading.
- Use a 32-byte key as either 64-char hex or base64.
- Keep the same key across deployments, otherwise previously encrypted messages cannot be decrypted.

Mongo migration behavior:

- On first server start, existing records from `data/users.json` and `data/messages.json` are migrated into MongoDB automatically.
- After migration, runtime reads/writes are done from MongoDB collections.
- The local JSON files are kept only as legacy backup files.

Quick setup:

1. Copy `.env.example` to `.env`.
2. Fill SMTP and MongoDB values in `.env`.
3. Run `npm start`.

Provider notes:

- Gmail: use `smtp.gmail.com`, port `587`, and a Google App Password (not your normal Gmail password).
- Outlook/Hotmail: use `smtp.office365.com`, port `587`, and your mailbox/app password.
- If you get `self-signed certificate in certificate chain`, set `SMTP_TLS_REJECT_UNAUTHORIZED=false` for local testing and restart the server.

## Next security upgrades to add

- HTTPS in production
- Profile photos and last seen
- Rate limiting and spam protection

