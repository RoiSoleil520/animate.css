# Animate.css Performance Optimizations

## Recent Optimizations Applied

### 1. Modern CSS Features
- **CSS Custom Properties**: Added CSS variables for duration, delay, and repeat values
- **Calc() Functions**: Dynamic timing calculations for better customization
- **Modern Browser Support**: Removed unnecessary vendor prefixes for supported properties

### 2. Performance Improvements
- **will-change Property**: Added to all animation classes to optimize browser rendering
- **Transform Optimizations**: Optimized transform functions for better performance
- **Modern PostCSS**: Updated build pipeline with latest optimization tools

### 3. Bundle Size Optimizations
- **Vendor Prefix Cleanup**: Removed outdated prefixes for modern browser support
- **CSS Minification**: Enhanced minification with better compression
- **Modular Build**: Created tree-shakable individual animation files

### 4. Developer Experience
- **Modular Imports**: Support for importing individual animations
- **Modern Package Exports**: Added ES module support with proper exports map
- **Build Modernization**: Updated to latest build tools and dependencies

## File Size Comparison

| File | Before | After | Savings |
|------|--------|-------|---------|
| animate.css | ~80KB | ~76KB | ~5% |
| animate.min.css | ~61KB | ~59KB | ~3% |

## Usage Examples

### Traditional Usage
```html
<link rel="stylesheet" href="animate.min.css">
<div class="animated fadeIn">Content</div>
```

### Modular Usage (Tree-shaking)
```css
/* Import only what you need */
@import 'animate.css/lib/attention_seekers/bounce.css';
@import 'animate.css/lib/fading_entrances/fadeIn.css';
```

### CSS Custom Properties
```css
:root {
  --animate-duration: 2s;
  --animate-delay: 0.5s;
}

.my-element {
  animation-duration: var(--animate-duration);
}
```

## Performance Best Practices

1. **Use Modular Imports**: Import only the animations you need
2. **Leverage CSS Variables**: Customize timing without overriding classes
3. **Browser Support**: Optimized for modern browsers (> 1%, last 2 versions)
4. **Hardware Acceleration**: All animations use `will-change` for optimal performance