// @vitest-environment node
//
// jsdom's TextEncoder produces a Uint8Array from a different realm than
// Node's, which jose's WebCrypto build rejects. auth.ts is server-only
// anyway, so run this file under the real node environment instead.
import { test, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { decodeJwt, SignJWT } from "jose";

// `auth.ts` is marked "server-only" and reads/writes cookies via next/headers,
// neither of which work outside of a real request scope, so both are mocked.
// vi.mock calls are hoisted above imports by Vitest, so `../auth` picks these up.
const cookieStore = vi.hoisted(
  () => new Map<string, { value: string; options?: any }>()
);

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    set: (name: string, value: string, options?: any) => {
      cookieStore.set(name, { value, options });
    },
    get: (name: string) => cookieStore.get(name),
    delete: (name: string) => {
      cookieStore.delete(name);
    },
  })),
}));

import { createSession, getSession, deleteSession, verifySession } from "../auth";

const COOKIE_NAME = "auth-token";
// Matches auth.ts's fallback when JWT_SECRET is unset, which is the case in this test run.
const JWT_SECRET = new TextEncoder().encode("development-secret-key");

beforeEach(() => {
  cookieStore.clear();
});

test("createSession sets a cookie with the expected security options", async () => {
  const before = Date.now();
  await createSession("user-1", "user@example.com");

  const cookie = cookieStore.get(COOKIE_NAME);
  expect(cookie).toBeDefined();
  expect(cookie!.value).toEqual(expect.any(String));
  expect(cookie!.options.httpOnly).toBe(true);
  expect(cookie!.options.sameSite).toBe("lax");
  expect(cookie!.options.path).toBe("/");
  expect(cookie!.options.secure).toBe(process.env.NODE_ENV === "production");

  const expiresAt = new Date(cookie!.options.expires).getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  expect(expiresAt).toBeGreaterThan(before + sevenDaysMs - 5000);
  expect(expiresAt).toBeLessThan(before + sevenDaysMs + 5000);
});

test("createSession stores exactly one cookie under the auth-token name", async () => {
  await createSession("user-1", "user@example.com");

  expect(cookieStore.size).toBe(1);
  expect(cookieStore.has(COOKIE_NAME)).toBe(true);
});

test("createSession signs a JWT that encodes the given userId and email", async () => {
  await createSession("user-42", "person@example.com");

  const { value } = cookieStore.get(COOKIE_NAME)!;
  const payload = decodeJwt(value);
  expect(payload.userId).toBe("user-42");
  expect(payload.email).toBe("person@example.com");
});

test("createSession sets the JWT exp claim to 7 days out", async () => {
  const beforeSec = Math.floor(Date.now() / 1000);
  await createSession("user-1", "user@example.com");

  const { value } = cookieStore.get(COOKIE_NAME)!;
  const payload = decodeJwt(value);
  const sevenDaysSec = 7 * 24 * 60 * 60;
  expect(payload.exp).toBeGreaterThan(beforeSec + sevenDaysSec - 5);
  expect(payload.exp).toBeLessThan(beforeSec + sevenDaysSec + 5);
});

test("createSession overwrites any previous session cookie", async () => {
  await createSession("user-1", "first@example.com");
  await createSession("user-2", "second@example.com");

  expect(cookieStore.size).toBe(1);
  const payload = decodeJwt(cookieStore.get(COOKIE_NAME)!.value);
  expect(payload.userId).toBe("user-2");
  expect(payload.email).toBe("second@example.com");
});

test("getSession returns null when there is no session cookie", async () => {
  expect(await getSession()).toBeNull();
});

test("getSession returns the session payload for a valid cookie", async () => {
  await createSession("user-1", "user@example.com");

  const session = await getSession();
  expect(session).not.toBeNull();
  expect(session!.userId).toBe("user-1");
  expect(session!.email).toBe("user@example.com");
});

test("getSession returns null for a tampered or malformed token", async () => {
  cookieStore.set(COOKIE_NAME, { value: "not-a-valid-jwt" });
  expect(await getSession()).toBeNull();
});

test("getSession returns null for an expired token", async () => {
  const expiredToken = await new SignJWT({
    userId: "user-1",
    email: "user@example.com",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
    .sign(JWT_SECRET);

  cookieStore.set(COOKIE_NAME, { value: expiredToken });
  expect(await getSession()).toBeNull();
});

test("getSession returns null for a token signed with the wrong secret", async () => {
  const wrongSecret = new TextEncoder().encode("some-other-secret");
  const forgedToken = await new SignJWT({
    userId: "user-1",
    email: "user@example.com",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(wrongSecret);

  cookieStore.set(COOKIE_NAME, { value: forgedToken });
  expect(await getSession()).toBeNull();
});

test("deleteSession removes the session cookie", async () => {
  await createSession("user-1", "user@example.com");
  expect(cookieStore.has(COOKIE_NAME)).toBe(true);

  await deleteSession();
  expect(cookieStore.has(COOKIE_NAME)).toBe(false);
});

test("verifySession returns null when the request has no session cookie", async () => {
  const request = new NextRequest("http://localhost/");
  expect(await verifySession(request)).toBeNull();
});

test("verifySession returns the session payload for a request with a valid cookie", async () => {
  await createSession("user-1", "user@example.com");
  const token = cookieStore.get(COOKIE_NAME)!.value;

  const request = new NextRequest("http://localhost/", {
    headers: { cookie: `${COOKIE_NAME}=${token}` },
  });

  const session = await verifySession(request);
  expect(session).not.toBeNull();
  expect(session!.userId).toBe("user-1");
  expect(session!.email).toBe("user@example.com");
});

test("verifySession returns null for a request with an invalid cookie", async () => {
  const request = new NextRequest("http://localhost/", {
    headers: { cookie: `${COOKIE_NAME}=garbage` },
  });

  expect(await verifySession(request)).toBeNull();
});
