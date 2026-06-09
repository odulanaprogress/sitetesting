# Zeetech Distribution - Color Scheme Guide

## Primary Colors

### Red (Primary Brand Color)
- **Dark Red:** `#b91c1c` (rgb(185, 28, 28)) - Main brand color
- **Medium Red:** `#dc2626` (rgb(220, 38, 38)) - Accent color
- **Light Red:** `#fca5a5` (rgb(252, 165, 165)) - Highlights

### Amber (Secondary/Accent Color)
- **Dark Amber:** `#d97706` (rgb(217, 119, 6)) - Secondary actions
- **Medium Amber:** `#f59e0b` (rgb(245, 158, 11)) - Highlights

### Burgundy (Navigation)
- **Dark Burgundy:** `#8b1a1a` (rgb(139, 26, 26)) - Navigation bar
- **Deep Burgundy:** `#7f1d1d` (rgb(127, 29, 29)) - Dark accents
- **Very Dark:** `#991b1b` (rgb(153, 27, 27)) - Hover states

## Neutral Colors

### Grays
- **Very Light Gray:** `#fafafa` (rgb(250, 250, 250)) - Backgrounds
- **Light Gray:** `#f5f5f5` (rgb(245, 245, 245)) - Alternate backgrounds
- **Gray 50:** `#f9fafb` (rgb(249, 250, 251)) - Input backgrounds
- **Gray 100:** `#f3f4f6` (rgb(243, 244, 246)) - Borders
- **Gray 200:** `#e5e7eb` (rgb(229, 231, 235)) - Dividers
- **Gray 300:** `#d1d5db` (rgb(209, 213, 219)) - Disabled states
- **Gray 400:** `#9ca3af` (rgb(156, 163, 175)) - Placeholder text
- **Gray 500:** `#6b7280` (rgb(107, 114, 128)) - Secondary text
- **Gray 600:** `#4b5563` (rgb(75, 85, 99)) - Body text
- **Gray 700:** `#374151` (rgb(55, 65, 81)) - Headings
- **Gray 800:** `#1f2937` (rgb(31, 41, 55)) - Dark text
- **Gray 900:** `#111827` (rgb(17, 24, 39)) - Black alternative

### Pure Colors
- **White:** `#ffffff` - Cards, modals
- **Black:** Avoid using pure black, use Gray 900 instead

## Usage Guidelines

### Buttons
- **Primary Button:** `bg-[#b91c1c]` with `hover:bg-[#991b1b]`
- **Secondary Button:** `bg-[#d97706]` with `hover:bg-[#b45309]`
- **Text Button:** `text-[#b91c1c]` with `hover:text-[#991b1b]`

### Links
- **Default:** `text-[#b91c1c]`
- **Hover:** `hover:text-[#991b1b]`

### Inputs & Forms
- **Border:** `border-gray-300`
- **Background:** `bg-gray-50`
- **Focus Ring:** `focus:ring-[#b91c1c]` and `focus:border-[#b91c1c]`
- **Placeholder:** `placeholder-gray-500`

### Cards
- **Background:** `bg-white`
- **Border:** `border-gray-100` or `border-gray-200`
- **Hover Border:** `hover:border-[#b91c1c]`

### Navigation
- **Top Bar:** `bg-[#b91c1c]` - Promo banner
- **Main Nav:** `bg-[#8b1a1a]` - Category navigation
- **Nav Links:** `text-white` with `hover:bg-[#7a1717]`

### Badges & Tags
- **Hot/Featured:** `bg-[#b91c1c]` with `text-white`
- **Wholesale:** `bg-gray-900` with `text-white`
- **Sale:** `bg-[#d97706]` with `text-white`

### Text Colors
- **Headings:** `text-gray-900` or `text-gray-800`
- **Body Text:** `text-gray-600` or `text-gray-700`
- **Muted Text:** `text-gray-500`
- **Placeholder:** `text-gray-400`

### Backgrounds
- **Page Background:** `bg-gray-50` or `bg-white`
- **Section Alternate:** `bg-gradient-to-b from-white to-gray-50`
- **Dark Sections:** `bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`

### Gradients
- **Primary Hero:** `from-red-900 via-red-800 to-red-950`
- **Red Gradient:** `from-[#b91c1c] to-[#7f1d1d]`
- **Light Gray:** `from-gray-50 to-white`
- **Dark Gray:** `from-gray-900 via-gray-800 to-gray-900`

## Accessibility

### Color Contrast
- Ensure text on colored backgrounds meets WCAG AA standards (4.5:1 for normal text)
- White text on `#b91c1c` background: ✅ Passes
- White text on `#d97706` background: ✅ Passes
- Gray 600 text on white background: ✅ Passes

### Focus States
- Always include visible focus states: `focus:ring-2 focus:ring-[#b91c1c]`
- Focus outline for keyboard navigation: `focus:outline-none focus:ring-2`

## Do's and Don'ts

### ✅ Do
- Use red (`#b91c1c`) for primary actions and brand elements
- Use amber (`#d97706`) for secondary/complementary actions
- Use grays for neutral elements, text, and borders
- Maintain consistent hover states (darker shades)
- Use gradients sparingly for hero sections

### ❌ Don't
- Don't use pure black `#000000` - use Gray 900 instead
- Don't mix too many accent colors in one section
- Don't use blue or orange (old brand colors)
- Don't use low-contrast color combinations
- Don't create custom colors - stick to the palette

## CSS Variables

```css
:root {
  --primary: #b91c1c;
  --secondary: #d97706;
  --foreground: #1a1a1a;
  --background: #ffffff;
  --muted: #f5f5f5;
  --border: #e5e5e5;
}
```

---

**Last Updated:** June 3, 2026  
**Brand:** Zeetech Distribution  
**Theme:** Red & Neutral Professional
