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
                {product.shortDescription && (
                  <p className="text-sm md:text-base text-gray-500 mb-3 font-medium">{product.shortDescription}</p>
                )}
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
                <div className="text-2xl sm:text-3xl font-bold text-red-600">
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

            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <div className="border-t border-b py-3 sm:py-4 mb-4 sm:mb-6 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-gray-600">Availability:</span>
                <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-gray-600">Category:</span>
                <Link
                  to={`/products?category=${product.category}`}
                  className="text-red-600 hover:text-red-700 capitalize"
                >
                  {product.category}
                </Link>
              </div>
            </div>

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

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-semibold mb-1.5 sm:mb-2">Quantity:</label>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 sm:p-2 border rounded-lg hover:bg-gray-100"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <Minus size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 sm:w-20 text-center border rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                  style={{ minHeight: '44px' }}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 sm:p-2 border rounded-lg hover:bg-gray-100"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-red-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
              style={{ minHeight: '48px' }}
            >
              <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
              Add to Cart
            </button>
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
