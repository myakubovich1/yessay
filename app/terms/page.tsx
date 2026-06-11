import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal placeholder"
      title="Terms of Use"
      updated="June 10, 2026"
    >
      <section>
        <h2 className="text-lg font-semibold text-[#2a374d]">
          Revision guidance only
        </h2>
        <p className="mt-2">
          Yessay provides automated feedback and possible issue flags for
          educational revision. It does not guarantee grades, verify every
          citation, or replace assignment instructions, academic policies, or
          instructor feedback.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[#2a374d]">
          Your responsibility
        </h2>
        <p className="mt-2">
          You remain responsible for the authorship, accuracy, citations, and
          final submission of your work. Use Yessay consistently with your
          institution&apos;s academic-integrity rules and your professor&apos;s
          instructions.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[#2a374d]">
          Availability and payments
        </h2>
        <p className="mt-2">
          Single Report and Finals Pass are one-time purchases. Finals Pass
          access expires seven days after purchase. Monthly and Annual plans are
          recurring subscriptions that renew at the cadence shown during
          checkout unless canceled through the production billing system.
          Refund, cancellation, support, and service-availability terms must be
          finalized by qualified counsel before launch.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[#2a374d]">
          Limitation placeholder
        </h2>
        <p className="mt-2">
          Automated analysis can be incomplete or incorrect. Confirm all flagged
          issues and recommendations against the original prompt, rubric,
          sources, and course requirements.
        </p>
      </section>
    </LegalPage>
  );
}
