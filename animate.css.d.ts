/**
 * TypeScript definitions for animate.css
 * @version 3.7.1
 */

declare module 'animate.css' {
  const animateCSS: string;
  export = animateCSS;
}

// Global CSS class definitions
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        className?: string;
      };
    }
  }
}

// Animation class names
export type AnimationClass = 
  // Attention seekers
  | 'bounce' | 'flash' | 'pulse' | 'rubberBand' | 'shake' | 'headShake' 
  | 'swing' | 'tada' | 'wobble' | 'jello' | 'heartBeat'
  
  // Bouncing entrances
  | 'bounceIn' | 'bounceInDown' | 'bounceInLeft' | 'bounceInRight' | 'bounceInUp'
  
  // Bouncing exits
  | 'bounceOut' | 'bounceOutDown' | 'bounceOutLeft' | 'bounceOutRight' | 'bounceOutUp'
  
  // Fading entrances
  | 'fadeIn' | 'fadeInDown' | 'fadeInDownBig' | 'fadeInLeft' | 'fadeInLeftBig'
  | 'fadeInRight' | 'fadeInRightBig' | 'fadeInUp' | 'fadeInUpBig'
  
  // Fading exits
  | 'fadeOut' | 'fadeOutDown' | 'fadeOutDownBig' | 'fadeOutLeft' | 'fadeOutLeftBig'
  | 'fadeOutRight' | 'fadeOutRightBig' | 'fadeOutUp' | 'fadeOutUpBig'
  
  // Flippers
  | 'flip' | 'flipInX' | 'flipInY' | 'flipOutX' | 'flipOutY'
  
  // Lightspeed
  | 'lightSpeedIn' | 'lightSpeedOut'
  
  // Rotating entrances
  | 'rotateIn' | 'rotateInDownLeft' | 'rotateInDownRight' | 'rotateInUpLeft' | 'rotateInUpRight'
  
  // Rotating exits
  | 'rotateOut' | 'rotateOutDownLeft' | 'rotateOutDownRight' | 'rotateOutUpLeft' | 'rotateOutUpRight'
  
  // Sliding entrances
  | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight'
  
  // Sliding exits
  | 'slideOutUp' | 'slideOutDown' | 'slideOutLeft' | 'slideOutRight'
  
  // Zoom entrances
  | 'zoomIn' | 'zoomInDown' | 'zoomInLeft' | 'zoomInRight' | 'zoomInUp'
  
  // Zoom exits
  | 'zoomOut' | 'zoomOutDown' | 'zoomOutLeft' | 'zoomOutRight' | 'zoomOutUp'
  
  // Specials
  | 'hinge' | 'jackInTheBox' | 'rollIn' | 'rollOut';

// Animation modifiers
export type AnimationModifier = 
  | 'infinite' 
  | 'fast' 
  | 'faster' 
  | 'slow' 
  | 'slower'
  | 'delay-1s' 
  | 'delay-2s' 
  | 'delay-3s' 
  | 'delay-4s' 
  | 'delay-5s';

// Utility function to generate animation classes
export function getAnimationClasses(
  animation: AnimationClass,
  modifiers: AnimationModifier[] = []
): string {
  const classes = ['animated', animation];
  return classes.concat(modifiers).join(' ');
}

export {};