import { ensurePlatformDataReady } from "@/lib/supabase/platform-data-bootstrap";

export async function prepareCommunicationsRuntime() {
  await ensurePlatformDataReady();
}
