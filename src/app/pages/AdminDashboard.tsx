import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Package, Plus, Edit2, Trash2, Save, X, Users, TrendingUp, TrendingDown, Search, LogOut, ImageOff, Upload, Loader2, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { products as initialProducts, Product, categories as allCategories, subcategories as allSubcategories } from '../data/mockData';
import { useAuth, ZeetechUser } from '../context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc, setDoc, deleteDoc, onSnapshot, query, orderBy, doc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order, updateOrderStatus } from '../../lib/firestore';

const CLOUD_NAME = 'dlxnaefxk';
const UPLOAD_PRESET = 'zeetech_products';

// Read a file into a compressed base64 JPEG — always works, no network needed
function readAsBase64(file: File): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onerror = () => resolve('');
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onerror = () => resolve(dataUrl); // raw fallback
      img.onload = () => {
        try {
          const MAX = 900;
          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

// Try Cloudinary upload — throws on failure
async function tryCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  fd.append('folder', 'zeetech');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST', body: fd,
  });
  const data = await res.json();
  if (!res.ok || !data.secure_url) throw new Error(data?.error?.message || 'Upload failed');
  return data.secure_url as string;
}

// ─── Image slot types ─────────────────────────────────────────────────────────

interface ImageSlot {
  id: string;
  preview: string;  // local blob URL (for UI display only)
  url: string;      // final URL stored with product
  uploading: boolean;
  isCloud: boolean;
}

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

type AdminTab = 'products' | 'add' | 'edit' | 'users' | 'slides' | 'testimonials' | 'categories' | 'orders';

export function AdminDashboard() {
  const { user, isAdmin, logout, getAllUsers } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<ZeetechUser[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAdmin) { navigate('/login', { replace: true }); return; }
    getAllUsers().then(setUsers).catch(() => setUsers([]));

    if (!db) {
      // fallback to localStorage
      const saved = localStorage.getItem('admin_products');
      if (saved) { try { setProducts(JSON.parse(saved)); } catch { setProducts(initialProducts); } }
      else setProducts(initialProducts);
      return;
    }

    // Real-time Firestore listener
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q,
      snapshot => {
        if (!snapshot.empty) {
          setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
        } else {
          setProducts(initialProducts);
        }
      },
      err => {
        console.warn('Firestore error:', err.message);
        const saved = localStorage.getItem('admin_products');
        if (saved) { try { setProducts(JSON.parse(saved)); } catch { setProducts(initialProducts); } }
      }
    );
    return () => unsub();
  }, [isAdmin, navigate, getAllUsers]);

  useEffect(() => {
    if (activeTab === 'users') {
      if (db) {
        const unsub = onSnapshot(collection(db, 'users'), snap => {
          setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as ZeetechUser)));
        });
        return () => unsub();
      } else {
        getAllUsers().then(setUsers).catch(() => setUsers([]));
      }
    }
    
    if (activeTab === 'orders') {
      if (db) {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, snap => {
          setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
        });
        return () => unsub();
      }
    }
  }, [activeTab, getAllUsers]);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    if (db) {
      const ok = await deleteDoc(doc(db, 'products', id)).then(() => true).catch(() => false);
      if (ok) toast.success('Product deleted');
      else toast.error('Delete failed');
    } else {
      const updated = products.filter(p => p.id !== id);
      localStorage.setItem('admin_products', JSON.stringify(updated));
      setProducts(updated);
      toast.success('Product deleted');
    }
  };

  const handlePriceAdjust = async (id: string, field: 'price' | 'wholesalePrice', delta: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const cur = field === 'price' ? product.price : (product.wholesalePrice ?? product.price);
    const newVal = Math.max(0, cur + delta);
    const update = field === 'price' ? { price: newVal } : { wholesalePrice: newVal };
    if (db) {
      try {
        const docRef = doc(db, 'products', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          await updateDoc(docRef, { ...update, updatedAt: Timestamp.now() });
        } else {
          await setDoc(docRef, { ...update, updatedAt: Timestamp.now() }, { merge: true });
        }
        toast.success('Price updated');
      } catch {
        toast.error('Update failed');
      }
    } else {
      const updated = products.map(p => p.id === id ? { ...p, ...update } : p);
      localStorage.setItem('admin_products', JSON.stringify(updated));
      setProducts(updated);
      toast.success('Price updated');
    }
  };

  const handleSeedToFirestore = async () => {
    if (!db) { toast.error('Firestore not available'); return; }
    if (!confirm('Seed initial products to Firestore? This will add the default catalog.')) return;
    try {
      const col = collection(db, 'products');
      for (const p of initialProducts) {
        const { id: _id, ...rest } = p as any;
        await addDoc(col, { ...rest, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
      }
      toast.success('Products seeded to Firestore!');
    } catch (e: any) {
      toast.error('Seed failed: ' + e.message);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#b91c1c] to-[#991b1b] text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-amber-300 text-sm">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut size={16} /><span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Products', value: products.length, color: 'text-red-600' },
            { label: 'Total Stock', value: products.reduce((s, p) => s + p.stock, 0), color: 'text-green-600' },
            { label: 'Customers', value: users.length, color: 'text-orange-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b overflow-x-auto">
          {([
            { id: 'products', label: 'Products', icon: Package },
            { id: 'add', label: 'Add Product', icon: Plus },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'slides', label: 'Slides', icon: ImageIcon },
            { id: 'testimonials', label: 'Testimonials', icon: Users },
            { id: 'categories', label: 'Category Images', icon: ImageIcon },
            { id: 'users', label: 'Customers', icon: Users },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); if (id === 'add') setEditingProduct(null); }}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 font-semibold border-b-2 transition-colors whitespace-nowrap text-sm ${
                activeTab === id ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(' ')[0]}</span>
              {id === 'products' && <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5">{products.length}</span>}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold mb-4">Orders ({orders.length})</h3>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border rounded-lg p-4 bg-gray-50 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">{order.userName}</div>
                    <div className="text-sm text-gray-600 mb-1">{order.userEmail} | {order.userPhone}</div>
                    <div className="text-sm text-gray-500 mb-2">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}</div>
                    <div className="text-xs text-gray-500 mb-3">Ref: {order.paymentReference} | Date: {order.createdAt?.toDate?.()?.toLocaleDateString?.() || 'N/A'}</div>
                    
                    {order.items && order.items.length > 0 && (
                      <div className="bg-white p-3 rounded border border-gray-200 mt-2">
                        <div className="font-semibold text-sm mb-2 text-gray-700">Order Items:</div>
                        <ul className="text-sm text-gray-600 space-y-1.5">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between border-b border-gray-50 pb-1.5 last:border-0 last:pb-0">
                              <span className="flex-1">{item.quantity}x {item.productName}</span>
                              <span className="font-semibold text-gray-800 ml-2">₦{(item.price * item.quantity).toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <div className="font-bold text-red-600">₦{order.total.toLocaleString()}</div>
                    <div className="text-sm">Status: <span className="font-semibold uppercase">{order.orderStatus}</span></div>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => {
                        if (order.id) {
                          updateOrderStatus(order.id, e.target.value as any);
                          toast.success('Status updated');
                        }
                      }}
                      className="border rounded px-2 py-1 text-sm bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-gray-500">No orders found.</p>}
            </div>
          </div>
        )}

        {/* Products table */}
        {activeTab === 'products' && (
          <div>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <button
                onClick={() => { setEditingProduct(null); setActiveTab('add'); }}
                className="bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
              >
                <Plus size={18} /> Add Product
              </button>
              {db && products.length === 0 && (
                <button
                  onClick={handleSeedToFirestore}
                  className="flex items-center gap-2 px-4 py-2.5 border border-amber-400 text-amber-600 rounded-xl hover:bg-amber-50 text-sm font-semibold transition-colors"
                  title="Seed default products to Firestore"
                >
                  <RefreshCw size={16} /> Seed Catalog
                </button>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {['Product', 'Category', 'Retail Price', 'Wholesale', 'Stock', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <AdminThumb src={product.image} alt={product.name} />
                            <div>
                              <div className="font-semibold text-sm line-clamp-1">{product.name}</div>
                              <div className="flex gap-1 mt-1">
                                {product.featured && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] rounded font-medium">Featured</span>}
                                {product.hot && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] rounded font-medium">Hot</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg capitalize">{product.category.replace('-', ' ')}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-sm">₦{product.price.toLocaleString()}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <button onClick={() => handlePriceAdjust(product.id, 'price', -500)} className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"><TrendingDown size={12} /></button>
                            <button onClick={() => handlePriceAdjust(product.id, 'price', 500)} className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100"><TrendingUp size={12} /></button>
                            <span className="text-[10px] text-gray-400">±₦500</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {product.wholesalePrice ? (
                            <div>
                              <div className="text-sm text-gray-600">₦{product.wholesalePrice.toLocaleString()}</div>
                              <div className="flex items-center gap-1 mt-1">
                                <button onClick={() => handlePriceAdjust(product.id, 'wholesalePrice', -500)} className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"><TrendingDown size={12} /></button>
                                <button onClick={() => handlePriceAdjust(product.id, 'wholesalePrice', 500)} className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100"><TrendingUp size={12} /></button>
                              </div>
                            </div>
                          ) : <span className="text-gray-400 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            product.stock > 20 ? 'bg-green-100 text-green-700'
                            : product.stock > 0 ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                          }`}>{product.stock} units</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => { setEditingProduct(product); setActiveTab('edit'); }} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Edit2 size={16} /></button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No products found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add / Edit form */}
        {(activeTab === 'add' || activeTab === 'edit') && (
          <ProductForm
            product={editingProduct}
            onSave={async product => {
              if (db) {
                // Strip undefined values — Firestore rejects them
                const clean = (obj: Record<string, any>) =>
                  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

                if (editingProduct && editingProduct.id) {
                  try {
                    const { id, ...rawRest } = product as any;
                    const rest = clean(rawRest);
                    const docRef = doc(db, 'products', editingProduct.id);
                    const snap = await getDoc(docRef);
                    if (snap.exists()) {
                      await updateDoc(docRef, { ...rest, updatedAt: Timestamp.now() });
                    } else {
                      await addDoc(collection(db, 'products'), { ...rest, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
                    }
                    toast.success('Product saved!');
                  } catch (e: any) {
                    toast.error('Save failed: ' + e.message);
                  }
                } else {
                  const { id: _id, ...rawRest } = product as any;
                  const rest = clean(rawRest);
                  await addDoc(collection(db, 'products'), { ...rest, createdAt: Timestamp.now(), updatedAt: Timestamp.now() })
                    .then(() => toast.success('Product added to Firestore!'))
                    .catch(e => toast.error('Add failed: ' + e.message));
                }
              } else {
                // localStorage fallback
                if (editingProduct) {
                  const updated = products.map(p => p.id === product.id ? product : p);
                  localStorage.setItem('admin_products', JSON.stringify(updated));
                  setProducts(updated);
                  toast.success('Product updated!');
                } else {
                  const updated = [...products, { ...product, id: `prod-${Date.now()}` }];
                  localStorage.setItem('admin_products', JSON.stringify(updated));
                  setProducts(updated);
                  toast.success('Product added!');
                }
              }
              setActiveTab('products');
              setEditingProduct(null);
            }}
            onCancel={() => { setActiveTab('products'); setEditingProduct(null); }}
          />
        )}

        {/* Slides */}
        {activeTab === 'slides' && (
          <SlidesEditor />
        )}

        {/* Testimonials */}
        {activeTab === 'testimonials' && (
          <TestimonialsEditor />
        )}

        {/* Category Images */}
        {activeTab === 'categories' && (
          <CategoryImagesEditor />
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-800">Registered Customers ({users.length})</h2>
            </div>
            {users.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No customers yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {['Name', 'Email', 'Phone', 'Joined'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600 text-sm flex-shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="font-semibold text-sm">{u.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{u.email}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{u.phone || <span className="text-gray-400">—</span>}</td>
                        <td className="px-4 py-4 text-xs text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Image Uploader ───────────────────────────────────────────────────────────

function ImageUploader({
  slots,
  setSlots,
}: {
  slots: ImageSlot[];
  setSlots: React.Dispatch<React.SetStateAction<ImageSlot[]>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    Array.from(fileList).forEach(file => uploadOne(file));
  };

  const uploadOne = async (file: File) => {
    const id = makeId();
    const preview = URL.createObjectURL(file);

    // 1. Show preview immediately
    setSlots(prev => [...prev, { id, preview, url: '', uploading: true, isCloud: false }]);

    // 2. Convert to base64 (always works — no network)
    const base64 = await readAsBase64(file);

    // 3. Mark as saved with base64 URL right away
    setSlots(prev => prev.map(s =>
      s.id === id ? { ...s, url: base64, uploading: false } : s
    ));

    // 4. Try Cloudinary in background — upgrade if it works
    try {
      const cloudUrl = await tryCloudinary(file);
      setSlots(prev => prev.map(s =>
        s.id === id ? { ...s, url: cloudUrl, isCloud: true } : s
      ));
    } catch {
      // Keep base64 — that's fine
    }
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-400 hover:bg-red-50/30'
        }`}
      >
        <Upload size={28} className="mx-auto mb-3 text-gray-300" />
        <p className="text-sm font-semibold text-gray-700">Click to choose images or drag & drop here</p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — first image is the main product image</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
        />
      </div>

      {slots.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {slots.map((slot, i) => (
            <div key={slot.id} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
              {/* Preview image */}
              <img src={slot.preview} alt="" className="absolute inset-0 w-full h-full object-cover" />

              {/* Processing spinner */}
              {slot.uploading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                  <Loader2 size={22} className="text-white animate-spin" />
                  <span className="text-white text-[10px] font-medium">Saving…</span>
                </div>
              )}

              {/* Ready badge */}
              {!slot.uploading && slot.url && (
                <div className={`absolute top-1.5 left-1.5 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-tight ${slot.isCloud ? 'bg-green-500' : 'bg-red-500'}`}>
                  {slot.isCloud ? '☁' : '✓'}
                </div>
              )}

              {/* Main label */}
              {i === 0 && (
                <div className="absolute bottom-1.5 left-1.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-tight">
                  MAIN
                </div>
              )}

              {/* Remove */}
              <button
                type="button"
                onClick={() => setSlots(prev => prev.filter(s => s.id !== slot.id))}
                className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Product Form ─────────────────────────────────────────────────────────────

interface ProductFormProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product ?? {
      name: '', shortDescription: '', description: '', price: 0, wholesalePrice: undefined,
      category: '', image: '', images: [], stock: 0,
      rating: 4.5, reviews: 0, featured: false, hot: false, isNewArrival: false,
    }
  );

  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(
    () => (product?.images ?? (product?.image ? [product.image] : [])).map(url => ({
      id: makeId(),
      preview: url,
      url,
      uploading: false,
      isCloud: url.startsWith('http'),
    }))
  );

  const categoryOptions = allCategories.map(c => ({ value: c.id, label: `${c.icon} ${c.name}` }));
  const subcategoryOptions = formData.category
    ? (allSubcategories[formData.category] || []).map(s => ({ value: s.id, label: `${s.icon} ${s.name}` }))
    : [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (imageSlots.some(s => s.uploading)) {
      toast.error('Please wait — images are still processing');
      return;
    }

    const readyImages = imageSlots.filter(s => s.url).map(s => s.url);

    if (readyImages.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }
    if (!formData.name?.trim() || !formData.price) {
      toast.error('Please fill in product name and price');
      return;
    }

    const payload: Product = {
      id: product?.id || '',
      name: formData.name.trim(),
      shortDescription: formData.shortDescription || '',
      description: formData.description || '',
      price: Number(formData.price),
      category: formData.category || 'phone-accessories',
      image: readyImages[0],
      images: readyImages,
      stock: Number(formData.stock) || 0,
      rating: Number(formData.rating) || 4.5,
      reviews: Number(formData.reviews) || 0,
      featured: formData.featured ?? false,
      hot: formData.hot ?? false,
      isNewArrival: formData.isNewArrival ?? false,
      wholesaleAvailable: formData.wholesaleAvailable ?? false,
      variants: formData.variants || [],
    };
    if (formData.wholesalePrice) {
      payload.wholesalePrice = Number(formData.wholesalePrice);
    }
    if ((formData as any).subcategory) {
      (payload as any).subcategory = (formData as any).subcategory;
    }
    onSave(payload);
  };

  const sf = (patch: Partial<Product>) => setFormData(prev => ({ ...prev, ...patch }));
  const anyUploading = imageSlots.some(s => s.uploading);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field label="Product Name *">
            <input type="text" value={formData.name} onChange={e => sf({ name: e.target.value })} className="form-input" placeholder="e.g. INFINIX XPOWER30 30000mAh" required />
          </Field>
          <Field label="Short Description">
            <input type="text" value={formData.shortDescription || ''} onChange={e => sf({ shortDescription: e.target.value })} className="form-input" placeholder="Brief summary (e.g. 30000mAh Power Bank)" />
          </Field>
          <Field label="Description">
            <textarea value={formData.description} onChange={e => sf({ description: e.target.value })} rows={4} className="form-input resize-none" placeholder="Product description..." />
          </Field>
          <Field label="Category *">
            <select value={formData.category} onChange={e => sf({ category: e.target.value, subcategory: '' })} className="form-input" required>
              <option value="">Select category…</option>
              {categoryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          {subcategoryOptions.length > 0 && (
            <Field label="Sub-category">
              <select value={(formData as any).subcategory || ''} onChange={e => sf({ subcategory: e.target.value } as any)} className="form-input">
                <option value="">None</option>
                {subcategoryOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
          )}
        </div>

        <div className="space-y-4">
          <Field label="Retail Price (₦) *">
            <input type="number" value={formData.price} onChange={e => sf({ price: Number(e.target.value) })} className="form-input" min="0" required />
          </Field>
          <Field label="Wholesale Price (₦)">
            <input type="number" value={formData.wholesalePrice || ''} onChange={e => sf({ wholesalePrice: e.target.value ? Number(e.target.value) : undefined })} className="form-input" min="0" placeholder="Optional" />
          </Field>
          <Field label="Stock Quantity *">
            <input type="number" value={formData.stock} onChange={e => sf({ stock: Number(e.target.value) })} className="form-input" min="0" required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rating">
              <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => sf({ rating: Number(e.target.value) })} className="form-input" />
            </Field>
            <Field label="Reviews">
              <input type="number" value={formData.reviews} onChange={e => sf({ reviews: Number(e.target.value) })} className="form-input" min="0" />
            </Field>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input type="checkbox" checked={!!formData.featured} onChange={e => sf({ featured: e.target.checked })} className="w-4 h-4 accent-red-600" />
              Featured
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input type="checkbox" checked={!!formData.hot} onChange={e => sf({ hot: e.target.checked })} className="w-4 h-4 accent-red-600" />
              Trending Deal
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input type="checkbox" checked={!!formData.isNewArrival} onChange={e => sf({ isNewArrival: e.target.checked })} className="w-4 h-4 accent-blue-600" />
              New Arrival
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input type="checkbox" checked={!!formData.wholesaleAvailable} onChange={e => sf({ wholesaleAvailable: e.target.checked })} className="w-4 h-4 accent-amber-500" />
              Available for Wholesale
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Field label="Product Images *">
          <ImageUploader slots={imageSlots} setSlots={setImageSlots} />
          {imageSlots.length > 0 && !anyUploading && (
            <p className="mt-2 text-xs text-gray-400">
              {imageSlots.some(s => s.isCloud)
                ? '☁ Images stored on Cloudinary'
                : '✓ Images saved locally — set up Cloudinary preset to store in the cloud'}
            </p>
          )}
        </Field>
      </div>

      <div className="mt-8 flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium">
          <X size={18} /> Cancel
        </button>
        <button
          type="submit"
          disabled={anyUploading}
          className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {anyUploading ? <><Loader2 size={18} className="animate-spin" /> Processing…</> : <><Save size={18} /> {product ? 'Save Changes' : 'Add Product'}</>}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function AdminThumb({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = React.useState(false);
  if (!src || err) {
    return <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><ImageOff size={20} className="text-gray-300" /></div>;
  }
  return <img src={src} alt={alt} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" onError={() => setErr(true)} />;
}

// ─── Slides Editor ────────────────────────────────────────────────────────────

interface SlideData {
  id?: string;
  order: number;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
}

const DEFAULT_SLIDES: SlideData[] = [
  { order: 1, title: 'Power Up Your Life', subtitle: 'Genuine Infinix power banks at the best prices in Lagos', cta: 'Shop Power Banks', image: '' },
  { order: 2, title: 'Wholesale Deals', subtitle: 'Buy in bulk and save more — lowest wholesale prices guaranteed', cta: 'Learn More', image: '' },
  { order: 3, title: 'Tech Accessories', subtitle: 'Latest gadgets and accessories just landed at Zeetech', cta: 'Explore', image: '' },
];

function SlidesEditor() {
  const [slides, setSlides] = useState<SlideData[]>(DEFAULT_SLIDES);
  const [saving, setSaving] = useState<number | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'slides'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as SlideData));
        setSlides(prev => DEFAULT_SLIDES.map((def, i) => {
          const found = loaded.find(s => s.order === i + 1);
          return found ? found : def;
        }));
      }
    }, () => {});
    return () => unsub();
  }, []);

  const handleImageUpload = async (idx: number, file: File) => {
    setUploading(idx);
    try {
      const base64 = await readAsBase64(file);
      setSlides(prev => prev.map((s, i) => i === idx ? { ...s, image: base64 } : s));
      try {
        const cloudUrl = await tryCloudinary(file);
        setSlides(prev => prev.map((s, i) => i === idx ? { ...s, image: cloudUrl } : s));
      } catch { /* keep base64 */ }
    } finally {
      setUploading(null);
    }
  };

  const saveSlide = async (idx: number) => {
    if (!db) { toast.error('Firestore not available'); return; }
    setSaving(idx);
    const slide = slides[idx];
    try {
      const clean = { order: slide.order, title: slide.title, subtitle: slide.subtitle, cta: slide.cta, ...(slide.image ? { image: slide.image } : {}) };
      if (slide.id) {
        await updateDoc(doc(db, 'slides', slide.id), { ...clean, updatedAt: Timestamp.now() });
      } else {
        const ref = await addDoc(collection(db, 'slides'), { ...clean, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
        setSlides(prev => prev.map((s, i) => i === idx ? { ...s, id: ref.id } : s));
      }
      toast.success(`Slide ${idx + 1} saved!`);
    } catch (e: any) {
      toast.error('Save failed: ' + e.message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-lg text-gray-800 mb-1">Homepage Slides</h2>
        <p className="text-sm text-gray-500 mb-6">Edit the 3 homepage banner slides. Changes save to Firestore and update the site instantly.</p>
        <div className="space-y-6">
          {slides.map((slide, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 bg-[#b91c1c] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</span>
                <span className="font-semibold text-gray-700">Slide {idx + 1}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={e => setSlides(prev => prev.map((s, i) => i === idx ? { ...s, title: e.target.value } : s))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Slide title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label>
                    <textarea
                      value={slide.subtitle}
                      onChange={e => setSlides(prev => prev.map((s, i) => i === idx ? { ...s, subtitle: e.target.value } : s))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      placeholder="Subtitle text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={slide.cta}
                      onChange={e => setSlides(prev => prev.map((s, i) => i === idx ? { ...s, cta: e.target.value } : s))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Button label"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Background Image (optional)</label>
                  <div
                    onClick={() => fileRefs[idx].current?.click()}
                    className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-red-400 transition-colors"
                    style={{ minHeight: 120 }}
                  >
                    {slide.image ? (
                      <img src={slide.image} alt="" className="w-full h-full object-cover absolute inset-0" style={{ minHeight: 120 }} />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-6 text-gray-400">
                        <Upload size={24} className="mb-1" />
                        <span className="text-xs">Click to upload image</span>
                      </div>
                    )}
                    {uploading === idx && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 size={24} className="text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileRefs[idx]}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => { if (e.target.files?.[0]) handleImageUpload(idx, e.target.files[0]); e.target.value = ''; }}
                  />
                  {slide.image && (
                    <button
                      type="button"
                      onClick={() => setSlides(prev => prev.map((s, i) => i === idx ? { ...s, image: '' } : s))}
                      className="mt-1 text-xs text-red-500 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => saveSlide(idx)}
                  disabled={saving === idx}
                  className="flex items-center gap-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {saving === idx ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Slide {idx + 1}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Testimonials Editor ──────────────────────────────────────────────────────

interface TestimonialData {
  id?: string;
  name: string;
  text: string;
  rating: number;
  avatar: string;
  order: number;
}

const DEFAULT_TESTIMONIALS: TestimonialData[] = [
  { name: 'Chioma Adeyemi', text: 'Best prices for power banks and phone accessories in Lagos! Ordered wholesale and got amazing discounts. Fast delivery!', rating: 5, avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?crop=entropy&cs=tinysrgb&fit=crop&w=100&h=100', order: 1 },
  { name: 'Ibrahim Musa', text: 'Been buying electronics from Zeetech for 2 years. Always genuine products. The Infinix power banks are fire!', rating: 5, avatar: 'https://images.unsplash.com/photo-1659422440915-d516c6dc932e?crop=entropy&cs=tinysrgb&fit=crop&w=100&h=100', order: 2 },
  { name: 'Funke Olatunji', text: 'Excellent customer service and quality gadgets. My go-to store for all tech accessories in Lagos!', rating: 5, avatar: 'https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?crop=entropy&cs=tinysrgb&fit=crop&w=100&h=100', order: 3 },
];

function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(DEFAULT_TESTIMONIALS);
  const [saving, setSaving] = useState<number | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as TestimonialData));
        setTestimonials(prev => DEFAULT_TESTIMONIALS.map((def, i) => {
          const found = loaded.find(t => t.order === i + 1);
          return found ? found : def;
        }));
      }
    }, () => {});
    return () => unsub();
  }, []);

  const handleAvatarUpload = async (idx: number, file: File) => {
    setUploading(idx);
    try {
      const base64 = await readAsBase64(file);
      setTestimonials(prev => prev.map((t, i) => i === idx ? { ...t, avatar: base64 } : t));
      try {
        const cloudUrl = await tryCloudinary(file);
        setTestimonials(prev => prev.map((t, i) => i === idx ? { ...t, avatar: cloudUrl } : t));
      } catch { /* keep base64 */ }
    } finally {
      setUploading(null);
    }
  };

  const saveTestimonial = async (idx: number) => {
    if (!db) { toast.error('Firestore not available'); return; }
    setSaving(idx);
    const testimonial = testimonials[idx];
    try {
      const clean = { order: testimonial.order, name: testimonial.name, text: testimonial.text, rating: testimonial.rating, avatar: testimonial.avatar };
      if (testimonial.id) {
        await updateDoc(doc(db, 'testimonials', testimonial.id), { ...clean, updatedAt: Timestamp.now() });
      } else {
        const ref = await addDoc(collection(db, 'testimonials'), { ...clean, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
        setTestimonials(prev => prev.map((t, i) => i === idx ? { ...t, id: ref.id } : t));
      }
      toast.success(`Testimonial ${idx + 1} saved!`);
    } catch (e: any) {
      toast.error('Save failed: ' + e.message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-lg text-gray-800 mb-1">Customer Testimonials</h2>
        <p className="text-sm text-gray-500 mb-6">Edit the 3 customer testimonials displayed on the homepage. Changes save to Firestore and update instantly.</p>
        <div className="space-y-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 bg-[#b91c1c] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</span>
                <span className="font-semibold text-gray-700">Testimonial {idx + 1}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={e => setTestimonials(prev => prev.map((t, i) => i === idx ? { ...t, name: e.target.value } : t))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Testimonial Text</label>
                    <textarea
                      value={testimonial.text}
                      onChange={e => setTestimonials(prev => prev.map((t, i) => i === idx ? { ...t, text: e.target.value } : t))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      placeholder="Customer testimonial"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={e => setTestimonials(prev => prev.map((t, i) => i === idx ? { ...t, rating: parseInt(e.target.value) || 5 } : t))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Avatar Photo</label>
                  <div
                    onClick={() => fileRefs[idx].current?.click()}
                    className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-red-400 transition-colors"
                    style={{ minHeight: 160 }}
                  >
                    {testimonial.avatar ? (
                      <img src={testimonial.avatar} alt="" className="w-full h-full object-cover absolute inset-0" style={{ minHeight: 160 }} />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-6 text-gray-400">
                        <Upload size={24} className="mb-1" />
                        <span className="text-xs">Click to upload avatar</span>
                      </div>
                    )}
                    {uploading === idx && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 size={24} className="text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileRefs[idx]}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => { if (e.target.files?.[0]) handleAvatarUpload(idx, e.target.files[0]); e.target.value = ''; }}
                  />
                  {testimonial.avatar && (
                    <button
                      type="button"
                      onClick={() => setTestimonials(prev => prev.map((t, i) => i === idx ? { ...t, avatar: '' } : t))}
                      className="mt-1 text-xs text-red-500 hover:text-red-700"
                    >
                      Remove avatar
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => saveTestimonial(idx)}
                  disabled={saving === idx}
                  className="flex items-center gap-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {saving === idx ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Testimonial {idx + 1}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Category Images Editor ───────────────────────────────────────────────────

interface CategoryImageData {
  id?: string;
  title: string;
  description: string;
  category: string;
  image: string;
  overlay: string;
  order: number;
}

const DEFAULT_CATEGORIES: CategoryImageData[] = [
  { title: 'Phone Accessories', description: 'Earbuds, cases, holders & more', category: 'phone-accessories', image: '', overlay: 'from-[#b91c1c]', order: 1 },
  { title: 'Charging Accessories', description: 'Power banks, chargers & cables', category: 'charging-accessories', image: '', overlay: 'from-[#d97706]', order: 2 },
  { title: 'Computer Accessories', description: 'Keyboards, mice, webcams & more', category: 'computer-accessories', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', overlay: 'from-[#b91c1c]', order: 3 },
];

function CategoryImagesEditor() {
  const [categories, setCategories] = useState<CategoryImageData[]>(DEFAULT_CATEGORIES);
  const [saving, setSaving] = useState<number | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'categoryImages'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as CategoryImageData));
        setCategories(prev => DEFAULT_CATEGORIES.map((def, i) => {
          const found = loaded.find(c => c.order === i + 1);
          return found ? found : def;
        }));
      }
    }, () => {});
    return () => unsub();
  }, []);

  const handleImageUpload = async (idx: number, file: File) => {
    setUploading(idx);
    try {
      const base64 = await readAsBase64(file);
      setCategories(prev => prev.map((c, i) => i === idx ? { ...c, image: base64 } : c));
      try {
        const cloudUrl = await tryCloudinary(file);
        setCategories(prev => prev.map((c, i) => i === idx ? { ...c, image: cloudUrl } : c));
      } catch { /* keep base64 */ }
    } finally {
      setUploading(null);
    }
  };

  const saveCategory = async (idx: number) => {
    if (!db) { toast.error('Firestore not available'); return; }
    setSaving(idx);
    const category = categories[idx];
    try {
      const clean = { order: category.order, title: category.title, description: category.description, category: category.category, image: category.image, overlay: category.overlay };
      if (category.id) {
        await updateDoc(doc(db, 'categoryImages', category.id), { ...clean, updatedAt: Timestamp.now() });
      } else {
        const ref = await addDoc(collection(db, 'categoryImages'), { ...clean, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
        setCategories(prev => prev.map((c, i) => i === idx ? { ...c, id: ref.id } : c));
      }
      toast.success(`Category ${idx + 1} saved!`);
    } catch (e: any) {
      toast.error('Save failed: ' + e.message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-lg text-gray-800 mb-1">Shop by Category Images</h2>
        <p className="text-sm text-gray-500 mb-6">Edit the 3 category images displayed in the "Shop by Category" section. Changes save to Firestore and update instantly.</p>
        <div className="space-y-6">
          {categories.map((category, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 bg-[#b91c1c] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</span>
                <span className="font-semibold text-gray-700">Category {idx + 1}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={category.title}
                      onChange={e => setCategories(prev => prev.map((c, i) => i === idx ? { ...c, title: e.target.value } : c))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Category title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                    <textarea
                      value={category.description}
                      onChange={e => setCategories(prev => prev.map((c, i) => i === idx ? { ...c, description: e.target.value } : c))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      placeholder="Category description"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category Image</label>
                  <div
                    onClick={() => fileRefs[idx].current?.click()}
                    className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-red-400 transition-colors"
                    style={{ minHeight: 120 }}
                  >
                    {category.image ? (
                      <img src={category.image} alt="" className="w-full h-full object-cover absolute inset-0" style={{ minHeight: 120 }} />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-6 text-gray-400">
                        <Upload size={24} className="mb-1" />
                        <span className="text-xs">Click to upload image</span>
                      </div>
                    )}
                    {uploading === idx && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 size={24} className="text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileRefs[idx]}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => { if (e.target.files?.[0]) handleImageUpload(idx, e.target.files[0]); e.target.value = ''; }}
                  />
                  {category.image && (
                    <button
                      type="button"
                      onClick={() => setCategories(prev => prev.map((c, i) => i === idx ? { ...c, image: '' } : c))}
                      className="mt-1 text-xs text-red-500 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => saveCategory(idx)}
                  disabled={saving === idx}
                  className="flex items-center gap-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {saving === idx ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Category {idx + 1}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
