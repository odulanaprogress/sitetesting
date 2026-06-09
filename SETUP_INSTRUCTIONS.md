# eCommerce Platform - Setup Instructions

This is a complete eCommerce template built with React, TypeScript, and Tailwind CSS. Follow the instructions below to customize it for your client.

## ⭐ New Features Added
- **Fully Functional Admin Panel**: Add, edit, and delete products with real-time updates
- **WhatsApp-Style Testimonial Popups**: Automatic social proof notifications that show real customer messages
- **Generic Branding**: All placeholder text is now easy to find and replace (see `BRANDING_UPDATE.md`)
- **Professional UI**: Modern, clean design ready for any wholesale/retail business

## 🛠️ Admin Panel (NEW!)

Your client can now manage products directly through the website!

**Access:** Navigate to `/admin` or click "Admin" in the header

**Features:**
- Add new products with images, prices, variants
- Edit existing products (update prices, stock, descriptions)
- Delete products
- Mark products as "Featured" or "Hot Deals"
- Set wholesale pricing
- Manage product variants (size, color, etc.)
- Real-time updates to the website

**See:** `ADMIN_GUIDE.md` for complete admin panel documentation

## 🎨 Customization Checklist

### 1. **Branding & Content**

#### Update Company Information
**Quick Reference:** See `BRANDING_UPDATE.md` for a complete find & replace guide!

- **File**: `src/app/components/Header.tsx`
  - Replace `[Your Business Name]` with client's business name
  - Update the logo (currently showing "Z" - replace with actual logo image)

- **File**: `src/app/components/Footer.tsx`
  - Replace `[Your Business Name]` with client's business name
  - Update `info@yourbusiness.com` with actual email
  - Update `+234 XXX XXX XXXX` with actual phone
  - Update `Lagos, Nigeria` with actual address
  - Update social media links (Facebook, Instagram, Twitter)

#### Update WhatsApp Number
- **File**: `src/app/components/WhatsAppButton.tsx`
  - Line 4: Replace `2348000000000` with client's WhatsApp number

#### Update Banner Messages
- **File**: `src/app/components/Header.tsx`
  - Update the top banner message (currently: "Free delivery on orders above ₦50,000")

### 2. **Products & Categories**

#### Add Real Products
- **File**: `src/app/data/mockData.ts`
  - Replace the mock products array with real products
  - Update product images (use Unsplash URLs or upload to hosting)
  - Update prices, descriptions, categories, stock levels
  - Add product variants (sizes, colors)

#### Update Categories
- **File**: `src/app/data/mockData.ts`
  - Modify the `categories` array to match client's product categories

### 3. **Paystack Integration** 🔐

#### Add Paystack Public Key
- **File**: `src/app/pages/CheckoutPage.tsx`
- **Line 60-75**: Uncomment the Paystack integration code
- Replace `YOUR_PAYSTACK_PUBLIC_KEY` with client's Paystack public key

```typescript
// Replace the mock implementation (line 78-91) with:
const PaystackPop = window.PaystackPop;
const handler = PaystackPop.setup({
  key: 'pk_live_xxxxxxxxxxxxxxxx', // Client's public key
  email: formData.email,
  amount: total * 100, // Amount in kobo
  currency: 'NGN',
  ref: reference,
  callback: function(response) {
    verifyPayment(response.reference);
  },
  onClose: function() {
    setIsProcessing(false);
    toast.error('Payment cancelled');
  }
});
handler.openIframe();
```

#### Add Paystack Script
- **File**: `index.html` (in public folder)
- Add this in the `<head>` section:

```html
<script src="https://js.paystack.co/v1/inline.js"></script>
```

#### Backend Verification (Required)
You need to set up a backend to:
1. Verify Paystack transactions (using secret key)
2. Save orders to database
3. Generate and send invoice PDFs
4. Send confirmation emails

**Recommended Backend Stack:**
- Node.js + Express
- MongoDB/Firestore for database
- Nodemailer for emails
- PDFKit or jsPDF for invoice generation

### 4. **Pricing & Delivery**

#### Update Delivery Fees
- **File**: `src/app/pages/CartPage.tsx` (Line 9)
- **File**: `src/app/pages/CheckoutPage.tsx` (Line 25)
- Modify free delivery threshold (currently ₦50,000)
- Update standard delivery fee (currently ₦2,500)
- Update express delivery fee (currently ₦5,000)

#### Update Wholesale Pricing
- **File**: `src/app/pages/WholesalePage.tsx`
- Update pricing tiers and discounts
- Update benefits for each tier

### 5. **Email & Notifications**

#### Configure Email Service
Set up Nodemailer or SendGrid to send:
- Order confirmation emails
- Invoice PDFs
- Shipping notifications

Example Nodemailer setup (backend):
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

// Send order confirmation
const mailOptions = {
  from: 'your-email@gmail.com',
  to: customerEmail,
  subject: 'Order Confirmation',
  html: orderTemplate,
  attachments: [{ filename: 'invoice.pdf', path: invoicePath }]
};

transporter.sendMail(mailOptions);
```

### 6. **Invoice Generation**

Use PDFKit (Node.js) or jsPDF (client-side) to generate invoices:

```javascript
const PDFDocument = require('pdfkit');

const generateInvoice = (order) => {
  const doc = new PDFDocument();
  
  doc.fontSize(20).text('INVOICE', { align: 'center' });
  doc.fontSize(12).text(`Order ID: ${order.id}`);
  doc.text(`Customer: ${order.customerName}`);
  // Add items, totals, etc.
  
  return doc;
};
```

### 7. **Deployment**

#### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Backend Deployment
- Deploy to Heroku, Railway, or Vercel serverless functions
- Set environment variables for:
  - `PAYSTACK_SECRET_KEY`
  - `MONGODB_URI` or `FIREBASE_CONFIG`
  - `EMAIL_SERVICE_CREDENTIALS`

### 8. **Testing**

Before going live:
1. Test Paystack in **test mode** first (use test keys)
2. Place test orders and verify:
   - Payment processing
   - Order saving
   - Email delivery
   - Invoice generation
3. Test on mobile devices
4. Check all links and navigation

### 9. **Security Considerations**

⚠️ **Important:**
- Never expose Paystack secret key on frontend
- Always verify payments on backend
- Use HTTPS in production
- Validate all user inputs
- Sanitize data before saving to database

### 10. **Optional Enhancements**

- Add admin dashboard for managing orders
- Implement user authentication
- Add order tracking feature
- Set up analytics (Google Analytics)
- Add customer reviews system
- Implement wishlist functionality
- Add coupon/discount codes

## 📞 Support

If you need help with:
- Backend setup
- Paystack integration
- Database configuration
- Email service setup

Contact your developer or reach out for support.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

**Template Version:** 1.0  
**Last Updated:** May 2026
