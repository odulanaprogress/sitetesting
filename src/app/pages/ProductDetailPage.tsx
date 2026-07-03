import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Minus, Plus, ChevronLeft, Heart, ImageOff } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { toast } from 'sonner';
import { useProducts } from '../hooks/useProducts';

export function ProductDetailPage() {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/products" className="text-red-600 hover:text-red-700">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    const variantString = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ');
    addToCart({
      id: product.id + (variantString ? `-${variantString}` : ''),
      name: product.name,
      price: product.price,
      image: product.image,
      variant: variantString || undefined,
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Link to="/products" className="flex items-center gap-1.5 sm:gap-2 text-red-600 hover:text-red-700 mb-4 sm:mb-6 text-sm sm:text-base" style={{ minHeight: '44px' }}>
          <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
          <div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-3 sm:mb-4">
              {imgErrors[selectedImage] || !images[selectedImage] ? (
                <div className="w-full aspect-square bg-gradient-to-br from-red-50 to-gray-100 flex flex-col items-center justify-center gap-3">
                  <ImageOff size={48} className="text-gray-300" />
                  <p className="text-sm text-gray-400 text-center px-4">{product.name}</p>
                </div>
              ) : (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                  onError={() => setImgErrors(prev => ({ ...prev, [selectedImage]: true }))}
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-blue-600' : 'border-transparent'
                    }`}
                    style={{ minHeight: '44px' }}
                  >
                    {imgErrors[idx] || !img ? (
                      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                        <ImageOff size={16} className="text-gray-300" />
                      </div>
                    ) : (
                      <img
                        src={img}
                        alt=""
                        className="w-full aspect-square object-cover"
                        onError={() => setImgErrors(prev => ({ ...prev, [idx]: true }))}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 pr-2">{product.name}</h1>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`sm:w-[18px] sm:h-[18px] ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">({product.reviews} reviews)</span>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0" style={{ minWidth: '44px', minHeight: '44px' }}>
                <Heart size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="mb-4 sm:mb-6">
              <div className="flex items-end gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                  ₦{product.price.toLocaleString()}
                </div>
                {product.wholesalePrice && (
                  <div className="text-base sm:text-xl text-gray-500 line-through mb-0.5 sm:mb-1">
                    ₦{product.wholesalePrice.toLocaleString()}
                  </div>
                )}
              </div>
              {product.wholesalePrice && (
                <div className="text-xs sm:text-sm text-green-600 font-semibold">
                  Save ₦{(product.wholesalePrice - product.price).toLocaleString()} with wholesale pricing
                </div>
              )}
            </div>

            {product.shortDescription && (
              <div className="mb-6 sm:mb-8 text-sm md:text-base text-gray-600">
                <div dangerouslySetInnerHTML={{ __html: product.shortDescription }} className="prose prose-sm max-w-none prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 text-gray-500" />
              </div>
            )}

            {product.variants && product.variants.map(variant => (
              <div key={variant.name} className="mb-4 sm:mb-6">
                <label className="block text-sm font-semibold mb-1.5 sm:mb-2">{variant.name}:</label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map(option => (
                    <button
                      key={option}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: option }))}
                      className={`px-3 sm:px-4 py-2 border rounded-lg transition-all text-sm sm:text-base ${
                        selectedVariants[variant.name] === option
                          ? 'border-blue-600 bg-red-50 text-red-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ minHeight: '40px' }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <hr className="border-gray-100 my-6" />

            <div className="flex gap-4 mb-6 sm:mb-8">
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 border border-gray-300 rounded-l-sm hover:bg-gray-50 flex-shrink-0 text-gray-500"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 sm:w-16 text-center border-y border-gray-300 py-2.5 focus:outline-none focus:ring-0 text-base"
                  style={{ minHeight: '44px' }}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 border border-gray-300 rounded-r-sm hover:bg-gray-50 flex-shrink-0 text-gray-500"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-[#ef4444] text-white rounded-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                style={{ minHeight: '44px' }}
              >
                Add to cart
              </button>
            </div>

            <hr className="border-gray-100 my-6" />

            <div className="space-y-2 mb-8 text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wide">
              <div>
                CATEGORY: <Link to={`/products?category=${product.category}`} className="text-gray-500 hover:text-red-600">{product.category.replace('-', ' ')}</Link>
              </div>
              <div>
                BRAND: <span className="text-gray-500">{(product as any).brand || product.name.split(' ')[0]}</span>
              </div>
            </div>

            <div className="flex border-t border-b border-gray-200">
              <button 
                className={`flex-1 py-4 text-center font-bold text-sm tracking-wide transition-colors ${activeTab === 'description' ? 'text-red-600 border-b-2 border-red-600 -mb-[1px]' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('description')}
              >
                DESCRIPTION
              </button>
              <button 
                className={`flex-1 py-4 text-center font-bold text-sm tracking-wide transition-colors ${activeTab === 'reviews' ? 'text-red-600 border-b-2 border-red-600 -mb-[1px]' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('reviews')}
              >
                REVIEWS ({product.reviews || 0})
              </button>
            </div>

            <div className="pt-6 sm:pt-8">
              {activeTab === 'description' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 font-mono tracking-tight text-black">Product details</h2>
                  <div className="text-gray-500 leading-relaxed text-sm sm:text-base">
                    <div dangerouslySetInnerHTML={{ __html: product.description }} className="prose prose-sm max-w-none prose-p:mb-4" />
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div>
                  <p className="text-gray-500 text-center py-8">No reviews yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
