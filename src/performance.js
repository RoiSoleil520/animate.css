/**
 * Performance optimization utilities for Animate.css
 */

// Check if the browser supports the Web Animations API
export const supportsWebAnimations = () => 
  'animate' in document.documentElement;

// Use Intersection Observer for lazy animation loading
export class AnimateOnScroll {
  constructor(options = {}) {
    this.options = {
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0.1,
      animationClass: options.animationClass || 'animate__fadeIn',
      once: options.once !== false
    };
    
    this.observer = null;
    this.init();
  }
  
  init() {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported');
      return;
    }
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );
    
    this.observe();
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animation = element.dataset.scrollAnimation || this.options.animationClass;
        
        // Add animation classes
        element.classList.add('animate__animated', animation);
        
        // Remove from observer if only animating once
        if (this.options.once) {
          this.observer.unobserve(element);
        }
        
        // Trigger custom event
        element.dispatchEvent(new CustomEvent('animateOnScroll', {
          detail: { animation }
        }));
      }
    });
  }
  
  observe() {
    const elements = document.querySelectorAll('[data-scroll-animation]');
    elements.forEach(element => {
      this.observer.observe(element);
    });
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Optimize animations for better performance
export const optimizeAnimation = element => {
  if (!element) return;
  
  // Add GPU acceleration hints
  element.style.willChange = 'transform, opacity';
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
  
  // Clean up after animation
  element.addEventListener('animationend', () => {
    element.style.willChange = 'auto';
  }, { once: true });
};

// Batch DOM updates for better performance
export class AnimationBatcher {
  constructor() {
    this.queue = [];
    this.rafId = null;
  }
  
  add(callback) {
    this.queue.push(callback);
    
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        this.flush();
      });
    }
  }
  
  flush() {
    const queue = this.queue.slice();
    this.queue = [];
    this.rafId = null;
    
    queue.forEach(callback => callback());
  }
}

// Reduce animation intensity for users who prefer reduced motion
export const respectReducedMotion = () => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const handleChange = () => {
    const elements = document.querySelectorAll('.animate__animated');
    
    if (mediaQuery.matches) {
      elements.forEach(el => {
        el.style.animationDuration = '0.01ms';
        el.style.animationIterationCount = '1';
      });
    } else {
      elements.forEach(el => {
        el.style.animationDuration = '';
        el.style.animationIterationCount = '';
      });
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  handleChange();
};

// Performance monitoring
export const monitorAnimationPerformance = () => {
  if (!('PerformanceObserver' in window)) {
    return;
  }
  
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure' && entry.name.startsWith('animation-')) {
        console.log(`Animation ${entry.name}: ${entry.duration.toFixed(2)}ms`);
        
        // Warn if animation takes too long
        if (entry.duration > 1000) {
          console.warn(`Slow animation detected: ${entry.name}`);
        }
      }
    }
  });
  
  observer.observe({ entryTypes: ['measure'] });
  
  return observer;
};

// Initialize all performance optimizations
export const initPerformanceOptimizations = () => {
  respectReducedMotion();
  
  // Initialize scroll animations
  new AnimateOnScroll();
  
  // Monitor performance in development
  if (process.env.NODE_ENV !== 'production') {
    monitorAnimationPerformance();
  }
};

export default {
  AnimateOnScroll,
  AnimationBatcher,
  supportsWebAnimations,
  optimizeAnimation,
  respectReducedMotion,
  monitorAnimationPerformance,
  initPerformanceOptimizations
};