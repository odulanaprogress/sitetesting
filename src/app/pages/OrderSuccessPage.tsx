import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, Home } from 'lucide-react';

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your payment has been processed successfully.
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-sm text-gray-600 mb-2">Order ID</div>
              <div className="font-mono font-bold text-lg">{orderId}</div>
            </div>
          )}

          <div className="border-t border-b py-6 mb-6">
            <div className="text-sm text-gray-600 mb-4">
              A confirmation email with your invoice has been sent to your email address.
            </div>

            <button className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              <Download size={20} />
              Download Invoice
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Your order is being processed and will be delivered within the selected timeframe.
            </p>

            <div className="flex gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Home size={20} />
                Back to Home
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
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
