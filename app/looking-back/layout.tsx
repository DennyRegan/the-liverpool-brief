import { historyFonts } from "@/app/components/history-fonts";

/** Every page under /looking-back gets The Back Pages typefaces. The wrapper adds no box (display: contents). */
export default function LookingBackLayout({ children }: { children: React.ReactNode }) {
  return <div className={`lb-fonts ${historyFonts}`} style={{ display: "contents" }}>{children}</div>;
}
