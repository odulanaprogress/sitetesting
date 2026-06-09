# Cloudinary Setup Instructions

## ✅ Configuration Complete

Your Cloudinary credentials have been integrated:
- **Cloud Name**: dlxnaefxk
- **API Key**: 982543269676827
- **API Secret**: ✓ Secured (not exposed to frontend)

## 🔧 Required: Create Upload Preset

You need to create an **unsigned upload preset** in Cloudinary to allow image uploads from your admin panel.

### Steps:

1. **Go to Cloudinary Dashboard**
   - Visit: https://console.cloudinary.com/

2. **Navigate to Upload Settings**
   - Click on **Settings** (gear icon) in the top right
   - Select **Upload** tab

3. **Create Upload Preset**
   - Scroll down to **Upload presets** section
   - Click **Add upload preset**
   
4. **Configure the Preset**
   - **Upload preset name**: `zeetech_products`
   - **Signing Mode**: Select **Unsigned** (Important!)
   - **Folder**: `products` (optional but recommended)
   - **Use filename or externally defined Public ID**: Enable this
   - **Unique filename**: Enable this
   - **Overwrite**: Disable this
   
5. **Set Access Control** (Optional)
   - **Access mode**: Public
   
6. **Set Image Transformations** (Optional but recommended)
   - **Format**: auto
   - **Quality**: auto
   - **Max dimensions**: Width: 2000, Height: 2000
   
7. **Click Save**

## 🎯 What This Enables

With the upload preset created, your admin panel will be able to:
- ✅ Upload product images directly from the browser
- ✅ Drag and drop images
- ✅ Take photos with camera (on mobile)
- ✅ Auto-optimize images for web
- ✅ Store images in organized folders

## 🔒 Security

- The API Secret is **NOT** exposed to the frontend
- Uploads use **unsigned presets** which are secure for public use
- All uploads are restricted by the preset configuration

## 📝 Alternative: Manual Image URLs

If you prefer not to use the upload widget, you can:
1. Manually upload images to Cloudinary
2. Copy the image URLs
3. Paste them directly into the product form

Both methods work perfectly!

## ⚠️ Important Notes

- Without the upload preset, the Cloudinary upload widget won't work
- With the preset, uploads will be fast and automatic
- The preset name **must be** `zeetech_products` (or update the code if you use a different name)
