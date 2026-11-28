import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/shared/supabase/config";

export { getSupabaseConfig } from "@/shared/supabase/config";

export function createSupabaseBrowserClient() {
  const config = getSupabaseConfig();
  return config ? createBrowserClient(config.url, config.key) : null;
}
