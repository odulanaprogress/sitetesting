import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Users,
  ShoppingBag,
  TrendingUp,
  Search,
  LogOut,
  Upload,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useAuth, ZeetechUser } from '../context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  type Order
} from '../../lib/firestore';
import { Product } from '../data/products';
import { CloudinaryUploadWidget } from '../components/CloudinaryUploadWidget';

type AdminTab = 'overview' | 'products' | 'add-product' | 'orders' | 'users';

export function AdminDashboardNew() {
  const { user, isAdmin, logout, getAllUsers } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<ZeetechUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    wholesalePrice: 0,
    category: 'phone-accessories',
    stock: 0,
    images: [] as string[],
    inStock: true,
    featured: false,
  });

  // Fetch data on mount
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login', { replace: true });
      return;
    }
    loadData();
  }, [isAdmin, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData, usersData] = await Promise.all([
        getAllProducts(),
        getAllOrders(),
        getAllUsers(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
    setLoading(false);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || newProduct.images.length === 0) {
      toast.error('Please fill all required fields and upload at least one image');
      return;
    }

    try {
      const productId = await addProduct(newProduct);
      if (productId) {
        toast.success('Product added successfully!');
        setNewProduct({
          name: '',
          description: '',
          price: 0,
          wholesalePrice: 0,
          category: 'phone-accessories',
          stock: 0,
          images: [],
          inStock: true,
          featured: false,
        });
        loadData();
        setActiveTab('products');
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const success = await updateProduct(editingProduct.id, editingProduct);
      if (success) {
        toast.success('Product updated successfully!');
        setEditingProduct(null);
        loadData();
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const success = await deleteProduct(id);
      if (success) {
        toast.success('Product deleted successfully!');
        loadData();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleImageUpload = (url: string, publicId: string, isEditing: boolean = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: [...editingProduct.images, url],
      });
    } else {
      setNewProduct({
        ...newProduct,
        images: [...newProduct.images, url],
      });
    }
    toast.success('Image uploaded successfully!');
  };

  const removeImage = (index: number, isEditing: boolean = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: editingProduct.images.filter((_, i) => i !== index),
      });
    } else {
      setNewProduct({
        ...newProduct,
        images: newProduct.images.filter((_, i) => i !== index),
      });
    }
  };

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Stats calculations
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-amber-300">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white text-[#b91c1c]'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-white text-[#b91c1c]'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('add-product')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'add-product'
                  ? 'bg-white text-[#b91c1c]'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Plus size={18} className="inline mr-1" />
              Add Product
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-white text-[#b91c1c]'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-white text-[#b91c1c]'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Users ({users.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                  <Package className="text-[#b91c1c]" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                <p className="text-xs text-gray-500 mt-1">{totalStock} items in stock</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                  <ShoppingBag className="text-green-600" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {orders.filter(o => o.paymentStatus === 'paid').length} paid
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
                  <DollarSign className="text-orange-600" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  ₦{totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">From paid orders</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 text-sm font-medium">Customers</h3>
                  <Users className="text-purple-600" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                <p className="text-xs text-gray-500 mt-1">Registered users</p>
              </div>
            </div>

            {/* Alerts */}
            {lowStockProducts > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-orange-900">Low Stock Alert</h4>
                  <p className="text-sm text-orange-700">
                    {lowStockProducts} product(s) have less than 10 items in stock.
                  </p>
                </div>
              </div>
            )}

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{order.userName}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} items - ₦{order.total.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No orders yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xl font-bold text-[#b91c1c]">
                          ₦{product.price.toLocaleString()}
                        </p>
                        {product.wholesalePrice && (
                          <p className="text-sm text-gray-500">
                            Wholesale: ₦{product.wholesalePrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Stock: {product.stock}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            product.stock > 10
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <Package size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No products found</p>
              </div>
            )}
          </div>
        )}

        {/* Add Product Tab - Continued in next message due to length */}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={e =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₦) *</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Wholesale Price (₦)</label>
                  <input
                    type="number"
                    value={editingProduct.wholesalePrice || 0}
                    onChange={e =>
                      setEditingProduct({
                        ...editingProduct,
                        wholesalePrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stock *</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="phone-accessories">Phone Accessories</option>
                    <option value="computer-accessories">Computer Accessories</option>
                    <option value="power-banks">Power Banks</option>
                    <option value="gadgets">Gadgets</option>
                    <option value="chargers-cables">Chargers & Cables</option>
                    <option value="audio">Audio</option>
                    <option value="storage">Storage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Images *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingProduct.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        onClick={() => removeImage(idx, true)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <CloudinaryUploadWidget
                  onUpload={(url, publicId) => handleImageUpload(url, publicId, true)}
                  buttonText="Add Image"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleUpdateProduct}
                  className="flex-1 bg-[#b91c1c] hover:bg-[#991b1b] text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Save size={18} className="inline mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
