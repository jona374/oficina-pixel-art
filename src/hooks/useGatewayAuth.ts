"use client";

import { useCallback, useState } from "react";
import { connectWithGatewayToken } from "@/lib/openclawClient";

type AuthState = "logged-out" | "validating" | "authenticated" | "invalid";

export function useGatewayAuth() {
  const [authState, setAuthState] = useState<AuthState>("logged-out");

  const login = useCallback(async (token: string) => {
    setAuthState("validating");
    const ok = await connectWithGatewayToken(token);
    setAuthState(ok ? "authenticated" : "invalid");
    return ok;
  }, []);

  return { authState, login };
}
