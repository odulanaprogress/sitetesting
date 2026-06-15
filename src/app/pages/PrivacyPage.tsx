import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 text-sm transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-white/70 mt-1 text-sm">Last updated: May 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Zeetech Distribution (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting the privacy and personal data of our customers. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website or purchase products from us.
            </p>
            <p className="mt-3">
              By creating an account or making a purchase on our platform, you agree to the terms described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect the following types of personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Full name, email address, phone number, and delivery address when you register an account.</li>
              <li><strong>Order Information:</strong> Purchase history, product details, payment method, and delivery information associated with your orders.</li>
              <li><strong>Communication Data:</strong> Messages you send to us via WhatsApp, email, or our contact form.</li>
              <li><strong>Device Information:</strong> Browser type, IP address, and browsing behaviour on our website for security and analytics purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">Your personal data is used to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders, including delivery and payment confirmation</li>
              <li>Send order confirmations, invoices, and delivery updates to your email address</li>
              <li>Provide customer support and respond to your enquiries</li>
              <li>Notify you of special offers, new products, or wholesale deals (only if you opt in)</li>
              <li>Improve our website and shopping experience based on usage patterns</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Storage & Security</h2>
            <p>
              Your data is stored securely and we take appropriate technical and organisational measures to prevent unauthorised access, disclosure, or loss of your personal information. We use industry-standard encryption for sensitive data and payment information is processed securely through Paystack.
            </p>
            <p className="mt-3">
              We do not store your full payment card details on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Sharing Your Information</h2>
            <p className="mb-3">We do not sell, rent, or trade your personal data. We may share limited information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Delivery Partners:</strong> Your name, address, and phone number to facilitate delivery of your orders.</li>
              <li><strong>Payment Processors (Paystack):</strong> For secure payment processing only.</li>
              <li><strong>Legal Authorities:</strong> If required by law or to prevent fraud.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Lodge a complaint with the relevant data protection authority</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:zeetechdistributions@gmail.com" className="text-blue-600 hover:underline font-medium">
                zeetechdistributions@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Cookies</h2>
            <p>
              Our website uses cookies and local storage to maintain your session, remember your shopping cart, and improve your browsing experience. You can disable cookies in your browser settings, but this may affect the functionality of the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed at children under the age of 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any significant changes will be communicated via email or a notice on our website. Your continued use of our services after such updates constitutes your acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
            <p className="mb-3">For any questions or concerns about this Privacy Policy or your personal data, contact us:</p>
            <div className="bg-red-50 rounded-xl p-5 space-y-2 text-sm">
              <p><strong>Zeetech Distribution</strong></p>
              <p>Shop 6 RBC plaza, Opposite Building Material Market, Abule-ado, Lagos</p>
              <p>Phone / WhatsApp: <a href="tel:08101144944" className="text-blue-600 hover:underline">08101144944</a></p>
              <p>Email: <a href="mailto:zeetechdistributions@gmail.com" className="text-blue-600 hover:underline">zeetechdistributions@gmail.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
