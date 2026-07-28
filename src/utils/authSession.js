import axios from "axios";

export const AUTH_STORAGE_KEY = "msbc_dashboard_auth";
const LOGIN_PATH = "/dashboard-new/login";

let redirecting = false;
let onUnauthorized = null;

/** Register callback (e.g. AuthContext logout) before redirect */
export function setUnauthorizedHandler(fn) {
  onUnauthorized = typeof fn === "function" ? fn : null;
}

export function isJwtExpired(token) {
  if (!token || typeof token !== "string") return true;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload?.exp) return false;
    // small clock skew buffer (10s)
    return Date.now() >= payload.exp * 1000 - 10_000;
  } catch {
    return true;
  }
}

export function clearAuthStorage() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function isUnauthorizedResponse(status, body) {
  if (Number(status) === 401) return true;
  const msg = String(body?.error || body?.message || body?.msg || "").toLowerCase();
  if (!msg) return false;
  return (
    msg.includes("invalid or expired token") ||
    msg.includes("expired token") ||
    msg.includes("authentication token missing") ||
    (msg.includes("token") && (msg.includes("expired") || msg.includes("invalid")))
  );
}

/**
 * Clear JWT and send user to login. Safe to call multiple times.
 */
export function handleUnauthorizedSession() {
  if (redirecting) return;
  redirecting = true;

  try {
    onUnauthorized?.();
  } catch {
    /* ignore */
  }
  clearAuthStorage();

  try {
    const path = window.location?.pathname || "";
    if (!path.includes(LOGIN_PATH)) {
      window.location.replace(LOGIN_PATH);
      return;
    }
  } catch {
    /* ignore */
  }

  redirecting = false;
}

function shouldInspectAuthFailure(url, init) {
  const u = String(url || "");
  // Only dashboard/API auth traffic — not public website pages
  if (u.includes("/api/")) return true;
  const headers = init?.headers;
  if (!headers) return false;
  if (typeof headers.get === "function") {
    return Boolean(headers.get("Authorization") || headers.get("authorization"));
  }
  const auth = headers.Authorization || headers.authorization;
  return Boolean(auth);
}

async function peekUnauthorized(res) {
  if (!res || res.status !== 401) return false;
  try {
    const clone = res.clone();
    const data = await clone.json().catch(() => null);
    return isUnauthorizedResponse(res.status, data);
  } catch {
    return res.status === 401;
  }
}

let interceptorsInstalled = false;

/**
 * Install once: axios + fetch interceptors for expired/invalid JWT.
 */
export function installAuthSessionGuards() {
  if (interceptorsInstalled || typeof window === "undefined") return;
  interceptorsInstalled = true;

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const data = error?.response?.data;
      if (isUnauthorizedResponse(status, data)) {
        handleUnauthorizedSession();
      }
      return Promise.reject(error);
    }
  );

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input?.url;
    const res = await originalFetch(input, init);
    if (shouldInspectAuthFailure(url, init) && (await peekUnauthorized(res))) {
      handleUnauthorizedSession();
    }
    return res;
  };
}
