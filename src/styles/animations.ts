import { keyframes } from 'styled-components';

// Micro-animations
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

export const slideDown = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(-20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

export const slideLeft = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
`;

export const slideRight = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(-20px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
`;

export const scaleIn = keyframes`
  from { 
    opacity: 0; 
    transform: scale(0.8); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
`;

export const scaleOut = keyframes`
  from { 
    opacity: 0; 
    transform: scale(1.2); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
`;

export const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const pulse = keyframes`
  0%, 100% { 
    opacity: 1; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.05); 
  }
`;

export const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`;

export const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
`;

export const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

export const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(29, 185, 84, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(29, 185, 84, 0.8);
  }
`;

export const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const heartbeat = keyframes`
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
`;

// Loading animations
export const skeletonPulse = keyframes`
  0% {
    background-color: rgba(255, 255, 255, 0.1);
  }
  50% {
    background-color: rgba(255, 255, 255, 0.2);
  }
  100% {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const loadingDots = keyframes`
  0%, 80%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
`;

// Glassmorphism mixin
export const glassmorphism = (blur: string = '10px', opacity: number = 0.7) => `
  background: rgba(255, 255, 255, ${opacity});
  backdrop-filter: blur(${blur});
  -webkit-backdrop-filter: blur(${blur});
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const darkGlassmorphism = (blur: string = '10px', opacity: number = 0.7) => `
  background: rgba(0, 0, 0, ${opacity});
  backdrop-filter: blur(${blur});
  -webkit-backdrop-filter: blur(${blur});
  border: 1px solid rgba(255, 255, 255, 0.1);
`;
