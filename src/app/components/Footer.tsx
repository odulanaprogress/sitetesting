import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import logoImage from '../../imports/zee_tech_logo_transparent-2.png';

export function Footer() {
  return (
    <footer className="bg-white text-gray-800 relative overflow-hidden border-t border-gray-200">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2YzAgMTAgMjAgMTAgMjAgMjBzLTEwIDIwLTIwIDIwLTIwLTEwLTIwLTIwIDEwLTIwIDIwLTIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-col items-start gap-2 mb-4">
              <img src={logoImage} alt="Zeetech Distribution" className="h-14 w-auto object-contain drop-shadow-md" />
              <div>
                <div className="text-gray-900 font-extrabold text-base leading-tight tracking-tight">Zeetech Distribution</div>
                <div className="text-[#b91c1c] text-xs font-semibold">Your Tech Partner</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-gray-600 mb-4">Your trusted partner for phone accessories, computer accessories, power banks and electronic gadgets across Nigeria.</p>
            <div className="flex gap-2">
              <a href="#" className="hover:text-[#b91c1c] transition-colors p-1.5 bg-gray-100 rounded-lg hover:bg-red-50"><Facebook size={16} /></a>
              <a href="#" className="hover:text-[#b91c1c] transition-colors p-1.5 bg-gray-100 rounded-lg hover:bg-red-50"><Instagram size={16} /></a>
              <a href="#" className="hover:text-[#b91c1c] transition-colors p-1.5 bg-gray-100 rounded-lg hover:bg-red-50"><Twitter size={16} /></a>
              <a href="https://wa.me/2348101144944" target="_blank" rel="noreferrer" className="hover:text-green-600 transition-colors p-1.5 bg-gray-100 rounded-lg hover:bg-green-50"><MessageCircle size={16} /></a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-sm">Company</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-[#b91c1c] transition-colors text-gray-600">Home</Link></li>
              <li><Link to="/products" className="hover:text-[#b91c1c] transition-colors text-gray-600">Shop</Link></li>
              <li><Link to="/login" className="hover:text-[#b91c1c] transition-colors text-gray-600">My Account</Link></li>
              <li><Link to="/wholesale" className="hover:text-[#b91c1c] transition-colors text-gray-600">Wholesale</Link></li>
              <li><Link to="/about" className="hover:text-[#b91c1c] transition-colors text-gray-600">About us</Link></li>
              <li><Link to="/privacy" className="hover:text-[#b91c1c] transition-colors text-gray-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#b91c1c] transition-colors text-gray-600">Terms & Conditions</Link></li>
              <li><Link to="/refund" className="hover:text-[#b91c1c] transition-colors text-gray-600">Refund & Returns Policy</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-sm">Customer Service</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/wishlist" className="hover:text-[#b91c1c] transition-colors text-gray-600">My Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-[#b91c1c] transition-colors text-gray-600">Shopping Cart</Link></li>
              <li><a href="https://wa.me/2348101144944" target="_blank" rel="noreferrer" className="hover:text-[#b91c1c] transition-colors text-gray-600">WhatsApp Support</a></li>
              <li><a href="mailto:zeetechdistributions@gmail.com" className="hover:text-[#b91c1c] transition-colors text-gray-600">Email Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-sm">Contact Us</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-[#b91c1c] flex-shrink-0" />
                <a href="tel:08101144944" className="hover:text-[#b91c1c] transition-colors text-gray-600">08101144944</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={13} className="text-green-600 flex-shrink-0" />
                <a href="https://wa.me/2348101144944" target="_blank" rel="noreferrer" className="hover:text-green-600 transition-colors text-gray-600">WhatsApp: 08101144944</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-[#b91c1c] flex-shrink-0" />
                <a href="mailto:zeetechdistributions@gmail.com" className="hover:text-[#b91c1c] transition-colors text-gray-600 break-all">zeetechdistributions@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={13} className="text-[#b91c1c] flex-shrink-0 mt-0.5" />
                <div className="text-gray-600 leading-relaxed">
                  <div className="font-semibold text-gray-800 mb-0.5">Head Office:</div>
                  Shop 58 &amp; 59 Global Update Plaza (GUP), Alaba International Market Ojo Lagos
                  <div className="font-semibold text-gray-800 mt-2 mb-0.5">Branch Office:</div>
                  Shop 6 RBC Plaza, Opposite Building Material Market Abule-ado Lagos
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-xs">
          <p className="text-gray-500">&copy; 2026 Zeetech Distribution. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}