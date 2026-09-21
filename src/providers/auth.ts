import type { AuthProvider } from "@refinedev/core";
import { kyInstance } from "./data";

type Session = {
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
} | null;

const getSession = async (): Promise<Session> => {
  try {
    return await kyInstance.get("auth/get-session").json<Session>();
  } catch {
    return null;
  }
};

export const authProvider: AuthProvider = {
  login: async ({ email, password, providerName }) => {
    if (providerName) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: `Sign in with ${providerName} isn't supported by this API.`,
        },
      };
    }

    try {
      const response = await kyInstance.post("auth/sign-in/email", {
        json: { email, password },
      });

      if (response.ok) {
        return { success: true, redirectTo: "/" };
      }

      const body = await response
        .json<{ error?: string }>()
        .catch(() => ({} as { error?: string }));
      return {
        success: false,
        error: {
          name: "LoginError",
          message: body?.error ?? "Invalid email or password",
        },
      };
    } catch {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Unable to reach the server",
        },
      };
    }
  },
  register: async ({ email, password, name, role, providerName }) => {
    if (providerName) {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: `Sign up with ${providerName} isn't supported by this API.`,
        },
      };
    }

    try {
      const response = await kyInstance.post("auth/sign-up/email", {
        json: { email, password, name, role },
      });

      if (response.ok) {
        return { success: true, redirectTo: "/" };
      }

      const body = await response
        .json<{ message?: string; error?: string }>()
        .catch(() => ({} as { message?: string; error?: string }));
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: body?.message ?? body?.error ?? "Unable to create an account",
        },
      };
    } catch {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: "Unable to reach the server",
        },
      };
    }
  },
  forgotPassword: async () => {
    return {
      success: false,
      error: {
        name: "ForgotPasswordError",
        message: "Password reset isn't supported by this API yet.",
      },
    };
  },
  logout: async () => {
    await kyInstance.post("auth/sign-out").catch(() => undefined);
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    const session = await getSession();
    if (session?.user) {
      return { authenticated: true };
    }
    return {
      authenticated: false,
      redirectTo: "/login",
      logout: true,
    };
  },
  onError: async (error) => {
    if (error?.statusCode === 401 || error?.statusCode === 403) {
      return { logout: true, redirectTo: "/login" };
    }
    return {};
  },
  getIdentity: async () => {
    const session = await getSession();
    return session?.user ?? null;
  },
};
