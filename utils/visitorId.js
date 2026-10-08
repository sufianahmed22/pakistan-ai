// Anonymous, client-generated id used only to de-duplicate "unique visitors"
// per day in the site-traffic analytics. Not linked to any account - a
// logged-in user still gets one of these like anyone else. Persisted in
// localStorage so it's stable across sessions/tabs on the same browser.
const STORAGE_KEY = 'pk_ai_visitor_id';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getVisitorId() {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // Storage unavailable (private browsing, blocked, etc.) - fall back to a
    // per-load id; traffic still counts as a view, just not de-duplicated.
    return generateId();
  }
}
