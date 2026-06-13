import crypto from "crypto";

/* ---------- Password hashing (scrypt) ---------- */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = (stored || "").split(":");
  if (!salt || !hash) return false;
  const computed = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(computed, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ---------- Admin session tokens (stateless, signed) ----------
   Tokens are HMAC-signed with a server secret, so they survive server
   restarts and crashes — an admin (or a host mid-conference) stays logged in.
   The secret is stable across restarts because it derives from env. */

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "dev-insecure-secret-change-me"
  );
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function issueToken(name = "admin"): string {
  const payload = Buffer.from(JSON.stringify({ name, iat: Date.now() })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function isValidToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  try {
    const { iat } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof iat === "number" && Date.now() - iat < MAX_AGE_MS;
  } catch {
    return false;
  }
}

/** Extract the admin token from an incoming request (Authorization: Bearer … or x-admin-token). */
export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return req.headers.get("x-admin-token");
}

/** Returns true if the request carries a valid admin session token. */
export function requireAdmin(req: Request): boolean {
  return isValidToken(getTokenFromRequest(req));
}
