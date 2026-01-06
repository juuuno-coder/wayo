import { headers } from "next/headers";
import GabojagoSignup from "./GabojagoSignup";
import WayoSignup from "./WayoSignup";

export default async function SignupPage() {
  const host = (await headers()).get("host") || "";
  const isWayo = host.includes("wayo") && !host.includes("gabojago");

  return isWayo ? <WayoSignup /> : <GabojagoSignup />;
}
