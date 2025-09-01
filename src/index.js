// Animate.css module entry point
import '../animate.css';

// Export utility functions for programmatic animation control
export const animateCSS = (element, animation, prefix = 'animate__') => 
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = typeof element === 'string' 
      ? document.querySelector(element) 
      : element;

    if (!node) {
      reject(new Error('Element not found'));
      return;
    }

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, clean up classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  });

// Utility to add animation with custom duration
export const animateWithDuration = (element, animation, duration = '1s') => {
  const node = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;
    
  if (node) {
    node.style.setProperty('--animate-duration', duration);
    return animateCSS(node, animation);
  }
  return Promise.reject(new Error('Element not found'));
};

// Utility to chain animations
export const chainAnimations = async (element, animations = [], delay = 0) => {
  for (const animation of animations) {
    await animateCSS(element, animation);
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Auto-initialize animations on elements with data-animate attribute
export const autoInit = () => {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  animatedElements.forEach(element => {
    const animation = element.dataset.animate;
    const delay = element.dataset.animateDelay || 0;
    const duration = element.dataset.animateDuration;
    
    if (delay) {
      setTimeout(() => {
        if (duration) {
          animateWithDuration(element, animation, duration);
        } else {
          animateCSS(element, animation);
        }
      }, parseInt(delay));
    } else {
      if (duration) {
        animateWithDuration(element, animation, duration);
      } else {
        animateCSS(element, animation);
      }
    }
  });
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}

// Export for use as a module
export default {
  animateCSS,
  animateWithDuration,
  chainAnimations,
  autoInit
};