import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { testimonials as staticTestimonials, banners as staticBanners } from '../data/mockData';
import { ChevronRight, ChevronLeft, Star, TruckIcon, Shield, HeadphonesIcon, Zap, CheckCircle, MapPin, Users, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import product1 from '../../imports/product_1-1.jpeg';
import product5 from '../../imports/product5-1.jpeg';

interface Slide { id: string; title: string; subtitle: string; cta: string; image?: string; order: number; }
interface Testimonial { id: string; name: string; text: string; rating: number; avatar: string; order: number; }
interface CategoryImage { id: string; title: string; description: string; category: string; image: string; overlay: string; order: number; }

export function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [categoryImages, setCategoryImages] = useState<CategoryImage[]>([]);
  const { products } = useProducts();

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'slides'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        setSlides(snap.docs.map(d => ({ id: d.id, ...d.data() } as Slide)));
      }
    }, () => {});
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));
      }
    }, () => {});
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'categoryImages'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        setCategoryImages(snap.docs.map(d => ({ id: d.id, ...d.data() } as CategoryImage)));
      }
    }, () => {});
    return () => unsub();
  }, []);

  const banners = slides.length > 0 ? slides : staticBanners;
  const displayTestimonials = testimonials.length > 0 ? testimonials : staticTestimonials;
  const defaultCategories = [
    { id: '1', to: '/products?category=phone-accessories', img: product5, title: 'Phone Accessories', description: 'Earbuds, cases, holders & more', category: 'phone-accessories', overlay: 'from-[#b91c1c]', order: 1 },
    { id: '2', to: '/products?category=charging-accessories', img: product1, title: 'Charging Accessories', description: 'Power banks, chargers & cables', category: 'charging-accessories', overlay: 'from-[#d97706]', order: 2 },
    { id: '3', to: '/products?category=computer-accessories', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', title: 'Computer Accessories', description: 'Keyboards, mice, webcams & more', category: 'computer-accessories', overlay: 'from-[#b91c1c]', order: 3 },
  ];
  const displayCategories = categoryImages.length > 0 ? categoryImages.map(c => ({ ...c, to: `/products?category=${c.category}`, img: c.image, desc: c.description })) : defaultCategories.map(c => ({ ...c, desc: c.description }));
  const featuredProducts = products.filter(p => p.featured);
  const trendingDeals = products.filter(p => p.hot);
  const latestProducts = [...products].slice(-6).reverse();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-[260px] sm:h-[340px] md:h-[440px] bg-gradient-to-br from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMTAgMjAgMTAgMjAgMjBzLTEwIDIwLTIwIDIwLTIwLTEwLTIwLTIwIDEwLTIwIDIwLTIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight drop-shadow-lg">
              {banners[currentBanner].title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-white/90 leading-relaxed drop-shadow-md max-w-xl hidden sm:block">
              {banners[currentBanner].subtitle}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#b91c1c] px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-lg font-bold transition-all shadow-xl text-sm sm:text-base"
            >
              {banners[currentBanner].cta} <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-[4px]">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`rounded-full transition-all !min-h-0 ${
                idx === currentBanner
                  ? 'bg-white w-[5px] h-[5px]'
                  : 'bg-white/40 w-[4px] h-[4px]'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <button onClick={() => setCurrentBanner(p => (p - 1 + banners.length) % banners.length)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all"
          aria-label="Previous">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => setCurrentBanner(p => (p + 1) % banners.length)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all"
          aria-label="Next">
          <ChevronRight size={18} />
        </button>
      </section>

      {/* Trust Badges — white bg */}
      <section className="py-4 sm:py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-3 sm:gap-8">
          {[
            { icon: TruckIcon, title: 'Free Delivery', color: 'text-[#b91c1c]', bg: 'bg-red-50' },
            { icon: Shield, title: '100% Genuine', color: 'text-green-600', bg: 'bg-green-50' },
            { icon: HeadphonesIcon, title: '24/7 Support', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(({ icon: Icon, title, color, bg }) => (
            <div key={title} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <div className={`p-2.5 sm:p-3 ${bg} rounded-xl flex-shrink-0`}>
                <Icon className={color} size={22} />
              </div>
              <div className="text-center sm:text-left">
                <div className={`font-bold text-xs sm:text-sm ${color}`}>{title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category — white bg */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1.5">Shop by Category</h2>
            <p className="text-sm text-gray-500">Browse our collection of genuine products</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {displayCategories.map(({ to, img, title, desc, overlay }) => (
              <Link key={title} to={to}
                className="group relative rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden min-h-[200px] sm:min-h-[260px] transform hover:-translate-y-1 border border-gray-100">
                <div className="absolute inset-0">
                  <img src={img} alt={title} className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${overlay} via-${overlay}/60 to-transparent`} />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 drop-shadow-md">{title}</h3>
                  <p className="text-white/85 text-xs sm:text-sm mb-2">{desc}</p>
                  <span className="inline-flex items-center gap-1 text-white font-bold text-xs group-hover:gap-2 transition-all">
                    Shop Now <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      {latestProducts.length > 0 && (
        <section className="py-6 sm:py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-5 sm:mb-7">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-red-100 text-[#b91c1c] text-xs font-bold px-2.5 py-1 rounded-full mb-1.5">
                  <Zap size={11} /> New Arrivals
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Latest Products</h2>
              </div>
              <Link to="/products" className="flex items-center gap-1 bg-[#b91c1c] hover:bg-[#991b1b] text-white px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-sm">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {latestProducts.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Deals */}
      {trendingDeals.length > 0 && (
        <section className="py-6 sm:py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-5 sm:mb-7">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-red-100 text-[#b91c1c] text-xs font-bold px-2.5 py-1 rounded-full mb-1.5">
                  🔥 Limited Time
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trending Deals</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Hot products flying off the shelf</p>
              </div>
              <Link to="/products" className="hidden sm:flex items-center gap-1 border border-[#b91c1c] text-[#b91c1c] hover:bg-red-50 px-4 py-2 rounded-lg font-bold text-sm transition-all">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {trendingDeals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-6 sm:py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-5 sm:mb-7">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Featured Products</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Handpicked best sellers</p>
              </div>
              <Link to="/products" className="text-[#b91c1c] hover:text-[#991b1b] flex items-center gap-1 text-xs sm:text-sm font-bold">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Us */}
      <section className="py-10 sm:py-14 bg-white relative">
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-100 text-[#b91c1c] text-xs font-bold px-3 py-1.5 rounded-full mb-3">
              <Package size={12} /> Who Are We
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Who Are We</h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              ZEE-TECH DISTRIBUTIONS ENTERPRISES is a registered business specializing in distribution of quality and reliable phone accessories, computer accessories, content creation kits and IT solutions. We are committed to providing reliable technology products and security solutions for homes, offices, and businesses, with a focus on quality service and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {[
              { icon: Package, title: 'What We Do', text: 'Making it easy for individuals, families and resellers across Nigeria to access quality electronics without stress. The real deal, every single time.', color: 'text-[#b91c1c]', bg: 'bg-red-50', borderColor: 'border-red-100' },
              { icon: CheckCircle, title: 'Why Choose Us', text: 'Every product is 100% original and sealed. No clones, no refurbished items. Built on authentic products, fast delivery and honest service.', color: 'text-green-600', bg: 'bg-green-50', borderColor: 'border-green-100' },
              { icon: MapPin, title: 'Nationwide Delivery', text: 'Based in Nigeria and proud of it. We deliver to every state. Order today — fast, safely packaged and exactly as described.', color: 'text-[#d97706]', bg: 'bg-amber-50', borderColor: 'border-amber-100' },
            ].map(({ icon: Icon, title, text, color, bg, borderColor }) => (
              <div key={title} className={`${bg} border ${borderColor} rounded-xl p-5 hover:shadow-md transition-all`}>
                <div className={`w-10 h-10 ${bg} border ${borderColor} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className={`font-bold text-base mb-2 ${color}`}>{title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#b91c1c] to-[#991b1b] rounded-2xl p-6 sm:p-8 text-center shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-2">Wholesale & Bulk Orders</h3>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto mb-5">
              Are you a reseller or shop owner? We offer exclusive wholesale pricing for bulk buyers. Contact us on WhatsApp to get your price list today.
            </p>
            <a href="https://wa.me/2348101144944" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#b91c1c] px-6 py-3 rounded-lg font-bold transition-all shadow-lg text-sm">
              💬 Contact on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials — white bg, Nigerian avatars, name top-left, stars bottom */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Trusted by thousands across Nigeria</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {displayTestimonials.map(t => (
              <div key={t.id} className="bg-gray-50 border border-gray-100 p-5 sm:p-6 rounded-2xl hover:shadow-md transition-all">
                {/* Name + photo top left */}
                <div className="flex items-center gap-3 mb-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-red-100 flex-shrink-0" />
                  <div className="font-bold text-sm text-gray-900">{t.name}</div>
                </div>
                <p className="text-gray-600 italic text-xs sm:text-sm leading-relaxed mb-4">{t.text}</p>
                {/* Stars bottom */}
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-8 sm:py-12 bg-gradient-to-br from-[#7f1d1d] via-[#991b1b] to-[#b91c1c] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMTAgMjAgMTAgMjAgMjBzLTEwIDIwLTIwIDIwLTIwLTEwLTIwLTIwIDEwLTIwIDIwLTIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Stay Updated with Zeetech</h2>
          <p className="mb-5 text-white/85 text-xs sm:text-sm max-w-xl mx-auto">Get notified about new products, special offers and exclusive wholesale deals</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-white text-[#b91c1c] placeholder-[#b91c1c]/60 focus:outline-none focus:ring-2 focus:ring-white text-sm shadow-lg font-medium"
            />
            <button className="bg-[#7f1d1d] border border-white/30 text-white px-6 py-3 rounded-lg font-bold hover:bg-[#991b1b] transition-all text-sm whitespace-nowrap shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { val: '10K+', label: 'Orders Delivered' },
              { val: '500+', label: 'Happy Customers' },
              { val: '100%', label: 'Genuine Products' },
            ].map(({ val, label }) => (
              <div key={label}>
                <div className="text-2xl sm:text-4xl font-bold text-[#b91c1c] mb-1">{val}</div>
                <div className="text-gray-500 text-xs sm:text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
