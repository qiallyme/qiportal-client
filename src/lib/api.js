/**
 * API utility function with error handling and authentication redirects
 * @param {string} path - API endpoint path
 * @param {Object} opts - Fetch options
 * @returns {Promise<Object>} API response or error object
 */
export async function api(path, opts = {}) {
  let res;
  try {
    res = await fetch(path, { credentials: "include", ...opts });
  } catch (err) {
    // Network or CORS error: surface a sane shape
    return { error: true, message: "Network error", detail: String(err) };
  }

  if (res.status === 401) {
    window.location.href = "/logout";
    return;
  }

  // Try JSON; if it fails, fall back to text.
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: true, message: "Invalid JSON", body: text };
  }
}
