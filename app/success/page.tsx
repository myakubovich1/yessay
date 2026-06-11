import type { Metadata } from "next";
import { SuccessView } from "@/components/shared/success-view";
import { GradientBackground } from "@/components/shared/gradient-background";

export const metadata: Metadata = {
  title: "Access Unlocked",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string | string[];
    demo_token?: string | string[];
  }>;
}) {
  const query = await searchParams;
  const sessionId =
    typeof query.session_id === "string" ? query.session_id : undefined;
  const demoToken =
    typeof query.demo_token === "string" ? query.demo_token : undefined;

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden px-4 py-28">
      <GradientBackground />
      <SuccessView sessionId={sessionId} demoToken={demoToken} />
    </main>
  );
}
