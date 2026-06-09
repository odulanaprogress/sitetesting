export function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] text-white py-10 sm:py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMTAgMjAgMTAgMjAgMjBzLTEwIDIwLTIwIDIwLTIwLTEwLTIwLTIwIDEwLTIwIDIwLTIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Terms &amp; Conditions</h1>
          <p className="text-white/75 text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>Welcome to Zeetech Distribution. By accessing or using our website and purchasing our products, you agree to be bound by these Terms and Conditions. Please read them carefully before placing an order.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. Company Information</h2>
            <p>Zeetech Distribution is a registered business operating from Lagos, Nigeria, with offices at:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
              <li><span className="font-semibold text-gray-800">Head Office:</span> Shop 58 &amp; 59 Global Update Plaza (GUP), Alaba International Market, Ojo, Lagos</li>
              <li><span className="font-semibold text-gray-800">Branch Office:</span> Shop 6 RBC Plaza, Opposite Building Material Market, Abule-ado, Lagos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. Products and Pricing</h2>
            <p>We reserve the right to modify product listings and prices at any time without prior notice. All prices are listed in Nigerian Naira (₦). Product images are for illustrative purposes and may vary slightly from actual products.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. Orders and Payment</h2>
            <p>By placing an order, you confirm that all information provided is accurate. We accept payments via Paystack (card and bank transfer). Orders are confirmed only after successful payment verification. We reserve the right to cancel or refuse orders at our discretion.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. Delivery</h2>
            <p>We deliver nationwide across Nigeria. Delivery timelines vary by location — typically 1–3 business days within Lagos and 3–7 business days for other states. Delivery fees are calculated at checkout based on your location. We are not responsible for delays caused by third-party logistics providers.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">6. Wholesale Orders</h2>
            <p>Wholesale pricing is available for bulk orders. To access wholesale pricing, customers must register and agree to our wholesale terms. Minimum order quantities apply. Wholesale prices are non-negotiable and subject to change.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">7. Warranty and Product Authenticity</h2>
            <p>All products sold by Zeetech Distribution are 100% genuine and sourced directly from authorized distributors. Products come with manufacturer warranties where applicable. Warranty claims must be initiated within the warranty period with proof of purchase.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p>Zeetech Distribution shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our products or services. Our maximum liability is limited to the purchase price of the product in question.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">9. Intellectual Property</h2>
            <p>All content on this website, including logos, images, text, and graphics, is the property of Zeetech Distribution or its licensors and is protected by applicable intellectual property laws. Unauthorized reproduction is prohibited.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">10. Governing Law</h2>
            <p>These Terms and Conditions are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved under Nigerian jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">11. Contact Us</h2>
            <p>For questions about these terms, please contact us:</p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>Phone: <a href="tel:08101144944" className="text-[#b91c1c] hover:underline">08101144944</a></li>
              <li>Email: <a href="mailto:zeetechdistributions@gmail.com" className="text-[#b91c1c] hover:underline">zeetechdistributions@gmail.com</a></li>
              <li>WhatsApp: <a href="https://wa.me/2348101144944" target="_blank" rel="noreferrer" className="text-[#b91c1c] hover:underline">08101144944</a></li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
