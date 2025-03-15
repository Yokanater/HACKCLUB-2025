import Maps from "@/components/Map";
import Image from "next/image";

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", overflow:"hidden"}}>
      <Maps/>
    </div>
  );
}
