import { headers } from "next/headers";
import { isLoopbackHost, prototypeEnabled } from "./content/history-prototype";

/** Opt-in plus a loopback request. A flag alone cannot expose the prototype on a host. */
export async function canViewHistoryPrototype(): Promise<boolean> {
  if (!prototypeEnabled()) return false;
  const requestHeaders = await headers();
  return isLoopbackHost(requestHeaders.get("host"));
}
