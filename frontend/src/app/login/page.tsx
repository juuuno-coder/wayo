import { headers } from "next/headers";
import GabojagoLogin from "./GabojagoLogin";
import WayoLogin from "./WayoLogin";

export default async function LoginPage() {
  const host = (await headers()).get("host") || "";
  const isWayo = host.includes("wayo") && !host.includes("gabojago");

  return isWayo ? <WayoLogin /> : <GabojagoLogin />;
}
