import { Link } from 'react-router-dom';
import { Package, TruckIcon, CreditCard, Users, CheckCircle } from 'lucide-react';

export function WholesalePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMTAgMjAgMTAgMjAgMjBzLTEwIDIwLTIwIDIwLTIwLTEwLTIwLTIwIDEwLTIwIDIwLTIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-5">
            💼 Reseller & Bulk Orders
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Wholesale Partners</h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of resellers and retailers across Nigeria. Get exclusive wholesale pricing on all genuine products.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://wa.me/2348101144944?text=Hello, I want to become a wholesale partner"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#b91c1c] px-8 py-3.5 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-xl text-sm"
            >
              💬 Contact on WhatsApp
            </a>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-white/20 transition-all text-sm"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        {/* Why Choose Us */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">Why Choose Us for Wholesale?</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            We provide the best wholesale prices and reliable service for your business
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 sm:mb-14">
          {[
            { icon: Package, title: 'Quality Products', desc: 'Authentic, 100% genuine products. No clones, no refurbished items — sealed originals only.' },
            { icon: CreditCard, title: 'Best Prices', desc: 'Competitive wholesale pricing for bulk orders. Better margins for your business.' },
            { icon: TruckIcon, title: 'Fast Delivery', desc: 'Quick and reliable shipping to every state in Nigeria. Safely packaged every time.' },
            { icon: Users, title: 'Dedicated Support', desc: 'Direct WhatsApp support for all wholesale partners. We respond fast.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-red-50 border-2 border-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon className="text-[#b91c1c]" size={26} />
              </div>
              <h3 className="font-bold text-base mb-2 text-gray-900">{title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing Tiers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-10 sm:mb-14">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">Wholesale Pricing Tiers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div className="border-2 border-gray-100 rounded-xl p-5">
              <div className="text-[#b91c1c] font-bold text-lg mb-1">🥉 Bronze</div>
              <div className="text-3xl font-bold mb-3 text-gray-900">5–20 items</div>
              <div className="text-sm text-gray-500 mb-4">Save up to 15%</div>
              <ul className="text-sm space-y-2 text-gray-700">
                {['Standard pricing', 'Email support', 'Free delivery on ₦50k+'].map(i => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {i}</li>
                ))}
              </ul>
            </div>

            <div className="border-2 border-[#b91c1c] rounded-xl p-5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#b91c1c] text-white text-[11px] px-3 py-1 rounded-full font-bold">
                Most Popular
              </div>
              <div className="text-[#b91c1c] font-bold text-lg mb-1">🥈 Silver</div>
              <div className="text-3xl font-bold mb-3 text-gray-900">21–50 items</div>
              <div className="text-sm text-gray-500 mb-4">Save up to 25%</div>
              <ul className="text-sm space-y-2 text-gray-700">
                {['Discounted pricing', 'Priority support', 'Always free delivery', 'Extended payment terms'].map(i => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {i}</li>
                ))}
              </ul>
            </div>

            <div className="border-2 border-amber-300 rounded-xl p-5">
              <div className="text-amber-600 font-bold text-lg mb-1">🥇 Gold</div>
              <div className="text-3xl font-bold mb-3 text-gray-900">51+ items</div>
              <div className="text-sm text-gray-500 mb-4">Save up to 35%</div>
              <ul className="text-sm space-y-2 text-gray-700">
                {['Best wholesale prices', 'Dedicated account manager', 'Express delivery included', 'Custom payment plans', 'Early access to new stock'].map(i => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] rounded-2xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMTAgMjAgMTAgMjAgMjBzLTEwIDIwLTIwIDIwLTIwLTEwLTIwLTIwIDEwLTIwIDIwLTIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Start Your Business?</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Contact us today on WhatsApp to get your wholesale price list and start stocking your store with genuine products today.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://wa.me/2348101144944?text=Hello, I want to become a wholesale partner"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#b91c1c] px-8 py-3.5 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-xl text-sm"
              >
                💬 Contact on WhatsApp
              </a>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-white/20 transition-all text-sm"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
