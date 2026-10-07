'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';

export default function RSVPButton({ onClick, label = "RSVP" }) {
  const buttonRef = useRef(null);
  const textRef = useRef(null);

  // GSAP Hover Animation
  const handleMouseEnter = () => {
    gsap.to(buttonRef.current, {
      scale: 1.04,
      duration: 0.35,
      ease: 'power2.out',
    });
    gsap.to(textRef.current, {
      letterSpacing: '0.45em',
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.35,
      ease: 'power2.out',
    });
    gsap.to(textRef.current, {
      letterSpacing: '0.3em',
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  // GSAP Click Press Animation
  const handleMouseDown = () => {
    gsap.to(buttonRef.current, {
      scale: 0.97,
      duration: 0.1,
      ease: 'power2.inOut',
    });
  };

  const handleMouseUp = () => {
    gsap.to(buttonRef.current, {
      scale: 1.04,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      /* Changed fixed w-[180px] h-[56px] to dynamic px-10 py-3.5 w-max h-auto */
      className="relative inline-flex items-center justify-center px-10 py-3.5 min-w-[120px] w-max h-auto group cursor-pointer select-none focus:outline-none"
    >
      {/* Precision SVG Frame (Notched/Concave Corners) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm"
        viewBox="0 0 300 80"
        preserveAspectRatio="none"
      >
        {/* Outer Gold Border */}
        <path
          d="M 26 4 
             H 274 
             A 16 16 0 0 0 290 20 
             V 60 
             A 16 16 0 0 0 274 76 
             H 26 
             A 16 16 0 0 0 10 60 
             V 20 
             A 16 16 0 0 0 26 4 Z"
          fill="none"
          stroke="#C59B4E"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Inner Soft Powder-Blue Fill with White Margin */}
        <path
          d="M 28 8 
             H 272 
             A 13 13 0 0 0 285 21 
             V 59 
             A 13 13 0 0 0 272 72 
             H 28 
             A 13 13 0 0 0 15 59 
             V 21 
             A 13 13 0 0 0 28 8 Z"
          fill="#E2EDF7"
          stroke="#FFFFFF"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Button Label */}
      <span
        ref={textRef}
        className="relative z-10 font-serif text-[#C59B4E] text-xl sm:text-[1rem] font-medium tracking-[0.3em] pl-[0.3em] transition-colors duration-300 group-hover:text-[#B08538] whitespace-nowrap"
      >
        {label}
      </span>
    </button>
  );
}