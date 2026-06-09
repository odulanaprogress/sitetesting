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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="font-semibold text-lg">Cart Items ({cart.length})</h2>
              </div>

              <div className="divide-y">
                {cart.map(item => (
                  <div key={item.id} className="p-6 flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-gray-600 mb-2">{item.variant}</p>
                      )}
                      <div className="font-bold text-red-600">
                        ₦{item.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>

                      <div className="flex items-center gap-2 border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="font-bold">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
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
                  <div className="text-sm text-red-600">
                    Add ₦{(50000 - cartTotal).toLocaleString()} more for free delivery
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-red-600">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-center"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="block w-full text-center text-red-600 hover:text-red-700 mt-3"
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
