import { Link } from 'react-router-dom';
import '../styles/landing.css';

export function TermsOfServicePage() {
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
        <h1 className="text-4xl font-bold tracking-tight mb-2 lp-text-heading">Terms of Service</h1>
        <p className="text-sm lp-text-body mb-10">Last updated: May 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 lp-text-body leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">1. Agreement to Terms</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of the Ogwu platform,
              including the web admin dashboard at{' '}
              <a href="https://ogwu.app" className="underline">ogwu.app</a> and the Ogwu patient
              mobile application (collectively, the "Service"), operated by Ogwu Health ("Ogwu",
              "we", "us", or "our").
            </p>
            <p className="mt-3">
              By creating an account or using the Service, you agree to be bound by these Terms and
              our <Link to="/privacy" className="underline">Privacy Policy</Link>. If you do not
              agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">2. Who May Use the Service</h2>
            <p>
              The Ogwu web admin dashboard is available to licensed healthcare providers, hospitals,
              and clinics ("Providers") that have been granted access by Ogwu. The Ogwu patient
              mobile application is available to individuals ("Patients") seeking healthcare
              information or appointment booking services.
            </p>
            <p className="mt-3">
              You must be at least 18 years of age to create a Provider account. Patients under 18
              may use the mobile application only with the consent of a parent or legal guardian.
              By using the Service you represent that you meet these eligibility requirements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">3. Nature of the Service — Not Medical Advice</h2>
            <p>
              <strong>Ogwu is a technology platform, not a licensed medical provider.</strong> The
              AI-generated triage assessments, urgency scores, drug interaction checks, and
              health-related responses provided through the Service are informational tools to
              support — not replace — professional medical judgement.
            </p>
            <p className="mt-3">
              Nothing on the Ogwu platform constitutes medical advice, diagnosis, or treatment.
              Patients should always consult a qualified healthcare professional for any health
              concern. In a medical emergency, call your local emergency services (e.g., 112 in
              Nigeria) immediately — do not rely solely on the Ogwu platform.
            </p>
            <p className="mt-3">
              Providers remain solely responsible for all clinical decisions made based on
              information surfaced through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">4. Provider Accounts and Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately at <a href="mailto:iheoma@ogwu.app" className="underline">iheoma@ogwu.app</a> if you suspect unauthorised access.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>Providers must ensure that patient data uploaded or accessed through the Service is handled in compliance with applicable health data regulations in your jurisdiction (including NDPR in Nigeria and applicable HIPAA-equivalent obligations).</li>
              <li>You must obtain appropriate patient consent before uploading or processing patient health records through the Service.</li>
              <li>You may not share account access with individuals outside your organisation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Use the Service for any unlawful purpose or in violation of any applicable regulation</li>
              <li>Upload content that is false, misleading, defamatory, or that violates the rights of any third party</li>
              <li>Attempt to gain unauthorised access to any part of the Service or its underlying infrastructure</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Reverse engineer, decompile, or extract the source code of the Service</li>
              <li>Use the Service to train competing AI models or to systematically scrape data</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with any entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">6. AI-Generated Content</h2>
            <p>
              The Ogwu platform uses large language models (including OpenAI GPT-4o) and medical
              entity extraction to generate responses, triage assessments, and booking assistance.
              AI-generated content may contain errors or omissions. Ogwu makes no warranty that
              AI outputs are accurate, complete, or appropriate for any specific clinical situation.
            </p>
            <p className="mt-3">
              Providers and Patients acknowledge that AI outputs require human review and must not
              be acted upon without appropriate professional oversight.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">7. Data and Privacy</h2>
            <p>
              Your use of the Service is governed by our{' '}
              <Link to="/privacy" className="underline">Privacy Policy</Link>, which is incorporated
              into these Terms by reference. By using the Service, you consent to the collection and
              use of your information as described in that policy.
            </p>
            <p className="mt-3">
              For Provider accounts, Ogwu acts as a data processor on your behalf. You remain the
              data controller for patient information you upload and are responsible for ensuring
              lawful grounds for processing under applicable regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">8. Intellectual Property</h2>
            <p>
              The Ogwu name, logo, platform design, and all associated software are the exclusive
              property of Ogwu Health or its licensors. These Terms do not grant you any right,
              title, or interest in our intellectual property beyond the limited licence to use the
              Service as described herein.
            </p>
            <p className="mt-3">
              You retain all rights to content and data you upload to the Service. By uploading
              content, you grant Ogwu a limited, non-exclusive licence to process that content
              solely for the purpose of delivering the Service to you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">9. Fees and Payment</h2>
            <p>
              Access to certain features of the Service may require a paid subscription or
              transaction fee. Fee amounts, billing cycles, and payment terms will be disclosed at
              the time of purchase or in a separate agreement with your institution. All fees are
              non-refundable unless required by applicable law or stated otherwise in writing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">10. Disclaimers and Limitation of Liability</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p className="mt-3">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OGWU HEALTH SHALL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
              FROM YOUR USE OF OR INABILITY TO USE THE SERVICE, INCLUDING ANY CLINICAL DECISIONS
              MADE IN RELIANCE ON AI-GENERATED OUTPUTS.
            </p>
            <p className="mt-3">
              OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR THE
              SERVICE SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO OGWU IN THE 12 MONTHS PRECEDING
              THE CLAIM, OR NGN 50,000 IF NO FEES HAVE BEEN PAID.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Ogwu Health, its officers, employees, and
              agents from any claims, damages, or expenses (including reasonable legal fees) arising
              from: (a) your use of the Service; (b) your violation of these Terms; (c) your
              violation of any applicable law or third-party right; or (d) any patient data you
              upload, process, or otherwise handle through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">12. Termination</h2>
            <p>
              Ogwu may suspend or terminate your access to the Service at any time, with or without
              notice, for conduct that we determine violates these Terms or is otherwise harmful to
              the Service, other users, or third parties. You may terminate your account at any time
              by contacting us at <a href="mailto:iheoma@ogwu.app" className="underline">iheoma@ogwu.app</a>.
            </p>
            <p className="mt-3">
              Upon termination, your right to use the Service ceases immediately. Provisions of
              these Terms that by their nature should survive termination (including sections on
              intellectual property, disclaimers, and limitation of liability) shall survive.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">13. Governing Law and Disputes</h2>
            <p>
              These Terms are governed by the laws of the Federal Republic of Nigeria. Any dispute
              arising from or relating to these Terms or the Service shall first be subject to good
              faith negotiation between the parties. If unresolved within 30 days, disputes shall
              be submitted to the jurisdiction of the courts of Lagos State, Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">14. Changes to These Terms</h2>
            <p>
              We may revise these Terms from time to time. When we make material changes, we will
              update the "Last updated" date above and notify active Provider accounts by email at
              least 14 days before the changes take effect. Your continued use of the Service after
              that date constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold lp-text-heading mb-3">15. Contact</h2>
            <p>
              For questions about these Terms, contact us at{' '}
              <a href="mailto:iheoma@ogwu.app" className="underline">iheoma@ogwu.app</a> or visit{' '}
              <a href="https://ogwu.app" className="underline">ogwu.app</a>.
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
