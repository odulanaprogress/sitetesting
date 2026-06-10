import React, { FormEvent, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, LogOut, ChevronDown, LayoutDashboard, User, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { categories, subcategories } from '../data/mockData';
import logoImage from '../../imports/zee_tech_logo_transparent-2.png';

export function Header() {
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
    setMobileDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleMouseEnter = (categoryId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(categoryId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/about', label: 'About Us' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Promo Bar */}
        <div className="bg-[#991b1b] text-white text-center py-1.5 px-4">
          <p className="text-xs font-medium flex items-center justify-center gap-2 flex-wrap">
            <span>Are you a Reseller?{' '}
              <a href="/wholesale" className="underline font-bold hover:text-amber-300 transition-colors">
                Get Wholesale Price on All Products →
              </a>
            </span>
            <span className="hidden md:inline">•</span>
            <span className="md:hidden w-[6px] h-[6px] rounded-full bg-white/70 flex-shrink-0" />
            <span>Fast Nationwide Delivery</span>
            <span className="hidden md:inline">•</span>
            <span className="md:hidden w-[6px] h-[6px] rounded-full bg-white/70 flex-shrink-0" />
            <span>100% Genuine</span>
          </p>
        </div>

        {/* Main Header */}
        <div className="bg-gradient-to-r from-[#b91c1c] to-[#991b1b] shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-16 sm:h-20 gap-3 sm:gap-4">

              {/* Logo */}
              <Link
                to="/"
                className="flex items-center flex-shrink-0"
              >
                <img
                  src={logoImage}
                  alt="Zeetech Distribution"
                  className="w-40 h-40 sm:w-[190px] sm:h-[190px] drop-shadow-md flex-shrink-0"
                  style={{ objectFit: 'contain' }}
                />
              </Link>

              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
                <div className="relative w-full">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white text-gray-900 placeholder-gray-500 pl-11 pr-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#b91c1c] transition-all shadow-md"
                  />
                </div>
              </form>

              {/* Right Actions */}
              <div className="ml-auto flex items-center gap-2">

                {/* Mobile Search Toggle */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="md:hidden text-white hover:text-amber-300 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                {/* Wishlist */}
                <Link to="/wishlist" className="text-white hover:text-amber-300 p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Wishlist">
                  <Heart size={20} />
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative text-white hover:text-amber-300 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label={`Cart (${cartCount})`}
                >
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-[#b91c1c] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* User menu - desktop */}
                {user ? (
                  <div className="relative hidden md:block" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors text-gray-700"
                    >
                      <div className="w-7 h-7 bg-[#b91c1c] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-gray-900">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                        <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-red-50/50 border-b">
                          <div className="font-semibold text-gray-800 text-sm truncate">{user.name}</div>
                          <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LayoutDashboard size={15} />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="hidden md:flex items-center gap-2 bg-white hover:bg-gray-100 text-[#b91c1c] px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md"
                  >
                    <User size={16} />
                    Login
                  </Link>
                )}

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-white hover:text-amber-300 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Search Bar - slides down */}
            {searchOpen && (
              <div className="md:hidden pb-3 px-4">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-white text-gray-900 placeholder-gray-500 pl-9 pr-10 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white shadow-md"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Category Bar */}
        <div className="md:hidden bg-[#8b1a1a] relative">
          {mobileDropdown && (
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setMobileDropdown(null)}
            />
          )}
          <div className="overflow-x-auto scrollbar-none relative z-50">
            <div className="flex items-center gap-0 px-2">
              {categories.map(cat => {
                const hasSubs = !!subcategories[cat.id as keyof typeof subcategories];
                return (
                  <div key={cat.id} className="relative flex-shrink-0">
                    {hasSubs ? (
                      <button
                        onClick={() => setMobileDropdown(mobileDropdown === cat.id ? null : cat.id)}
                        className="px-3 py-2.5 text-white/90 hover:text-white text-xs font-medium whitespace-nowrap hover:bg-white/10 transition-colors flex items-center gap-1"
                      >
                        {cat.name}
                        <ChevronDown size={12} className={`opacity-70 transition-transform ${mobileDropdown === cat.id ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <Link
                        to={`/products?category=${cat.id}`}
                        onClick={() => setMobileDropdown(null)}
                        className="px-3 py-2.5 text-white/90 hover:text-white text-xs font-medium whitespace-nowrap hover:bg-white/10 transition-colors flex items-center gap-1"
                      >
                        {cat.name}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Dropdown panel — width fitted to text content only */}
          {mobileDropdown && subcategories[mobileDropdown as keyof typeof subcategories] && (
            <div className="absolute left-2 top-full z-50 pointer-events-none pb-2">
              <div className="inline-flex flex-col bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden pointer-events-auto">
                {subcategories[mobileDropdown as keyof typeof subcategories].map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/products?category=${mobileDropdown}&subcategory=${sub.id}`}
                    onClick={() => setMobileDropdown(null)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-red-50 hover:text-[#b91c1c] transition-colors border-b border-gray-100 last:border-b-0 whitespace-nowrap"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#b91c1c] flex-shrink-0" />
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation Bar */}
        <nav className="hidden md:block bg-[#8b1a1a] shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-12">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(category.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={`/products?category=${category.id}`}
                    className="flex items-center gap-1 px-4 py-3 text-white text-sm font-medium hover:bg-[#7a1717] transition-colors whitespace-nowrap"
                  >
                    {category.name}
                    {subcategories[category.id as keyof typeof subcategories] && (
                      <ChevronDown size={14} className="opacity-70" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {subcategories[category.id as keyof typeof subcategories] && openDropdown === category.id && (
                    <div className="absolute left-0 top-full pt-1 z-50">
                      <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px]">
                        {subcategories[category.id as keyof typeof subcategories].map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/products?category=${category.id}&subcategory=${sub.id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#b91c1c] transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/about"
                className="flex items-center gap-1 px-4 py-3 text-white text-sm font-medium hover:bg-[#7a1717] transition-colors whitespace-nowrap"
              >
                About Us
              </Link>
              <Link
                to="/wholesale"
                className="ml-auto px-4 py-2 text-sm font-bold bg-white hover:bg-gray-100 text-[#b91c1c] rounded-lg transition-all shadow-md"
              >
                💼 Wholesale Deals
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Full-Screen Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white flex flex-col shadow-2xl animate-slide-in">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-[#b91c1c] to-[#991b1b] border-b border-white/20">
              <div className="flex items-center gap-2">
                <img src={logoImage} alt="Zeetech" className="flex-shrink-0 drop-shadow-md" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                <span className="text-white font-extrabold text-lg tracking-tight">Zeetech Distribution</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="w-10 h-10 bg-[#b91c1c] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-gray-900 font-semibold text-sm truncate">{user.name}</div>
                  <div className="text-gray-600 text-xs truncate">{user.email}</div>
                </div>
              </div>
            ) : null}

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-2 py-3">
              {[
                { to: user ? '/account' : '/login', label: 'My Account' },
                { to: '/products', label: 'Shop' },
                { to: '/wishlist', label: 'Wishlist' },
                { to: '/wholesale', label: 'Wholesale' },
                { to: '/about', label: 'About Us' },
              ].map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                  className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:text-[#b91c1c] hover:bg-red-50 rounded-xl transition-colors mb-1 font-medium"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Bottom Auth Actions */}
            <div className="px-3 py-4 border-t border-gray-200 space-y-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-xl text-sm transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg"
                >
                  <User size={16} />
                  Login / Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}