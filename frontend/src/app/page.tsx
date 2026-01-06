import { headers } from "next/headers";
import WayoHome from "@/components/home/WayoHome";
import GabojagoHome from "@/components/home/GabojagoHome";

export default async function Home() {
  const host = (await headers()).get("host") || "";
  const isWayo = host.includes("wayo") && !host.includes("gabojago");

  return isWayo ? <WayoHome /> : <GabojagoHome />;
}
