import React from 'react';

/**
 * Renders the 'BTC 24/7 envíos' logo as a solid SVG.
 * This component is updated to match the new visual identity, featuring
 * solid waves and a stacked logotype. The SVG is scalable and uses `currentColor`
 * for easy styling via CSS.
 */
export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    aria-label="BTC 24/7 envíos logo"
    viewBox="0 0 160 40"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Solid wave icon. The solid effect is achieved with a thick stroke. */}
    <g
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    >
      <path d="M 3,11 Q 15,1 27,11 T 51,11" />
      <path d="M 3,20 Q 15,10 27,20 T 51,20" />
      <path d="M 3,29 Q 15,19 27,29 T 51,29" />
    </g>
    {/* Stacked logotype */}
    <text
      x="65"
      y="17"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
      fontSize="15"
      fontWeight="bold"
      fill="currentColor"
    >
      <tspan>BTC 24/7</tspan>
      <tspan x="65" dy="1.2em">envíos</tspan>
    </text>
  </svg>
);