import { Link } from 'react-router-dom';
import { ShoppingCart, Star, ImageOff, Heart } from 'lucide-react';
import { Product } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import React, { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(() => {
    try {
      const wl: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
      return wl.includes(product.id);
    } catch { return false; }
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added!`);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const wl: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const next = wishlisted ? wl.filter(id => id !== product.id) : [...wl, product.id];
      localStorage.setItem('wishlist', JSON.stringify(next));
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch { /* ignore */ }
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#b91c1c]/30 flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          {imgError || !product.image ? (
            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center gap-2">
              <ImageOff size={28} className="text-gray-300" />
              <span className="text-xs text-gray-400 text-center px-3 line-clamp-2">{product.name}</span>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-400"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.hot && (
              <span className="bg-[#b91c1c] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                Trending
              </span>
            )}
            {product.wholesaleAvailable && (
              <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                Wholesale
              </span>
            )}
          </div>
          {/* Wishlist */}
          <button onClick={toggleWishlist}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
            aria-label="Wishlist">
            <Heart size={13} className={wishlisted ? 'fill-[#b91c1c] text-[#b91c1c]' : 'text-gray-400'} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1 gap-1.5">
          <h3 className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-[#b91c1c] transition-colors text-gray-900">
            {product.name}
          </h3>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
            ))}
            <span className="text-[10px] text-gray-400">({product.reviews})</span>
          </div>

          <div className="flex items-baseline gap-1.5 mt-auto">
            <span className="font-bold text-sm sm:text-base text-[#b91c1c]">₦{product.price.toLocaleString()}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 text-xs py-2 mt-1"
          >
            <ShoppingCart size={13} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}