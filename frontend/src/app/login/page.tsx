import { headers } from "next/headers";
import GabojagoLogin from "./GabojagoLogin";
import WayoLogin from "./WayoLogin";

export default async function LoginPage() {
  const host = (await headers()).get("host") || "";
  // Default to Wayo for localhost, otherwise check for gabojago subdomain
  const isWayo = host.includes("localhost") || (host.includes("wayo") && !host.includes("gabojago"));

  return isWayo ? <WayoLogin /> : <GabojagoLogin />;
}
