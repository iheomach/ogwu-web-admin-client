import { Link } from 'react-router-dom';
import '../styles/landing.css';

export function PrivacyPolicyPage() {
  return (
    <div className="lp-root min-h-screen">
      <header className="lp-navbar lp-navbar--scrolled">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/ogwu-logo-horizontal.png" alt="Ogwu" className="lp-nav-logo" />
          </Link>
          <Link to="/" className="lp-nav-link text-sm">← Back to home</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-4xl font-bold tracking-tight mb-2 lp-text-heading">Privacy Policy</h1>
        <p className="text-sm lp-text-body mb-10">Last updated: May 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 lp-text-body leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">1. Who We Are</h2>
            <p>
              Ogwu Health ("Ogwu", "we", "us", or "our") operates the Ogwu platform — an AI-assisted
              healthcare triage and appointment booking service. This Privacy Policy explains how we
              collect, use, store, and protect information when you use the Ogwu web admin dashboard
              (the "Service") or the Ogwu patient mobile application.
            </p>
            <p className="mt-3">
              For questions about this policy, contact us at{' '}
              <a href="mailto:iheoma@ogwu.app" className="underline">iheoma@ogwu.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">2. Information We Collect</h2>
            <p className="font-medium mb-2">2.1 Information you provide directly</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hospital or clinic name, address, and contact details during onboarding</li>
              <li>Provider account credentials (email and password, or phone OTP)</li>
              <li>Patient health records and documents uploaded through the platform</li>
              <li>Triage responses, consultation notes, and appointment details</li>
            </ul>

            <p className="font-medium mb-2 mt-4">2.2 Information collected automatically</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Device type, operating system, and browser information</li>
              <li>IP address and approximate location (city or region level)</li>
              <li>Usage logs — pages visited, actions taken, session duration</li>
              <li>Error and diagnostic data to maintain service reliability</li>
            </ul>

            <p className="font-medium mb-2 mt-4">2.3 Patient health data</p>
            <p>
              The Ogwu platform processes sensitive personal health information on behalf of healthcare
              providers ("controllers"). This includes triage responses, uploaded health records (PDFs
              and images), AI-generated urgency assessments, and consultation transcripts. Ogwu acts as
              a data processor under applicable law; the healthcare provider institution is the data
              controller for patient records.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide, operate, and improve the Ogwu platform and its AI features</li>
              <li>To process patient triage, match patients to appropriate hospitals, and facilitate appointment booking</li>
              <li>To extract and index health record content for AI-assisted contextual responses (RAG pipeline)</li>
              <li>To send push notifications and email alerts relevant to consultations or emergency escalations</li>
              <li>To authenticate users and maintain account security</li>
              <li>To monitor for abuse, enforce our Terms of Service, and comply with legal obligations</li>
              <li>To generate anonymised or aggregated analytics that improve the service — individual patients are never identified in aggregate reports</li>
            </ul>
            <p className="mt-3">
              We do not sell personal information to third parties. We do not use patient health data
              for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">4. Third-Party Services</h2>
            <p>Ogwu uses the following third-party sub-processors to deliver the Service:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><span className="font-medium">Supabase</span> — database hosting and authentication (EU and US regions)</li>
              <li><span className="font-medium">AWS (Amazon Web Services)</span> — document storage (S3), text extraction (Textract), serverless processing (Lambda), and transactional email (SES)</li>
              <li><span className="font-medium">OpenAI</span> — AI language model inference and document embedding; data submitted is subject to OpenAI's API data usage policy</li>
              <li><span className="font-medium">AWS Comprehend Medical</span> — medical entity extraction for urgency classification</li>
              <li><span className="font-medium">Google</span> — Calendar API for appointment slot availability and booking; Google Meet link generation</li>
              <li><span className="font-medium">Railway</span> — backend application hosting</li>
              <li><span className="font-medium">Expo / EAS</span> — mobile application distribution</li>
            </ul>
            <p className="mt-3">
              Each sub-processor is bound by data processing agreements consistent with applicable
              privacy regulations. We review sub-processors periodically and will update this list
              when material changes occur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">5. Data Retention</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Patient health records and document chunks are retained for as long as the associated hospital account is active, or until a deletion request is received</li>
              <li>Consultation and triage history is retained for a minimum of 3 years to support continuity of care, unless a shorter period is required by applicable law</li>
              <li>Provider account data is retained for 90 days after account termination before permanent deletion</li>
              <li>Server access logs are retained for 30 days</li>
            </ul>
            <p className="mt-3">
              Patients may request deletion of their health records at any time through the mobile app.
              Deletion removes document content and embeddings from our systems within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">6. Data Security</h2>
            <p>
              We apply industry-standard security controls including TLS encryption in transit,
              AES-256 encryption at rest for stored documents, scoped IAM roles with least-privilege
              access, and row-level security on patient data in the database. Access to production
              systems is limited to authorised personnel only.
            </p>
            <p className="mt-3">
              Despite these measures, no system is completely secure. In the event of a data breach
              that affects your rights, we will notify affected parties within 72 hours of becoming
              aware, as required by applicable regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">7. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Access a copy of the personal data we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal data ("right to be forgotten")</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Data portability — receive your data in a machine-readable format</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email{' '}
              <a href="mailto:iheoma@ogwu.app" className="underline">iheoma@ogwu.app</a>.
              We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">8. Children's Privacy</h2>
            <p>
              The Ogwu platform is not directed to children under the age of 13. We do not knowingly
              collect personal information from children under 13 without parental consent. If you
              believe a child has provided us personal information without consent, contact us and we
              will delete that information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">9. International Transfers</h2>
            <p>
              Ogwu operates primarily in Nigeria and processes data on infrastructure located in the
              United States and European Union. By using the Service, you acknowledge that your
              information may be transferred to and processed in these jurisdictions, which may have
              different data protection laws than your country of residence. We take appropriate
              safeguards — including standard contractual clauses where required — to protect
              transferred data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we make material changes, we
              will update the "Last updated" date at the top of this page and, where appropriate,
              notify active users by email. Your continued use of the Service after changes are posted
              constitutes acceptance of the updated policy.
            </p>
          </section>

        </div>
      </main>

      <footer className="lp-footer">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <img src="/ogwu-mark.png" alt="Ogwu" className="lp-footer-mark" />
            <p className="text-xs mt-1 lp-text-body">AI-powered triage for modern healthcare.</p>
          </div>
          <div className="flex items-center gap-6 text-xs lp-text-body">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
            <a href="mailto:iheoma@ogwu.app" className="hover:underline">Contact</a>
          </div>
          <p className="text-xs lp-text-body">© {new Date().getFullYear()} Ogwu Health</p>
        </div>
      </footer>
    </div>
  );
}
