"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabasePublicConfig } from "../config";

type BrowserAuthClient = ReturnType<typeof createBrowserClient>;

let browserClient: BrowserAuthClient | null | undefined;

export function browserAuthClient(): BrowserAuthClient | null {
  if (browserClient !== undefined) return browserClient;

  const config = supabasePublicConfig();
  browserClient = config
    ? createBrowserClient(config.url, config.publishableKey)
    : null;

  return browserClient;
}
