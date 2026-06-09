import { Link } from 'react-router-dom';
import { Shield, Package, MapPin, Users, CheckCircle, TruckIcon, Star, Zap } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMTAgMjAgMTAgMjAgMjBzLTEwIDIwLTIwIDIwLTIwLTEwLTIwLTIwIDEwLTIwIDIwLTIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-5">
            <Shield size={12} /> Trusted Since Day One
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">Who We Are</h1>
          <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
            Zee-Tech Distributions is your trusted source for premium smartphones accessories and electronics in Nigeria. From Infinix smartwatches and earbuds to powerbanks, chargers and cables, we stock only genuine products at the most competitive prices in the market.
          </p>
        </div>
      </section>

      {/* What We Do + Why Choose Us */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border border-red-100">
              <div className="w-14 h-14 bg-[#b91c1c] rounded-xl flex items-center justify-center mb-5">
                <Package size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
              <p className="text-gray-700 leading-relaxed">
                We make it easy for individuals, families and resellers across Nigeria to access quality electronics accessories without stress. Whether you're shopping for personal use or stocking up your store, Zee-Tech delivers the real deal, every single time.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border border-red-100">
              <div className="w-14 h-14 bg-[#b91c1c] rounded-xl flex items-center justify-center mb-5">
                <Shield size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
              <p className="text-gray-700 leading-relaxed">
                Every product we sell is 100% original and sealed. No clones. No refurbished items. Just genuine quality you can trust and resell with confidence. We've built our reputation on three things — authentic products, fast delivery and honest service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMTAgMjAgMTAgMjAgMjBzLTEwIDIwLTIwIDIwLTIwLTEwLTIwLTIwIDEwLTIwIDIwLTIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Our Core Values</h2>
            <p className="text-white/80">Everything we do is built on these pillars</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: CheckCircle, title: 'Authenticity', desc: '100% genuine, sealed products. No clones, no fakes — ever.' },
              { icon: Zap, title: 'Speed', desc: 'Fast delivery nationwide. We package safely and ship quickly.' },
              { icon: Star, title: 'Honesty', desc: 'Transparent pricing, honest service. What you see is what you get.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nationwide Delivery */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <TruckIcon size={32} className="text-[#b91c1c]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">We Deliver Nationwide</h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Based in Nigeria and proud of it. We deliver to every state across the country. Order today and get your products delivered fast, safely packaged and exactly as described.
          </p>
          <div className="flex items-center justify-center gap-2 mt-5">
            <MapPin size={18} className="text-[#b91c1c]" />
            <span className="text-gray-600 text-sm">Shop 6 RBC plaza, Opposite Building Material Market, Abule-ado, Lagos</span>
          </div>
        </div>
      </section>

      {/* Wholesale CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-[#7f1d1d] via-[#991b1b] to-[#b91c1c] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMTAgMjAgMTAgMjAgMjBzLTEwIDIwLTIwIDIwLTIwLTEwLTIwLTIwIDEwLTIwIDIwLTIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-5">
            <Users size={28} className="text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Wholesale & Bulk Orders</h2>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-7">
            Are you a reseller or shop owner? We offer exclusive wholesale pricing for bulk buyers. Contact us directly on WhatsApp to get your wholesale price list and start stocking your store with genuine products today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://wa.me/2348101144944?text=Hello, I want wholesale pricing"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#b91c1c] px-8 py-3.5 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-xl text-sm"
            >
              💬 Get Wholesale Prices
            </a>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-white/20 transition-all text-sm"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
