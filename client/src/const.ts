export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL || import.meta.env.OAUTH_SERVER_URL;
  const appId = import.meta.env.VITE_APP_ID || import.meta.env.APP_ID;

  if (!oauthPortalUrl || !appId) {
    console.error("OAuth configuration missing: VITE_OAUTH_PORTAL_URL or VITE_APP_ID is not defined.");
    return "/auth-error"; // Fallback path
  }

  try {
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const state = btoa(redirectUri);

    // Ensure the portal URL has a protocol
    let portalUrl = oauthPortalUrl;
    if (!portalUrl.startsWith("http://") && !portalUrl.startsWith("https://")) {
      portalUrl = `https://${portalUrl}`;
    }

    const url = new URL(`${portalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    console.error("Failed to generate login URL:", error);
    return "/auth-error";
  }
};
