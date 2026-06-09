# Update Your Business Branding

## Quick Find & Replace Guide

When you receive your client's business details, update these placeholders throughout the application:

### 1. Business Name
**Find:** `[Your Business Name]`
**Replace with:** Client's actual business name

**Files to update:**
- `src/app/components/Header.tsx` (appears 1 time)
- `src/app/components/Footer.tsx` (appears 2 times)

### 2. Email Address  
**Find:** `info@yourbusiness.com`
**Replace with:** Client's actual email

**Files to update:**
- `src/app/components/Footer.tsx`

### 3. Phone Number
**Find:** `+234 XXX XXX XXXX`
**Replace with:** Client's WhatsApp/phone number

**Files to update:**
- `src/app/components/Footer.tsx`
- `src/app/components/WhatsAppButton.tsx` (Line 6: currently `2348000000000`)
- `src/app/pages/WholesalePage.tsx` (WhatsApp link)

### 4. Address
**Find:** `Lagos, Nigeria`
**Replace with:** Client's actual business address

**Files to update:**
- `src/app/components/Footer.tsx`

### 5. Social Media Links
Update placeholder `#` links in:
- `src/app/components/Footer.tsx` (Facebook, Instagram, Twitter links)

### 6. Logo
The current logo is just a "Z" letter. To update:

**File:** `src/app/components/Header.tsx` and `src/app/components/Footer.tsx`
**Current code:**
```tsx
<div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
  <span className="text-white text-xl font-bold">Z</span>
</div>
```

**Replace with:**
```tsx
<img src="/logo.png" alt="Business Name" className="w-10 h-10" />
```
Then add the client's logo file to the `public` folder.

---

## One-Time Global Search

Use your code editor's "Find in Files" feature:

1. Search for: `[Your Business Name]` → Replace all
2. Search for: `info@yourbusiness.com` → Replace all
3. Search for: `+234 XXX XXX XXXX` → Replace all
4. Search for: `2348000000000` → Replace with WhatsApp number
5. Search for: `Lagos, Nigeria` → Replace all

## Testing After Updates

After making these changes:
1. Check the header (business name appears correctly)
2. Check the footer (all contact info is correct)
3. Test WhatsApp button (opens with correct number)
4. Check email links (correct email address)

---

**Tip:** Keep the original placeholder format `[Your Business Name]` in brackets makes it easy to spot what still needs updating!
