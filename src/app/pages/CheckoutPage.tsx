import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../../lib/firestore';
import { cloudinaryConfig, uploadPreset } from '../../lib/cloudinary';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Package, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    deliveryOption: 'standard',
  });

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [orderReference, setOrderReference] = useState('');

  useEffect(() => {
    setOrderReference('ZWH-' + Math.floor(100000 + Math.random() * 900000));
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = formData.deliveryOption === 'express' ? 5000 : cartTotal >= 50000 ? 0 : 2500;
  const total = cartTotal + deliveryFee;

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
  }, [cart.length, navigate]);

  if (cart.length === 0) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state) {
      toast.error('Please fill all required delivery fields');
      return;
    }
    if (!proofFile) {
      toast.error('Please upload your proof of payment');
      return;
    }

    setIsProcessing(true);

    try {
      const submitData = new FormData();
      submitData.append('Order Reference', orderReference);
      submitData.append('Full Name', formData.fullName);
      submitData.append('Email', formData.email);
      submitData.append('Phone', formData.phone);
      submitData.append('Delivery Address', formData.address);
      submitData.append('City', formData.city);
      submitData.append('State', formData.state);
      submitData.append('Delivery Option', formData.deliveryOption);
      submitData.append('Total Amount', `₦${total.toLocaleString()}`);
      
      const cartItems = cart.map(item => `${item.quantity}x ${item.name} (₦${(item.price * item.quantity).toLocaleString()})`).join('\n');
      submitData.append('Order Items', cartItems);

      submitData.append('Proof of Payment', proofFile);
      submitData.append('_subject', `New Order ${orderReference} from ${formData.fullName}`);

      const response = await fetch('https://formsubmit.co/ajax/zeetechdistributionadminsupport01@mail.com', {
        method: 'POST',
        body: submitData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success === 'true' || response.ok) {
        // Save to Firestore
        try {
          await createOrder({
            userId: user?.id || 'guest',
            userEmail: formData.email,
            userName: formData.fullName,
            userPhone: formData.phone,
            shippingAddress: {
              street: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: '000000'
            },
            items: cart.map(item => ({
              productId: item.id,
              productName: item.name,
              quantity: item.quantity,
              price: item.price,
              imageUrl: item.image
            })),
            subtotal: cartTotal,
            shipping: deliveryFee,
            total: total,
            paymentStatus: 'pending',
            paymentReference: orderReference,
            orderStatus: 'pending'
          });
        } catch (err) {
          console.error("Failed to save order to firestore", err);
        }

        clearCart();
        setIsProcessing(false);
        navigate(`/order-success?orderId=${orderReference}`);
        toast.success('Order placed successfully!');
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      setIsProcessing(false);
      toast.error('Failed to submit order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Package size={18} className="sm:w-5 sm:h-5" />
                Delivery Information
              </h2>

              <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5 sm:mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                    placeholder="Enter your full name"
                    required
                    style={{ minHeight: '44px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 sm:mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                    placeholder="your@email.com"
                    required
                    style={{ minHeight: '44px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 sm:mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                    placeholder="080XXXXXXXX"
                    required
                    style={{ minHeight: '44px' }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5 sm:mb-2">Delivery Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                    placeholder="Enter your full delivery address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 sm:mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                    placeholder="City"
                    required
                    style={{ minHeight: '44px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 sm:mb-2">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                    required
                    style={{ minHeight: '44px' }}
                  >
                    <option value="">Select State</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja (FCT)</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Kano">Kano</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Delivery Options</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{ minHeight: '64px' }}>
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="standard"
                    checked={formData.deliveryOption === 'standard'}
                    onChange={handleInputChange}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm sm:text-base">Standard Delivery</div>
                    <div className="text-xs sm:text-sm text-gray-600">3-5 business days</div>
                  </div>
                  <div className="font-semibold text-sm sm:text-base">
                    {cartTotal >= 50000 ? 'FREE' : '₦2,500'}
                  </div>
                </label>

                <label className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{ minHeight: '64px' }}>
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="express"
                    checked={formData.deliveryOption === 'express'}
                    onChange={handleInputChange}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm sm:text-base">Express Delivery</div>
                    <div className="text-xs sm:text-sm text-gray-600">1-2 business days</div>
                  </div>
                  <div className="font-semibold text-sm sm:text-base">₦5,000</div>
                </label>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:sticky md:top-24">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Order Summary</h3>

              <div className="max-h-64 overflow-y-auto mb-3 sm:mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-2.5 sm:gap-3 mb-3 pb-3 border-b last:border-0 border-gray-100">
                    <img src={item.image} alt={item.name} className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs sm:text-sm truncate">{item.name}</div>
                      <div className="text-[11px] sm:text-sm text-gray-500 mt-0.5">Qty: {item.quantity}</div>
                      <div className="text-xs sm:text-sm font-bold text-red-600 mt-0.5">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-3 sm:mb-4 pt-3 sm:pt-4 border-t">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₦${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-red-600">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-100">
                <h4 className="font-bold text-red-800 mb-2">Payment Instructions</h4>
                <p className="text-sm text-red-700 mb-2">Please transfer exactly <strong>₦{total.toLocaleString()}</strong> to the account below:</p>
                <div className="bg-white p-3 rounded border border-red-200 mb-3 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Bank:</span>
                    <span className="font-semibold text-gray-800">FCMB</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Account Name:</span>
                    <span className="font-semibold text-gray-800">Zee tech distribution</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Account Number:</span>
                    <span className="font-semibold text-gray-800 tracking-wider">1006268527</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Ref:</span>
                    <span className="font-bold text-red-600">{orderReference}</span>
                  </div>
                </div>
                <div className="text-xs text-red-600 font-medium">Use the Order Ref ({orderReference}) as your transfer description.</div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Upload Proof of Payment *</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, application/pdf, video/mp4"
                  onChange={e => setProofFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 border rounded-lg cursor-pointer"
                  required
                />
                <p className="text-xs text-gray-400 mt-1.5">Accepted: PNG, JPG, PDF, MP4 (Max 5MB)</p>
              </div>

              <button
                onClick={handleFormSubmit}
                disabled={isProcessing}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                style={{ minHeight: '48px' }}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                    Complete Order
                  </>
                )}
              </button>

              <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-600">
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-600" />
                  Proof of payment is securely uploaded to our system
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
