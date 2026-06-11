import type { Metadata } from "next";
import { CheckFlow } from "@/components/check/check-flow";
import { GradientBackground } from "@/components/shared/gradient-background";

export const metadata: Metadata = {
  title: "Check My Essay",
  description:
    "Check your draft against the assignment prompt and rubric before submitting.",
};

export default function CheckPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20 pt-28 sm:pt-32">
      <GradientBackground />
      <CheckFlow />
    </main>
  );
}
