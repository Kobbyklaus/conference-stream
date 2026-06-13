# Deploying Conference Stream to the Hostinger VPS

Target: **https://watch.dhmm190.com** — Node app (PM2) behind your existing Cloudflare Tunnel, using SQLite (no separate database).

---

## 1. One-time: create the email App Password (Google Workspace)

The invite emails send from `allnations@dhmm190.com` via Gmail SMTP, which needs an **App Password** (not the normal password).

1. Sign in to Google as **allnations@dhmm190.com**.
2. Make sure **2-Step Verification** is ON (Google Account → Security). If your Workspace admin blocks App Passwords, they must allow them.
3. Go to **Google Account → Security → App passwords** → create one named "Conference Stream".
4. Copy the **16-character** code — you'll paste it into `SMTP_PASS` below.

---

## 2. On the VPS: prerequisites

You already run Node bots here, so most of this exists. Confirm:

```bash
node -v        # need v20+ (v22/24 fine)
npm -v
pm2 -v         # if missing:  npm i -g pm2
# build tools for the native SQLite module:
sudo apt-get install -y build-essential python3
```

---

## 3. Clone the repo

```bash
cd ~/apps            # or wherever your other bots live
git clone git@github.com:Kobbyklaus/conference-stream.git
cd conference-stream
```

(If the VPS uses HTTPS instead of SSH for GitHub, use
`git clone https://github.com/Kobbyklaus/conference-stream.git`.)

---

## 4. Create the environment file

```bash
cp .env.production.example .env.local
nano .env.local
```

Fill in:
- `ADMIN_PASSWORD` — your owner login
- `ADMIN_SESSION_SECRET` — run `openssl rand -hex 32` and paste the result
- `NEXT_PUBLIC_BASE_URL=https://watch.dhmm190.com`
- `SMTP_USER=allnations@dhmm190.com`
- `SMTP_PASS=` the 16-char App Password from step 1
- `SMTP_FROM=allnations@dhmm190.com`

Leave `DATABASE_URL` unset (uses SQLite).

---

## 5. Install, build, start

```bash
npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 logs conference-stream     # should show "Conference Stream ready on http://localhost:3000"
```

Quick local check on the VPS:
```bash
curl -I http://localhost:3000/admin     # expect HTTP 200
```

---

## 6. Point Cloudflare Tunnel at it

You already have a tunnel serving `whatsapp.dhmm190.com` / `youtube.dhmm190.com`. Add a public hostname for this app.

**Option A — Cloudflare dashboard (easiest):**
Zero Trust → Networks → Tunnels → your tunnel → **Public Hostname** → Add:
- Subdomain: `watch`  ·  Domain: `dhmm190.com`
- Service: `HTTP`  →  `localhost:3000`

**Option B — config file** (`~/.cloudflared/config.yml`), add under `ingress:`:
```yaml
  - hostname: watch.dhmm190.com
    service: http://localhost:3000
```
(Keep the catch-all `- service: http_status:404` last.) Then:
```bash
cloudflared tunnel route dns <your-tunnel-name> watch.dhmm190.com
sudo systemctl restart cloudflared    # or: pm2 restart cloudflared
```

Visit **https://watch.dhmm190.com/admin** — log in with `ADMIN_PASSWORD`.

> WebSockets: Cloudflare Tunnel supports the Socket.io WebSocket automatically — no extra config needed.

---

## 7. Updating later (after code changes)

```bash
cd ~/apps/conference-stream
git pull
npm ci
npm run build
pm2 restart conference-stream
```

---

## Notes
- **Single instance only.** Live conference state (playback position, viewers) lives in memory, so don't scale to multiple PM2 instances or cluster mode. `ecosystem.config.cjs` already pins this.
- **Database = one file** (`conference.db` in the project folder). To back up attendees/rooms, copy that file. It is gitignored.
- **First run creates the DB** automatically; no migration step needed.
