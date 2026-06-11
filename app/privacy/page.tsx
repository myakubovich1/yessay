import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal placeholder"
      title="Privacy Notice"
      updated="June 10, 2026"
    >
      <section>
        <h2 className="text-lg font-semibold text-[#2a374d]">Demo storage</h2>
        <p className="mt-2">
          Without Supabase credentials, reports are stored in your
          browser&apos;s local storage. Clearing site data or using another
          browser will remove or hide those reports and locally recorded access
          grants.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[#2a374d]">Essay analysis</h2>
        <p className="mt-2">
          Without an OpenAI API key, analysis is performed by the app&apos;s
          deterministic demo logic. When a production API key is configured,
          assignment, rubric, and draft text may be sent to the configured model
          provider to generate the report. The server keeps the API key out of
          browser code and requests that OpenAI not store analysis responses.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[#2a374d]">
          Production requirements
        </h2>
        <p className="mt-2">
          Before launch, this notice should be updated to describe the actual
          hosting provider, database retention, model-provider settings, payment
          processor, analytics tools, cookies, deletion process, and contact
          information.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[#2a374d]">
          Minimize sensitive data
        </h2>
        <p className="mt-2">
          Do not paste private information that is not needed for essay review.
          Remove student IDs, addresses, confidential research data, and other
          sensitive details before analysis.
        </p>
      </section>
    </LegalPage>
  );
}
