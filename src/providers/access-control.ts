import type { AccessControlProvider } from "@refinedev/core";
import { getSession } from "./auth";

const ADMIN_ONLY_ACTIONS = new Set(["create", "edit", "delete"]);

// `can()` runs once per action button per rendered row -- a 10-row list with
// show/edit/delete is 30 calls in one render. Without this, each would hit
// auth/get-session separately; a short-lived cache collapses them to one.
const SESSION_CACHE_MS = 5000;
let cachedSessionPromise: ReturnType<typeof getSession> | null = null;
let cachedAt = 0;

const getCachedSession = () => {
  const now = Date.now();
  if (!cachedSessionPromise || now - cachedAt > SESSION_CACHE_MS) {
    cachedSessionPromise = getSession();
    cachedAt = now;
  }
  return cachedSessionPromise;
};

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const session = await getCachedSession();
    const role = session?.user?.role;

    if (!role) return { can: false, reason: "Not authenticated" };
    if (role === "admin") return { can: true };

    if (resource === "users") {
      return { can: false, reason: "Only admins can manage users" };
    }

    if ((resource === "departments" || resource === "subjects") && ADMIN_ONLY_ACTIONS.has(action)) {
      return { can: false, reason: "Only admins can manage the department/subject catalog" };
    }

    // classes/enrollments create/edit/delete are allowed for teachers here;
    // ownership (their own classes only) is enforced server-side.
    return { can: true };
  },
};
