# eCommerce Platform Template

A complete, production-ready eCommerce platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
# (Already running in this environment)

# Build for production
pnpm build
```

## ✨ Key Features

### Customer Features
- 🏠 Beautiful homepage with hero banners & featured products
- 🛍️ Product catalog with search, filters, and sorting
- 🛒 Shopping cart with persistent storage
- 💳 Checkout with Paystack payment integration
- 📄 Automatic PDF invoice generation
- 💬 WhatsApp integration (floating button + testimonial popups)
- 📱 Fully responsive mobile-first design
- 💰 Wholesale bulk pricing system

### Admin Features (NEW!)
- ➕ Add new products
- ✏️ Edit products (prices, stock, images, descriptions)
- 🗑️ Delete products
- 🎯 Mark products as featured or hot deals
- 📦 Manage inventory/stock levels
- 🎨 Add product variants (size, color, etc.)
- 💵 Set wholesale pricing
- 🔄 Real-time updates to website

## 📁 Project Structure

```
src/app/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CartDrawer.tsx
│   ├── WhatsAppButton.tsx
│   └── WhatsAppTestimonialPopup.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrderSuccessPage.tsx
│   ├── WholesalePage.tsx
│   └── AdminDashboard.tsx  ⭐ NEW
├── context/            # State management
│   └── CartContext.tsx
├── hooks/              # Custom React hooks
│   └── useProducts.ts  ⭐ NEW
├── data/               # Mock data
│   └── mockData.ts
└── types/              # TypeScript types
    └── index.ts
```

## 📚 Documentation

- **`SETUP_INSTRUCTIONS.md`** - Complete setup and deployment guide
- **`BRANDING_UPDATE.md`** - How to update business name, logo, contact info
- **`ADMIN_GUIDE.md`** - How to use the admin panel ⭐ NEW
- **`FEATURES.md`** - Full feature list and customization guide
- **`CONFIGURATION.md`** - Quick reference for configuration

## 🎯 What to Customize

### 1. Branding (REQUIRED)
See `BRANDING_UPDATE.md` for complete guide:
- Business name: `[Your Business Name]`
- Email: `info@yourbusiness.com`
- Phone: `+234 XXX XXX XXXX`
- WhatsApp: `2348000000000`
- Address: `Lagos, Nigeria`

### 2. Paystack Integration (REQUIRED for payments)
**File:** `src/app/pages/CheckoutPage.tsx`
- Add your Paystack public key (line 54)
- Uncomment the Paystack integration code
- See `SETUP_INSTRUCTIONS.md` for details

### 3. Products
**Option A - Use Admin Panel (Easiest):**
1. Navigate to `/admin`
2. Click "Add New Product"
3. Fill in product details
4. Changes appear immediately!

**Option B - Edit Mock Data:**
Update `src/app/data/mockData.ts` with your products

### 4. Images
Use Unsplash for free product images:
- Visit https://unsplash.com
- Search for products (bags, shoes, etc.)
- Copy image URL
- Paste in admin panel or mockData.ts

## 🔒 Security Notes

⚠️ **Before Going Live:**
- Add authentication to admin panel (currently open access!)
- Replace Paystack test keys with live keys
- Set up backend for payment verification
- Use HTTPS in production
- Implement proper database instead of localStorage

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v4
- **State:** React Context API
- **Storage:** LocalStorage (demo) → Database (production)
- **Payments:** Paystack (placeholder ready)
- **Icons:** Lucide React
- **Notifications:** Sonner (toast)
- **Forms:** React Hook Form

## 📦 Included Libraries

- `react-router-dom` - Navigation
- `jspdf` - Invoice generation
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Tailwind CSS + Radix UI components

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Netlify
```bash
netlify deploy
```

### Other Platforms
- Build: `pnpm build`
- Output: `dist/` directory
- Deploy static files

## 🔄 How the Admin Panel Works

1. **Add/Edit/Delete** products in `/admin`
2. Products saved to **localStorage**
3. Website reads from localStorage
4. Changes appear **instantly** everywhere

For production:
- Replace localStorage with real database (MongoDB, Firestore, etc.)
- Add backend API
- Implement authentication

## 📞 Support & Help

- Admin Panel: See `ADMIN_GUIDE.md`
- Setup: See `SETUP_INSTRUCTIONS.md`
- Branding: See `BRANDING_UPDATE.md`
- Features: See `FEATURES.md`

## ⚡ Quick Access URLs

- Homepage: `/`
- Products: `/products`
- Wholesale: `/wholesale`
- Admin Panel: `/admin`
- Cart: `/cart`
- Checkout: `/checkout`

---

## 🎉 You're Ready!

1. Update branding (see `BRANDING_UPDATE.md`)
2. Add products via admin panel (`/admin`)
3. Configure Paystack keys
4. Deploy to Vercel/Netlify
5. Launch your eCommerce store! 🚀

---

**Template Version:** 2.0 (with Admin Panel)  
**Last Updated:** May 2026
