export function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] text-white py-10 sm:py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMTAgMjAgMTAgMjAgMjBzLTEwIDIwLTIwIDIwLTIwLTEwLTIwLTIwIDEwLTIwIDIwLTIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Refund &amp; Returns Policy</h1>
          <p className="text-white/75 text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">Our Commitment</h2>
            <p>At Zeetech Distribution, customer satisfaction is our priority. We sell only genuine products and stand behind the quality of every item we sell. If you are not completely satisfied with your purchase, we're here to help.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">Return Eligibility</h2>
            <p>You may return a product within <span className="font-semibold text-gray-900">7 days</span> of delivery, provided:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
              <li>The item is unused and in its original packaging</li>
              <li>All accessories, manuals, and original labels are intact</li>
              <li>You have a valid proof of purchase (order confirmation or receipt)</li>
              <li>The item is defective, damaged on arrival, or not as described</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">Non-Returnable Items</h2>
            <p>The following items are not eligible for return:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
              <li>Items that have been used, damaged by the customer, or altered</li>
              <li>Items without original packaging or missing accessories</li>
              <li>Products returned after 7 days of delivery</li>
              <li>Items purchased during clearance or final sales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">How to Initiate a Return</h2>
            <p>To start a return, please contact us within 7 days of receiving your order:</p>
            <ol className="mt-3 space-y-3 list-decimal list-inside text-gray-600">
              <li>Contact our support team via WhatsApp or email with your order details</li>
              <li>Describe the issue and attach clear photos of the product and packaging</li>
              <li>Our team will review your request within 24–48 hours</li>
              <li>If approved, we will provide return instructions and a pickup/drop-off arrangement</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">Refund Process</h2>
            <p>Once we receive and inspect the returned item, we will notify you of the approval or rejection of your refund.</p>
            <div className="mt-3 space-y-2 text-gray-600">
              <p><span className="font-semibold text-gray-800">Approved refunds</span> will be processed within <span className="font-semibold">5–7 business days</span> to your original payment method or via bank transfer.</p>
              <p><span className="font-semibold text-gray-800">Rejected returns</span> will be returned to you at your expense.</p>
              <p>Original delivery fees are non-refundable unless the return is due to our error (wrong item sent, defective product).</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">Exchanges</h2>
            <p>We offer exchanges for defective or incorrect items. If you received a wrong or faulty product, we will send a replacement at no additional cost. Exchange requests must also be made within 7 days of delivery.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">Warranty Claims</h2>
            <p>Products covered by manufacturer warranties should be handled through the respective manufacturer's warranty process. We can assist you with the claim process. Contact us and we'll guide you through the steps.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">Contact Us</h2>
            <p>For returns, refunds, or any order issues, reach us through:</p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>WhatsApp: <a href="https://wa.me/2348101144944" target="_blank" rel="noreferrer" className="text-[#b91c1c] hover:underline">08101144944</a></li>
              <li>Phone: <a href="tel:08101144944" className="text-[#b91c1c] hover:underline">08101144944</a></li>
              <li>Email: <a href="mailto:zeetechdistributions@gmail.com" className="text-[#b91c1c] hover:underline">zeetechdistributions@gmail.com</a></li>
            </ul>
            <p className="mt-3 text-gray-500">Business hours: Monday – Saturday, 8am – 6pm (WAT)</p>
          </section>

        </div>
      </div>
    </div>
  );
}
