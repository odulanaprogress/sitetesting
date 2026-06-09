import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { ProductCard } from '../components/ProductCard';

export function WishlistPage() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const load = () => {
    try { setWishlistIds(JSON.parse(localStorage.getItem('wishlist') || '[]')); } catch { setWishlistIds([]); }
  };

  useEffect(() => { load(); }, []);

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  const removeFromWishlist = (id: string) => {
    const next = wishlistIds.filter(wid => wid !== id);
    localStorage.setItem('wishlist', JSON.stringify(next));
    setWishlistIds(next);
    toast.success('Removed from wishlist');
  };

  const addAllToCart = () => {
    wishlistProducts.forEach(p => addToCart({ id: p.id, name: p.name, price: p.price, image: p.image }));
    toast.success(`${wishlistProducts.length} item(s) added to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] text-white py-10 sm:py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMTAgMjAgMTAgMjAgMjBzLTEwIDIwLTIwIDIwLTIwLTEwLTIwLTIwIDEwLTIwIDIwLTIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Heart size={28} className="fill-white text-white" />
            <h1 className="text-2xl sm:text-3xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-white/80 text-sm">
            {wishlistProducts.length > 0 ? `${wishlistProducts.length} saved item(s)` : 'Your wishlist is empty'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Nothing saved yet</h2>
            <p className="text-gray-500 text-sm mb-6">Browse our products and tap the heart icon to save items here.</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white px-6 py-3 rounded-lg font-bold transition-all text-sm shadow-md">
              Browse Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-gray-600 font-medium">{wishlistProducts.length} item(s) in your wishlist</span>
              <button
                onClick={addAllToCart}
                className="flex items-center gap-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md"
              >
                <ShoppingCart size={16} /> Add All to Cart
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {wishlistProducts.map(product => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 left-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={13} className="text-[#b91c1c]" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/products" className="text-[#b91c1c] hover:text-[#991b1b] font-bold text-sm inline-flex items-center gap-1">
                Continue Shopping <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
