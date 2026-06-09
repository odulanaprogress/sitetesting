# Admin Panel Guide

## Accessing the Admin Dashboard

Navigate to: **`/admin`** in your browser

Or click the "Admin" link in the header navigation.

---

## Features

### 📦 Product Management

#### View All Products
- See complete list of all products with images, prices, stock, and status
- Search products by name or category
- View featured and hot deal badges
- Check stock levels at a glance (color-coded: green = high stock, yellow = low stock, red = out of stock)

#### Add New Product
1. Click the **"Add New Product"** tab or the **"Add Product"** button
2. Fill in the product details:

**Basic Information:**
- Product Name (required)
- Description (required)
- Category (required)

**Pricing & Stock:**
- Retail Price in Naira (required)
- Wholesale Price (optional - for bulk pricing)
- Stock Quantity (required)
- Rating (0-5 stars)
- Number of Reviews

**Product Status:**
- ✓ Featured Product - Shows on homepage featured section
- ✓ Hot Deal - Shows in hot deals section with special badge

**Images:**
- Add product image URL (required)
- Add multiple images for product gallery
- Use Unsplash for free product images: `https://images.unsplash.com/photo-...`

**Variants (Optional):**
- Add product variants like Size, Color, etc.
- Example: Variant name: "Size" → Options: "S, M, L, XL"
- Example: Variant name: "Color" → Options: "Red, Blue, Black"

3. Click **"Add Product"** to save

#### Edit Existing Product
1. Click the **Edit (pencil)** icon next to any product
2. Update any fields you want to change
3. Click **"Update Product"** to save changes

#### Delete Product
1. Click the **Delete (trash)** icon next to any product
2. Confirm deletion in the popup
3. Product will be permanently removed

---

## How It Works

### Data Storage
- All product changes are saved to **localStorage**
- Changes persist even after closing the browser
- The main website automatically updates when you make changes in the admin panel

### Real-Time Updates
- When you add/edit/delete a product, the changes appear immediately
- No page refresh needed
- Both admin panel and customer-facing pages update instantly

### Image URLs
Use free stock images from Unsplash:
1. Go to [unsplash.com](https://unsplash.com)
2. Search for the type of product (e.g., "handbag", "shoes")
3. Right-click on an image → Copy image address
4. Paste the URL in the image field

**Example image URLs:**
- `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500`
- `https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500`

---

## Tips & Best Practices

### Product Pricing
- **Retail Price**: Regular selling price
- **Wholesale Price**: Lower price for bulk orders (leave empty if not applicable)
- When wholesale price is set, it shows discount savings on product pages

### Stock Management
- Update stock levels regularly
- Products with 0 stock show "Out of Stock" to customers
- Low stock (< 10) shows warning badge in admin panel

### Featured Products
- Use sparingly (recommend 4-8 products max)
- Featured products appear on the homepage
- Choose your best-selling or promotional items

### Hot Deals
- Mark products with special discounts
- Shows in red "Hot Deals" section on homepage
- Creates urgency for customers

### Product Variants
- Add variants for products with multiple options
- Common variants: Size, Color, Material, Style
- Customers must select variant options before adding to cart

### Categories
Available categories:
- Bags
- Shoes
- Accessories
- Watches
- Clothing
- Beauty

Choose the most relevant category for each product.

---

## Workflow Example

**Adding a new handbag:**

1. Click "Add New Product"
2. Fill in:
   - Name: "Premium Leather Handbag"
   - Description: "Elegant premium leather handbag perfect for..."
   - Category: "Bags"
   - Retail Price: 45000
   - Wholesale Price: 38000
   - Stock: 25
   - Rating: 4.8
   - Reviews: 124
3. Add image URL from Unsplash
4. Add variant: "Color" → "Black, Brown, Tan"
5. Check "Featured Product" and "Hot Deal"
6. Click "Add Product"

Done! The product now appears on your website.

---

## Troubleshooting

**Changes not showing up?**
- Refresh the browser page
- Check that you clicked "Save" or "Update Product"
- Verify localStorage is enabled in your browser

**Can't upload images directly?**
- The system uses image URLs, not file uploads
- Use Unsplash or host images elsewhere
- Copy the full image URL

**Lost all products?**
- Products are stored in browser localStorage
- Clearing browser data removes products
- For production, connect to a real database (MongoDB, Firebase, etc.)

---

## Future Enhancements (Production)

For a live production website, you'll need to:
1. **Connect to a Database** - MongoDB, Firestore, or PostgreSQL
2. **Add Authentication** - Secure admin access with login
3. **Direct Image Upload** - Upload images to cloud storage (Cloudinary, AWS S3)
4. **Order Management** - View and process customer orders
5. **Inventory Alerts** - Email notifications for low stock
6. **Bulk Operations** - Import/export products via CSV

---

## Security Note

⚠️ **Important for Production:**
- The current admin panel has NO authentication
- Anyone who knows the URL can access it
- Before going live, add login/password protection
- Use environment variables for sensitive data
- Implement proper user roles and permissions

---

**Quick Access:**
- Admin Panel: `/admin`
- View Website: `/`
- All Products: `/products`
