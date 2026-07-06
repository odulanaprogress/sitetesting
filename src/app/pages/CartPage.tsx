import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  const deliveryFee = cartTotal >= 50000 ? 0 : 2500;
  const total = cartTotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Link
            to="/products"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-6 sm:py-12 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-4xl font-bold">Shopping Cart</h1>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b">
                <h2 className="font-semibold text-base sm:text-lg">Cart Items ({cart.length})</h2>
              </div>

              <div className="divide-y">
                {cart.map(item => (
                  <div key={item.id} className="p-3 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 border-b last:border-0 border-gray-100">
                    <div className="flex gap-3 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-md sm:rounded-lg shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base leading-tight truncate mb-1">{item.name}</h3>
                        {item.variant && (
                          <p className="text-xs text-gray-500 mb-1">{item.variant}</p>
                        )}
                        <div className="font-bold text-red-600 text-sm sm:text-base">
                          ₦{item.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end sm:justify-between pt-2 sm:pt-0">
                      <div className="flex items-center gap-1 sm:gap-2 border border-gray-200 rounded-md sm:rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 sm:p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={14} className="sm:w-4 sm:h-4 text-gray-600" />
                        </button>
                        <span className="w-6 sm:w-12 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 sm:p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={14} className="sm:w-4 sm:h-4 text-gray-600" />
                        </button>
                      </div>

                      <div className="font-bold text-sm sm:text-base hidden sm:block">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 size={18} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-24">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Order Summary</h3>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₦${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <div className="text-xs sm:text-sm text-red-600 mt-1">
                    Add ₦{(50000 - cartTotal).toLocaleString()} more for free delivery
                  </div>
                )}
              </div>

              <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-red-600">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-red-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-center text-sm sm:text-base"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="block w-full text-center text-red-600 hover:text-red-700 mt-3 text-sm sm:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
