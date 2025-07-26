# Ausadhi Sewa Medical Green Theme Documentation

## Overview

This document outlines the comprehensive medical green color theme implementation for the Ausadhi Sewa medical e-commerce platform. The theme is built using Tailwind CSS v4 and provides a professional, trustworthy appearance suitable for healthcare applications.

## 🎨 Color Palette

### Primary Medical Green
- **50**: `#f0fdf4` - Lightest backgrounds, subtle highlights
- **100**: `#dcfce7` - Very light hover states, badges
- **200**: `#bbf7d0` - Light inactive elements, soft accents
- **300**: `#86efac` - Medium light secondary buttons
- **400**: `#4ade80` - Bright active states, icons
- **500**: `#22c55e` - **MAIN BRAND COLOR** - primary buttons, logo
- **600**: `#16a34a` - Dark button hover, active links
- **700**: `#15803d` - Darker text, borders
- **800**: `#166534` - Very dark headings, emphasis
- **900**: `#14532d` - Darkest high contrast text

### Secondary Medical Blue
- **50**: `#eff6ff` - Info backgrounds
- **100**: `#dbeafe` - Light info elements
- **200**: `#bfdbfe` - Borders, separators
- **300**: `#93c5fd` - Icons, accents
- **400**: `#60a5fa` - Interactive elements
- **500**: `#3b82f6` - Secondary buttons, links
- **600**: `#2563eb` - Button hover states
- **700**: `#1d4ed8` - Dark text, emphasis
- **800**: `#1e40af` - Headings
- **900**: `#1e3a8a` - High contrast

### Accent Medical Orange
- **50**: `#fff7ed` - Warning backgrounds
- **100**: `#ffedd5` - Light notifications
- **200**: `#fed7aa` - Badges
- **300**: `#fdba74` - Icons
- **400**: `#fb923c` - Call-to-action accents
- **500**: `#f97316` - Primary orange for highlights
- **600**: `#ea580c` - Hover states
- **700**: `#c2410c` - Dark orange
- **800**: `#9a3412` - Text
- **900**: `#7c2d12` - High contrast

### Neutral Grays
- **50**: `#fafafa` - Page backgrounds
- **100**: `#f4f4f5` - Card backgrounds
- **200**: `#e4e4e7` - Borders
- **300**: `#d4d4d8` - Separators
- **400**: `#a1a1aa` - Muted text
- **500**: `#71717a` - Secondary text
- **600**: `#52525b` - Primary text
- **700**: `#3f3f46` - Dark text
- **800**: `#27272a` - Headings
- **900**: `#18181b` - Darkest text

## 🎯 Usage Guidelines

### Primary Actions (Medical Green)
- **Use for**: Main CTAs, primary buttons, brand elements, success states
- **Examples**: "Add to Cart", "Checkout", "Submit Order", "Confirm"
- **Classes**: `btn-primary`, `bg-medical-green-500`, `text-medical-green-600`

### Secondary Actions (Medical Blue)
- **Use for**: Secondary buttons, information displays, professional trust elements
- **Examples**: "Learn More", "View Details", "Contact Support"
- **Classes**: `btn-secondary`, `bg-medical-blue-500`, `text-medical-blue-600`

### Accent Actions (Medical Orange)
- **Use for**: Highlights, warnings, call-to-action elements
- **Examples**: "Limited Time Offer", "Low Stock Alert", "Special Discount"
- **Classes**: `bg-medical-orange-500`, `text-medical-orange-600`

### Neutral Elements
- **Use for**: Body text, borders, backgrounds, secondary information
- **Examples**: Product descriptions, form labels, navigation links
- **Classes**: `text-neutral-600`, `border-neutral-200`, `bg-neutral-50`

## 🧩 Component Classes

### Button Components
```html
<!-- Primary Button -->
<button class="btn-primary">Primary Action</button>

<!-- Secondary Button -->
<button class="btn-secondary">Secondary Action</button>

<!-- Outline Button -->
<button class="btn-outline">Outline Button</button>

<!-- Danger Button -->
<button class="btn-danger">Delete</button>
```

### Card Components
```html
<!-- Basic Card -->
<div class="card card-responsive">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

<!-- Product Card -->
<div class="product-card card-responsive">
  <img src="product.jpg" alt="Product" />
  <h3>Product Name</h3>
  <span class="price-current">₹45.00</span>
  <button class="btn-primary">Add to Cart</button>
</div>

<!-- Feature Card -->
<div class="feature-card card-responsive">
  <h3>Feature Title</h3>
  <p>Feature description</p>
</div>

<!-- Stat Card -->
<div class="stat-card card-responsive">
  <h3>Total Orders</h3>
  <p class="text-3xl font-bold text-medical-green-600">1,234</p>
</div>
```

### Status Badges
```html
<!-- Success Badge -->
<span class="badge-success">Delivered</span>

<!-- Warning Badge -->
<span class="badge-warning">Processing</span>

<!-- Info Badge -->
<span class="badge-info">Confirmed</span>

<!-- Error Badge -->
<span class="badge-error">Cancelled</span>

<!-- Prescription Required -->
<span class="prescription-required">Prescription Required</span>

<!-- Stock Status -->
<span class="in-stock">In Stock (45 units)</span>
<span class="low-stock">Low Stock (3 units)</span>
<span class="out-of-stock">Out of Stock</span>
```

### Form Components
```html
<!-- Input Field -->
<input type="text" class="input w-full" placeholder="Enter text" />

<!-- Select Dropdown -->
<select class="select w-full">
  <option>Select option</option>
</select>

<!-- Textarea -->
<textarea class="input w-full h-32 resize-none" placeholder="Enter message"></textarea>
```

### Alert Components
```html
<!-- Success Alert -->
<div class="alert-success">
  <strong>Success!</strong> Your order has been placed successfully.
</div>

<!-- Info Alert -->
<div class="alert-info">
  <strong>Info:</strong> This product requires a valid prescription.
</div>

<!-- Warning Alert -->
<div class="alert-warning">
  <strong>Warning:</strong> This medication may cause drowsiness.
</div>

<!-- Error Alert -->
<div class="alert-error">
  <strong>Error:</strong> Unable to process your request.
</div>
```

### Navigation Components
```html
<!-- Navigation Bar -->
<nav class="navbar">
  <div class="container-responsive py-4">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-bold text-white">Ausadhi Sewa</h3>
      <div class="flex space-x-4">
        <a href="#" class="nav-link">Home</a>
        <a href="#" class="nav-link active">Products</a>
        <a href="#" class="nav-link">Contact</a>
      </div>
    </div>
  </div>
</nav>
```

### Table Components
```html
<!-- Data Table -->
<div class="table">
  <table class="w-full">
    <thead>
      <tr class="table-header">
        <th class="text-left p-4">Product</th>
        <th class="text-left p-4">Price</th>
        <th class="text-left p-4">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-row">
        <td class="p-4">Product Name</td>
        <td class="p-4 price-current">₹45.00</td>
        <td class="p-4">
          <span class="badge-success">Active</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## 📱 Responsive Design

### Utility Classes
```html
<!-- Responsive Container -->
<div class="container-responsive">
  <!-- Content -->
</div>

<!-- Responsive Text -->
<p class="text-responsive">This text adapts to screen size</p>

<!-- Responsive Heading -->
<h1 class="heading-responsive">Responsive Heading</h1>

<!-- Responsive Button -->
<button class="btn-primary button-responsive">Responsive Button</button>

<!-- Responsive Card -->
<div class="card card-responsive">
  <!-- Card content -->
</div>

<!-- Responsive Grid -->
<div class="grid-responsive">
  <!-- Grid items -->
</div>
```

### Breakpoint Behavior
- **Mobile (≤640px)**: 1 column, smaller text, compact spacing
- **Tablet (641px-1024px)**: 2 columns, medium text, balanced spacing
- **Desktop (1025px+)**: 3-4 columns, larger text, generous spacing

### Responsive Grid System
```html
<!-- Automatically responsive grid -->
<div class="grid-responsive">
  <div class="card card-responsive">Item 1</div>
  <div class="card card-responsive">Item 2</div>
  <div class="card card-responsive">Item 3</div>
  <div class="card card-responsive">Item 4</div>
</div>
```

## 🎨 Custom Shadows and Gradients

### Custom Shadows
```css
/* Medical Green Shadow */
.shadow-medical: 0 4px 14px rgba(34, 197, 94, 0.25)

/* Large Medical Green Shadow */
.shadow-medical-lg: 0 8px 25px rgba(34, 197, 94, 0.2)
```

### Custom Gradients
```css
/* Medical Green Gradient */
.gradient-medical: linear-gradient(135deg, #22c55e 0%, #16a34a 100%)

/* Hero Gradient */
.gradient-hero: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)

/* Sidebar Gradient */
.gradient-sidebar: linear-gradient(180deg, #15803d 0%, #166534 100%)
```

## 🌙 Dark Mode Support

The theme includes comprehensive dark mode support with appropriate color adjustments for all components. Dark mode can be enabled by adding the `dark` class to the root element.

```html
<html class="dark">
  <!-- Dark mode enabled -->
</html>
```

## 🔧 Implementation Examples

### Product Card Example
```html
<div class="product-card card-responsive">
  <div class="aspect-square bg-neutral-100 rounded-lg mb-4">
    <img src="product.jpg" alt="Product" class="w-full h-full object-cover rounded-lg" />
  </div>
  <h3 class="font-semibold text-lg mb-2">Paracetamol 500mg</h3>
  <p class="text-neutral-600 text-sm mb-3">Effective pain relief medication</p>
  <div class="flex items-center justify-between mb-3">
    <span class="price-current text-lg">₹45.00</span>
    <span class="price-original text-sm">₹60.00</span>
  </div>
  <div class="flex items-center justify-between mb-4">
    <span class="in-stock text-sm font-medium">In Stock</span>
    <span class="prescription-required">Prescription Required</span>
  </div>
  <button class="btn-primary w-full">Add to Cart</button>
</div>
```

### Form Example
```html
<div class="card card-responsive max-w-2xl">
  <h3 class="text-lg font-semibold mb-4">Contact Form</h3>
  <form class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-neutral-700 mb-2">Name</label>
      <input type="text" class="input w-full" placeholder="Enter your name" />
    </div>
    <div>
      <label class="block text-sm font-medium text-neutral-700 mb-2">Email</label>
      <input type="email" class="input w-full" placeholder="Enter your email" />
    </div>
    <div>
      <label class="block text-sm font-medium text-neutral-700 mb-2">Message</label>
      <textarea class="input w-full h-32 resize-none" placeholder="Enter your message"></textarea>
    </div>
    <button type="submit" class="btn-primary w-full">Send Message</button>
  </form>
</div>
```

### Navigation Example
```html
<nav class="navbar rounded-lg">
  <div class="container-responsive py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-8">
        <h3 class="text-xl font-bold text-white">Ausadhi Sewa</h3>
        <div class="hidden md:flex space-x-4">
          <a href="#" class="nav-link">Home</a>
          <a href="#" class="nav-link active">Products</a>
          <a href="#" class="nav-link">Categories</a>
          <a href="#" class="nav-link">Contact</a>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button class="btn-outline text-white border-white hover:bg-white hover:text-medical-green-600">
          Login
        </button>
        <button class="btn-primary">Sign Up</button>
      </div>
    </div>
  </div>
</nav>
```

## 🚀 Best Practices

### Color Usage
1. **Primary Green**: Use for main actions and brand elements
2. **Secondary Blue**: Use for informational and secondary actions
3. **Accent Orange**: Use sparingly for highlights and warnings
4. **Neutrals**: Use for text, borders, and backgrounds

### Accessibility
1. Ensure sufficient contrast ratios (minimum 4.5:1 for normal text)
2. Use semantic colors for status indicators
3. Provide focus indicators for interactive elements
4. Test with screen readers and keyboard navigation

### Performance
1. Use utility classes instead of custom CSS when possible
2. Leverage Tailwind's purge functionality to remove unused styles
3. Optimize images and use appropriate formats
4. Implement lazy loading for images and components

### Responsive Design
1. Always test on multiple screen sizes
2. Use the responsive utility classes provided
3. Ensure touch targets are at least 44px on mobile
4. Consider loading times on slower connections

## 📋 Checklist for Implementation

- [ ] Global CSS variables defined
- [ ] Tailwind theme configuration updated
- [ ] Component classes implemented
- [ ] Responsive utilities added
- [ ] Dark mode support configured
- [ ] Accessibility tested
- [ ] Cross-browser compatibility verified
- [ ] Performance optimized
- [ ] Documentation completed

## 🎯 Next Steps

1. **Component Library**: Create reusable React components using these styles
2. **Design System**: Establish design tokens and component guidelines
3. **Testing**: Implement visual regression testing
4. **Documentation**: Create Storybook or similar documentation site
5. **Optimization**: Monitor performance and optimize as needed

---

This theme provides a solid foundation for building a professional, trustworthy medical e-commerce platform that prioritizes user experience and accessibility. 