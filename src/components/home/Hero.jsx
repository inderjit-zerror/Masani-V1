
// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import gsap from 'gsap';
// import { useGSAP } from '@gsap/react';
// // import { GiClover } from "react-icons/gi"; // Uncomment if using
// // import { RiMailOpenLine } from '@remixicon/react'; // Uncomment if using

// const Hero = () => {
//   const container = useRef(null);
//   const initialContentRef = useRef(null);
//   const inviteCardRef = useRef(null);

//   const topCardRef = useRef(null);
//   const bottomCardRef = useRef(null);
//   const thumbRef = useRef(null);
//   const textRef = useRef(null);
//   const phoneIconRef = useRef(null);

//   const [answered, setAnswered] = useState(false);
//   const [showRSVP, setShowRSVP] = useState(false);
//   const [rsvpStatus, setRsvpStatus] = useState(null); // 'accept' or 'decline' or null
//   const [guestCount, setGuestCount] = useState('');
//   const [names, setNames] = useState('');
//   const [mealPref, setMealPref] = useState('vegetarian');

//   // Use refs for drag state to prevent React re-renders during 60fps animations
//   const dragData = useRef({ isDragging: false, startX: 0, answered: false });
//   const maxDrag = 252; // Container(320) - Thumb(56) - Padding(12)

//   // 1. Initial Setup: Handled by GSAP to prevent Tailwind CSS Transform conflicts
//   useGSAP(() => {
//     gsap.set(inviteCardRef.current, { autoAlpha: 0, scale: 0.9, display: 'none' });

//     // Set 3D transforms for envelope flaps
//     gsap.set(topCardRef.current, { rotateX: -180, transformOrigin: 'bottom center', transformStyle: 'preserve-3d' });
//     gsap.set(bottomCardRef.current, { rotateX: 180, transformOrigin: 'top center', transformStyle: 'preserve-3d' });

//     // Intro Animations for Initial Call Screen
//     gsap.fromTo('.hero-text',
//       { autoAlpha: 0, y: 60 },
//       { autoAlpha: 1, y: 0, duration: 1.4, stagger: 0.2, ease: 'expo.out', delay: 0.2 }
//     );

//     gsap.fromTo('.hero-slide',
//       { autoAlpha: 0, y: 60, xPercent: -50 },
//       { autoAlpha: 1, y: 0, duration: 1.4, ease: 'expo.out', delay: 0.6 }
//     );

//     // Initial entrance animation for the slider thumb
//     gsap.to(thumbRef.current, { scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.75)', delay: 1.0 });
//   }, { scope: container });

//   // 2. Optimized Drag Logic
//   useEffect(() => {
//     if (answered) return;

//     const handleMove = (e) => {
//       if (!dragData.current.isDragging || dragData.current.answered) return;

//       const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
//       let newX = clientX - dragData.current.startX;

//       // Restrict boundaries
//       if (newX < 0) newX = 0;
//       if (newX > maxDrag) newX = maxDrag;

//       // Move thumb and fade text based on progress
//       gsap.set(thumbRef.current, { x: newX });
//       const progress = newX / maxDrag;
//       gsap.set(textRef.current, { opacity: 1 - progress });

//       // Trigger answer phase when reaching the end
//       if (newX >= maxDrag) {
//         dragData.current.isDragging = false;
//         dragData.current.answered = true;

//         // Success animation pop
//         gsap.to(thumbRef.current, {
//           scale: 0.95,
//           backgroundColor: '#99BBCF',
//           duration: 0.2,
//           yoyo: true,
//           repeat: 1,
//           onComplete: () => setAnswered(true)
//         });

//         // Turn phone icon white
//         if (phoneIconRef.current) {
//           gsap.to(phoneIconRef.current, { color: '#C9984C', duration: 0.2 });
//         }
//       }
//     };

//     const handleUp = () => {
//       if (!dragData.current.isDragging) return;
//       dragData.current.isDragging = false;

//       // Snap back if not fully dragged
//       const currentX = gsap.getProperty(thumbRef.current, "x");
//       if (currentX < maxDrag && !dragData.current.answered) {
//         gsap.to(thumbRef.current, { x: 0, duration: 0.8, ease: 'elastic.out(1, 0.6)' });
//         gsap.to(textRef.current, { opacity: 1, duration: 0.6, ease: 'expo.out' });
//       }
//     };

//     window.addEventListener('pointermove', handleMove);
//     window.addEventListener('pointerup', handleUp);
//     window.addEventListener('touchmove', handleMove, { passive: false });
//     window.addEventListener('touchend', handleUp);

//     return () => {
//       window.removeEventListener('pointermove', handleMove);
//       window.removeEventListener('pointerup', handleUp);
//       window.removeEventListener('touchmove', handleMove);
//       window.removeEventListener('touchend', handleUp);
//     };
//   }, [answered, maxDrag]);

//   const handleDown = (e) => {
//     if (answered || dragData.current.answered) return;
//     const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;

//     dragData.current.isDragging = true;
//     const currentX = gsap.getProperty(thumbRef.current, "x") || 0;
//     dragData.current.startX = clientX - currentX;

//     gsap.killTweensOf(thumbRef.current);
//     gsap.killTweensOf(textRef.current);

//     // Subtle press effect
//     gsap.to(thumbRef.current, { scale: 0.92, duration: 0.3, ease: 'expo.out' });
//   };

//   // Reset scale when drag is released but not finished
//   useEffect(() => {
//     const handleUpScale = () => {
//       if (!dragData.current.answered && !dragData.current.isDragging) {
//         gsap.to(thumbRef.current, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.6)' });
//       }
//     };
//     window.addEventListener('pointerup', handleUpScale);
//     window.addEventListener('touchend', handleUpScale);
//     return () => {
//       window.removeEventListener('pointerup', handleUpScale);
//       window.removeEventListener('touchend', handleUpScale);
//     };
//   }, []);

//   // 3. Phase 1 & 2: Slide to Answer and Open Invite Transition
//   useGSAP(() => {
//     if (answered) {
//       const tl = gsap.timeline();

//       tl.to(initialContentRef.current, {
//         autoAlpha: 0,
//         y: -60,
//         duration: 1.2,
//         ease: 'power4.inOut',
//         onComplete: () => gsap.set(initialContentRef.current, { display: 'none' })
//       })
//         .to(inviteCardRef.current, {
//           display: 'block',
//           autoAlpha: 1,
//           scale: 1,
//           duration: 1.4,
//           ease: 'expo.out'
//         }, "-=0.8")
//         .to('.STEMPDIV', {
//           opacity: 0,
//           duration: 1.2,
//           ease: 'power4.inOut'
//         }, "-=0.6")
//         .to(topCardRef.current, {
//           rotateX: 0,
//           duration: 1.6,
//           ease: 'power4.inOut'
//         }, "-=0.6")
//         .to(bottomCardRef.current, {
//           rotateX: 0,
//           duration: 1.6,
//           ease: 'power4.inOut',
//           onComplete: () => {
//             gsap.set('.CCENTERDIV', { zIndex: 50 }) // Replaced .to with .set for zIndex safety
//           }
//         }, "<") 
//         .to(inviteCardRef.current, {
//           scale: 2,
//           duration: 1.8,
//           ease: 'power4.inOut'
//         }, "AA1")
//         .to(topCardRef.current, {
//           rotateX: 180,
//           duration: 1.8,
//           ease: 'power4.inOut'
//         }, "AA1")
//         .to(bottomCardRef.current, {
//           rotateX: -180,
//           duration: 1.8,
//           ease: 'power4.inOut'
//         }, "AA1")
//         .to('.CENTER-BG', {
//           scale: 15,
//           duration: 1.8,
//           ease: 'power4.inOut',
//           force3D: true
//         }, "-=0.8");
//     }
//   }, { dependencies: [answered], scope: container });

//   return (
//     // FIXED: Removed "select-none" from this wrapper to allow form input interaction
//     <div ref={container} className="w-full h-screen BgPrimery relative flex justify-center items-center overflow-hidden font-sans">

//       <img src="/images/Texture1.jpg" alt="DD" className='w-full h-full absolute top-0 left-0 object-cover object-center z-10 opacity-25 pointer-events-none' />

//       {/* BORDER */}
//       <div className='w-[150px] h-[150px] absolute top-2 left-2 z-[999] object-cover object-center opacity-100 -rotate-90 pointer-events-none'>
//         <img src="/images/Border-Elements.png" alt="DD" className='w-full object-cover object-center' />
//       </div>
//       <div className='w-[150px] h-[150px] absolute bottom-2 right-2 z-[999] object-cover object-center opacity-100 rotate-90 pointer-events-none'>
//         <img src="/images/Border-Elements.png" alt="DD" className='w-full object-cover object-center' />
//       </div>
//       <div className='w-[150px] h-[150px] absolute top-2 right-2 z-[999] object-cover object-center opacity-100 pointer-events-none'>
//         <img src="/images/Border-Elements.png" alt="DD" className='w-full object-cover object-center' />
//       </div>
//       <div className='w-[150px] h-[150px] absolute bottom-2 left-2 z-[999] object-cover object-center opacity-100 rotate-180 pointer-events-none'>
//         <img src="/images/Border-Elements.png" alt="DD" className='w-full object-cover object-center' />
//       </div>

//       {/* --- INITIAL CALL SCREEN --- */}
//       <div ref={initialContentRef} className="absolute inset-0 flex flex-col items-center justify-center py-24 z-50 select-none">
//         <div className="flex flex-col items-center mt-12 space-y-4 px-4 text-center z-5">
//           <div className="text-[#7c9caf] text-[4rem] leading-[4.1rem] sm:text-[6rem] sm:leading-[6.1rem] FontPri capitalize">
//             <h1 className="hero-text tracking-tighter" style={{ visibility: 'hidden', opacity: 0 }}>Masani</h1>
//             <h1 className="hero-text tracking-tighter text-[2rem] leading-[2.1rem] sm:text-[3rem] sm:leading-[3.1rem]" style={{ visibility: 'hidden', opacity: 0 }}>and</h1>
//             <h1 className="hero-text tracking-tighter" style={{ visibility: 'hidden', opacity: 0 }}>Navjot</h1>
//           </div>
//         </div>

//         {/* Clean Apple-style Slide Component */}
//         <div
//           className="hero-slide mb-12 w-[320px] h-[68px] mt-15 BgSec rounded-full absolute bottom-8 left-1/2 overflow-hidden flex items-center p-1.5 z-5"
//           style={{ touchAction: 'none', visibility: 'hidden', opacity: 0 }}
//         >
//           {/* Text */}
//           <div ref={textRef} className="absolute inset-0 flex items-center justify-center pointer-events-none pl-12">
//             <span className="text-white/90 text-[17px] font-normal tracking-tight uppercase">
//               slide to See Invite
//             </span>
//           </div>

//           {/* Draggable Thumb */}
//           <div
//             ref={thumbRef}
//             onPointerDown={handleDown}
//             onTouchStart={handleDown}
//             className="w-[56px] h-[56px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
//             style={{ transform: 'scale(0)' }}
//           >
//             <div ref={phoneIconRef} className="TxtPri flex items-center justify-center pointer-events-none">
//               <img src="/images/Stemp-Img.png" alt="IMG" className="w-full h-full object-cover object-center scale-[1.7]" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- INVITE CARD WRAPPER --- */}
//       <div
//         ref={inviteCardRef}
//         className="relative w-[85vw] sm:w-[350px] aspect-square [perspective:1200px] group z-40"
//         style={{ display: 'none', opacity: 0, visibility: 'hidden' }}
//       >
//         {/* FIXED: Added pointer-events-none to prevent the invisible stamp layer from blocking clicks */}
//         <div className="w-[150px] aspect-square absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-60 pointer-events-none STEMPDIV">
//           <img src="/images/Stemp-Img.png" alt="CENTER" className="w-full h-full object-cover object-center" />
//         </div>

//         {/* TOP FLAP - FIXED: added pointer-events-none */}
//         <div ref={topCardRef} className="w-full h-fit absolute bottom-[100%] left-0 z-30 pointer-events-none">
//           <img src="/images/Card-Top-Part.svg" alt="TOP" className="w-full object-cover object-center" />
//         </div>

//         {/* CENTER BODY */}
//         <div className="w-full aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 CCENTERDIV CENTERBODY pointer-events-auto">
//           {/* Expanding Background */}
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#99BBCF] CENTER-BG pointer-events-none" style={{ willChange: 'transform' }}></div>

//           {/* MAINDETAILS */}
//           <div className="w-full sm:w-[350px] aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 CCENTERDIV bg-[#ffffff] rounded-3xl border-[10px] sm:border-[14px] border-[#99BBCF] flex flex-col items-center justify-center overflow-hidden shadow-inner pointer-events-auto">

//             {/* Inner Borders */}
//             <div className="absolute inset-[6px] sm:inset-[8px] border-[1px] border-gray-400/50 pointer-events-none rounded-[1.25rem]"></div>
//             <div className="absolute inset-[10px] sm:inset-[12px] border-[1px] border-gray-400/50 pointer-events-none rounded-xl"></div>

//             {/* Corner Elements */}
//             <div className="absolute top-[3%] left-[0%] w-13 sm:w-13 -rotate-90 pointer-events-none opacity-100 bg-white">
//               <img src="/images/Border-Elements.png" alt="border" className="w-full h-full object-contain" />
//             </div>
//             <div className="absolute top-1.5 right-1.5 w-13 sm:w-13 pointer-events-none opacity-100 bg-white">
//               <img src="/images/Border-Elements.png" alt="border" className="w-full h-full object-contain" />
//             </div>
//             <div className="absolute bottom-1.5 left-1.5 w-13 sm:w-13 rotate-180 pointer-events-none opacity-100 bg-white">
//               <img src="/images/Border-Elements.png" alt="border" className="w-full h-full object-contain" />
//             </div>
//             <div className="absolute bottom-[3%] right-[0%] w-13 sm:w-13 rotate-90 pointer-events-none opacity-100 bg-white">
//               <img src="/images/Border-Elements.png" alt="border" className="w-full h-full object-contain" />
//             </div>

//             {/* Content */}
//             <div className="relative z-50 flex flex-col items-center text-center w-full px-2 scale-[0.65] sm:scale-[0.8] origin-center mt-2">
//               {!showRSVP ? (
//                 <>
//                   <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 opacity-90">
//                     <img src="/images/Stemp-Img.png" alt="Stamp" className="w-full h-full object-contain" />
//                   </div>

//                   <h2 className="text-gray-500 text-[10px] sm:text-xs tracking-tighter uppercase font-medium">Frances and Zal</h2>

//                   <p className="text-gray-500 text-[9px] sm:text-[10px] leading-[12px] tracking-widest uppercase mt-2.5 sm:mt-1 font-light">
//                     Would be delighted if you would join them<br />for the Navjote Ceremony of their son
//                   </p>

//                   <h1 className="text-[#C9984C] text-2xl mt-1 mb-1 tracking-tighter uppercase FontPri whitespace-nowrap">
//                     Walker Zal Masani
//                   </h1>

//                   <p className="text-[#7c9caf] text-[10px] sm:text-[11px] leading-[14px] tracking-widest uppercase font-medium">
//                     Wednesday, 30 December 2026<br />At 5 O'clock in the evening
//                   </p>

//                   <div className="w-12 h-[1px] bg-[#7c9caf] my-2 sm:my-2 opacity-70"></div>

//                   <p className="text-gray-500 text-[9px] sm:text-[10px] leading-[11px] tracking-tight uppercase font-light">
//                     Seth Jeejeebhoy Dadabhoy Agiary<br />Pilot Bunder Road, Colaba Mumbai, India
//                   </p>

//                   <p className="text-gray-500 text-[10px] sm:text-[11px] tracking-widest uppercase mt-4 sm:mt-2 font-medium">
//                     Dinner and dancing to follow
//                   </p>

//                   <button
//                     onClick={() => setShowRSVP(true)}
//                     className="mt-3 px-6 py-2 bg-[#99BBCF] text-white rounded-full text-[10px] tracking-widest uppercase hover:bg-[#7c9caf] transition-colors shadow-sm cursor-pointer relative z-50"
//                   >
//                     RSVP
//                   </button>

//                   <div className="mt-4 sm:mt-2 text-[8px] sm:text-[9px] text-gray-400 tracking-tight">
//                     <p>For Further Information and Queries:</p>
//                     <p className="lowercase translate-y-[-30%]">masaninavjote@gmail.com</p>
//                   </div>
//                 </>
//               ) : (
//                 <div className="w-full flex flex-col items-center mt-2">
//                   <h2 className="text-gray-500 text-[10px] sm:text-[11px] leading-[14px] tracking-widest uppercase font-medium mb-1">
//                     The favour of your reply is requested by<br />00 | 00 | 0000
//                   </h2>
//                   <p className="text-gray-500 text-[8px] sm:text-[9px] tracking-widest uppercase font-light mb-4">
//                     Kindly reply online at masaninavjote.com<br />or return this card by post.
//                   </p>

//                   <div className="w-full max-w-[260px] flex flex-col gap-3 text-[9px] sm:text-[10px] text-gray-500 tracking-wider text-left">
//                     <div className="flex items-center gap-2 border-b border-gray-300 pb-1">
//                       <span className="uppercase whitespace-nowrap">Names:</span>
//                       <input type="text" value={names} onChange={(e) => setNames(e.target.value)} className="bg-transparent outline-none flex-1 text-gray-700" />
//                     </div>

//                     <div className="flex flex-col gap-2 mt-2 ml-2">
//                       <label className="flex items-center gap-2 cursor-pointer uppercase">
//                         <input
//                           type="checkbox"
//                           checked={rsvpStatus === 'accept'}
//                           onChange={() => setRsvpStatus('accept')}
//                           className="w-3 h-3 appearance-none border border-gray-400 checked:bg-[#99BBCF] relative flex items-center justify-center before:content-['✓'] before:absolute before:text-white before:text-[10px] before:opacity-0 checked:before:opacity-100 transition-colors"
//                         />
//                         Delighted to accept
//                       </label>
//                       <label className="flex items-center gap-2 cursor-pointer uppercase">
//                         <input
//                           type="checkbox"
//                           checked={rsvpStatus === 'decline'}
//                           onChange={() => setRsvpStatus('decline')}
//                           className="w-3 h-3 appearance-none border border-gray-400 checked:bg-[#99BBCF] relative flex items-center justify-center before:content-['✓'] before:absolute before:text-white before:text-[10px] before:opacity-0 checked:before:opacity-100 transition-colors"
//                         />
//                         Regretfully unable to attend
//                       </label>
//                     </div>

//                     {rsvpStatus === 'accept' && (
//                       <div className="animate-in fade-in slide-in-from-top-2 duration-300">
//                         <div className="flex items-center gap-2 border-b border-gray-300 pb-1 mt-1">
//                           <span className="uppercase whitespace-nowrap">Number Attending:</span>
//                           <input type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="bg-transparent outline-none w-12 text-center text-gray-700" min="1" />
//                         </div>

//                         <div className="mt-3 text-center border-t border-b border-gray-300 py-2">
//                           <p className="uppercase mb-2 text-[#7c9caf]">Meal Preference</p>
//                           <div className="flex justify-center gap-4 text-[8px]">
//                             <label className="flex items-center gap-1.5 cursor-pointer uppercase">
//                               <input
//                                 type="radio"
//                                 name="meal"
//                                 value="vegetarian"
//                                 checked={mealPref === 'vegetarian'}
//                                 onChange={(e) => setMealPref(e.target.value)}
//                                 className="accent-[#99BBCF]"
//                               />
//                               Vegetarian
//                             </label>
//                             <label className="flex items-center gap-1.5 cursor-pointer uppercase">
//                               <input
//                                 type="radio"
//                                 name="meal"
//                                 value="non-vegetarian"
//                                 checked={mealPref === 'non-vegetarian'}
//                                 onChange={(e) => setMealPref(e.target.value)}
//                                 className="accent-[#99BBCF]"
//                               />
//                               Non-Vegetarian
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     <div className="flex justify-center mt-3 gap-3">
//                       <button
//                         onClick={() => setShowRSVP(false)}
//                         className="px-5 py-1.5 border border-[#99BBCF] text-[#7c9caf] rounded-full text-[9px] uppercase hover:bg-gray-50 transition-colors cursor-pointer"
//                       >
//                         Back
//                       </button>
//                       <button
//                         onClick={() => { alert('RSVP Submitted!'); setShowRSVP(false); setRsvpStatus(null); setNames(''); setGuestCount(''); }}
//                         className="px-5 py-1.5 bg-[#99BBCF] text-white rounded-full text-[9px] uppercase hover:bg-[#7c9caf] transition-colors cursor-pointer"
//                       >
//                         Submit
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* BOTTOM FLAP - FIXED: added pointer-events-none */}
//         <div ref={bottomCardRef} className="w-full h-fit absolute top-[100%] left-0 z-20 pointer-events-none">
//           <img src="/images/Card-Bottom-Part.png" alt="BOTTOM" className="w-full object-cover object-center" />
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Hero;


'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import RSVPButton from '../common/RSVPButton';


const Hero = () => {
  const container = useRef(null);
  const initialContentRef = useRef(null);
  const inviteCardRef = useRef(null);

  const topCardRef = useRef(null);
  const bottomCardRef = useRef(null);
  const thumbRef = useRef(null);
  const textRef = useRef(null);
  const phoneIconRef = useRef(null);

  const [answered, setAnswered] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState(null); // 'accept' or 'decline' or null
  const [guestCount, setGuestCount] = useState('');
  const [names, setNames] = useState('');
  const [mealPref, setMealPref] = useState('vegetarian');

  // Use refs for drag state to prevent React re-renders during 60fps animations
  const dragData = useRef({ isDragging: false, startX: 0, answered: false });
  const maxDrag = 252; // Container(320) - Thumb(56) - Padding(12)

  // 1. Initial Setup: Handled by GSAP to prevent Tailwind CSS Transform conflicts
  useGSAP(() => {
    gsap.set(inviteCardRef.current, { autoAlpha: 0, scale: 0.9, display: 'none' });

    // Set 3D transforms for envelope flaps
    gsap.set(topCardRef.current, { rotateX: -180, transformOrigin: 'bottom center', transformStyle: 'preserve-3d' });
    gsap.set(bottomCardRef.current, { rotateX: 180, transformOrigin: 'top center', transformStyle: 'preserve-3d' });

    // Intro Animations for Initial Call Screen
    gsap.fromTo('.hero-text',
      { autoAlpha: 0, y: 60 },
      { autoAlpha: 1, y: 0, duration: 1.4, stagger: 0.2, ease: 'expo.out', delay: 0.2 }
    );

    gsap.fromTo('.hero-slide',
      { autoAlpha: 0, y: 60, xPercent: -50 },
      { autoAlpha: 1, y: 0, duration: 1.4, ease: 'expo.out', delay: 0.6 }
    );

    // Initial entrance animation for the slider thumb
    gsap.to(thumbRef.current, { scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.75)', delay: 1.0 });
  }, { scope: container });

  // 2. Optimized Drag Logic
  useEffect(() => {
    if (answered) return;

    const handleMove = (e) => {
      if (!dragData.current.isDragging || dragData.current.answered) return;

      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      let newX = clientX - dragData.current.startX;

      // Restrict boundaries
      if (newX < 0) newX = 0;
      if (newX > maxDrag) newX = maxDrag;

      // Move thumb and fade text based on progress
      gsap.set(thumbRef.current, { x: newX });
      const progress = newX / maxDrag;
      gsap.set(textRef.current, { opacity: 1 - progress });

      // Trigger answer phase when reaching the end
      if (newX >= maxDrag) {
        dragData.current.isDragging = false;
        dragData.current.answered = true;

        // Success animation pop
        gsap.to(thumbRef.current, {
          scale: 0.95,
          backgroundColor: '#99BBCF',
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          onComplete: () => setAnswered(true)
        });

        // Turn phone icon white
        if (phoneIconRef.current) {
          gsap.to(phoneIconRef.current, { color: '#C9984C', duration: 0.2 });
        }
      }
    };

    const handleUp = () => {
      if (!dragData.current.isDragging) return;
      dragData.current.isDragging = false;

      // Snap back if not fully dragged
      const currentX = gsap.getProperty(thumbRef.current, "x");
      if (currentX < maxDrag && !dragData.current.answered) {
        gsap.to(thumbRef.current, { x: 0, duration: 0.8, ease: 'elastic.out(1, 0.6)' });
        gsap.to(textRef.current, { opacity: 1, duration: 0.6, ease: 'expo.out' });
      }
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [answered, maxDrag]);

  const handleDown = (e) => {
    if (answered || dragData.current.answered) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;

    dragData.current.isDragging = true;
    const currentX = gsap.getProperty(thumbRef.current, "x") || 0;
    dragData.current.startX = clientX - currentX;

    gsap.killTweensOf(thumbRef.current);
    gsap.killTweensOf(textRef.current);

    // Subtle press effect
    gsap.to(thumbRef.current, { scale: 0.92, duration: 0.3, ease: 'expo.out' });
  };

  // Reset scale when drag is released but not finished
  useEffect(() => {
    const handleUpScale = () => {
      if (!dragData.current.answered && !dragData.current.isDragging) {
        gsap.to(thumbRef.current, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.6)' });
      }
    };
    window.addEventListener('pointerup', handleUpScale);
    window.addEventListener('touchend', handleUpScale);
    return () => {
      window.removeEventListener('pointerup', handleUpScale);
      window.removeEventListener('touchend', handleUpScale);
    };
  }, []);

  // 3. Phase 1 & 2: Slide to Answer and Open Invite Transition
  useGSAP(() => {
    if (answered) {
      const tl = gsap.timeline();

      tl.to(initialContentRef.current, {
        autoAlpha: 0,
        y: -60,
        duration: 1.2,
        ease: 'power4.inOut',
        onComplete: () => gsap.set(initialContentRef.current, { display: 'none' })
      })
        .to(inviteCardRef.current, {
          display: 'block',
          autoAlpha: 1,
          scale: 1,
          duration: 1.4,
          ease: 'expo.out'
        }, "-=0.8")
        .to('.STEMPDIV', {
          opacity: 0,
          duration: 1.2,
          ease: 'power4.inOut'
        }, "-=0.6")
        .to(topCardRef.current, {
          rotateX: 0,
          duration: 1.6,
          ease: 'power4.inOut'
        }, "-=0.6")
        .to(bottomCardRef.current, {
          rotateX: 0,
          duration: 1.6,
          ease: 'power4.inOut',
          onComplete: () => {
            gsap.set('.CCENTERDIV', { zIndex: 50 });
          }
        }, "<")
        .to(inviteCardRef.current, {
          scale: 2,
          duration: 1.8,
          ease: 'power4.inOut'
        }, "AA1")
        .to(topCardRef.current, {
          rotateX: 180,
          duration: 1.8,
          ease: 'power4.inOut'
        }, "AA1")
        .to(bottomCardRef.current, {
          rotateX: -180,
          duration: 1.8,
          ease: 'power4.inOut'
        }, "AA1")
        .to('.CENTER-BG', {
          scale: 15,
          duration: 1.8,
          ease: 'power4.inOut',
          force3D: true
        }, "-=0.8");
    }
  }, { dependencies: [answered], scope: container });



  return (
    <div ref={container} className="w-full h-screen BgPrimery relative flex justify-center items-center overflow-hidden font-sans">

      <img src="/images/Texture1.jpg" alt="DD" className='w-full h-full absolute top-0 left-0 object-cover object-center z-10 opacity-25 pointer-events-none' />

      {/* BORDER */}
      <div className='w-[150px] h-[150px] absolute top-2 left-2 z-[999] object-cover object-center opacity-100 -rotate-90 pointer-events-none'>
        <img src="/images/Border-Elements.png" alt="DD" className='w-full object-cover object-center' />
      </div>
      <div className='w-[150px] h-[150px] absolute bottom-2 right-2 z-[999] object-cover object-center opacity-100 rotate-90 pointer-events-none'>
        <img src="/images/Border-Elements.png" alt="DD" className='w-full object-cover object-center' />
      </div>
      <div className='w-[150px] h-[150px] absolute top-2 right-2 z-[999] object-cover object-center opacity-100 pointer-events-none'>
        <img src="/images/Border-Elements.png" alt="DD" className='w-full object-cover object-center' />
      </div>
      <div className='w-[150px] h-[150px] absolute bottom-2 left-2 z-[999] object-cover object-center opacity-100 rotate-180 pointer-events-none'>
        <img src="/images/Border-Elements.png" alt="DD" className='w-full object-cover object-center' />
      </div>

      {/* --- INITIAL CALL SCREEN --- */}
      <div ref={initialContentRef} className="absolute inset-0 flex flex-col items-center justify-center py-24 z-50 select-none">
        <div className="flex flex-col items-center mt-12 space-y-4 px-4 text-center z-5">
          <div className="text-[#7c9caf] text-[4rem] leading-[4.1rem] sm:text-[6rem] sm:leading-[6.1rem] FontPri capitalize">
            <h1 className="hero-text tracking-tighter" style={{ visibility: 'hidden', opacity: 0 }}>Masani</h1>
            <h1 className="hero-text tracking-tighter text-[2rem] leading-[2.1rem] sm:text-[3rem] sm:leading-[3.1rem]" style={{ visibility: 'hidden', opacity: 0 }}>and</h1>
            <h1 className="hero-text tracking-tighter" style={{ visibility: 'hidden', opacity: 0 }}>Navjot</h1>
          </div>
        </div>

        {/* Clean Apple-style Slide Component */}
        <div
          className="hero-slide mb-12 w-[320px] h-[68px] mt-15 BgSec rounded-full absolute bottom-8 left-1/2 overflow-hidden flex items-center p-1.5 z-5"
          style={{ touchAction: 'none', visibility: 'hidden', opacity: 0 }}
        >
          {/* Text */}
          <div ref={textRef} className="absolute inset-0 flex items-center justify-center pointer-events-none pl-12">
            <span className="text-white/90 text-[17px] font-normal tracking-tight uppercase">
              slide to See Invite
            </span>
          </div>

          {/* Draggable Thumb */}
          <div
            ref={thumbRef}
            onPointerDown={handleDown}
            onTouchStart={handleDown}
            className="w-[56px] h-[56px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
            style={{ transform: 'scale(0)' }}
          >
            <div ref={phoneIconRef} className="TxtPri flex items-center justify-center pointer-events-none">
              <img src="/images/Stemp-Img.png" alt="IMG" className="w-full h-full object-cover object-center scale-[1.7]" />
            </div>
          </div>
        </div>
      </div>

      {/* --- INVITE CARD WRAPPER --- */}
      <div
        ref={inviteCardRef}
        className="relative w-[85vw] sm:w-[350px] aspect-square [perspective:1200px] group z-40"
        style={{ display: 'none', opacity: 0, visibility: 'hidden' }}
      >
        <div className="w-[150px] aspect-square absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-60 pointer-events-none STEMPDIV">
          <img src="/images/Stemp-Img.png" alt="CENTER" className="w-full h-full object-cover object-center" />
        </div>

        {/* TOP FLAP */}
        <div ref={topCardRef} className="w-full h-fit absolute bottom-[100%] left-0 z-30 pointer-events-none">
          <img src="/images/Card-Top-Part.svg" alt="TOP" className="w-full object-cover object-center" />
        </div>

        {/* CENTER BODY */}
        <div className="w-full aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 CCENTERDIV CENTERBODY pointer-events-auto">
          {/* Expanding Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#99BBCF] CENTER-BG pointer-events-none" style={{ willChange: 'transform' }}></div>

          {/* MAINDETAILS */}
          <div className="w-full sm:w-[200px] scale-[0.8] h-[40vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 CCENTERDIV bg-[#ffffff]   flex flex-col items-center justify-center overflow-hidden shadow-inner pointer-events-auto">
            {/* Inner Borders */}
            <div className="absolute inset-[6px] sm:inset-[8px] border-[1px] border-gray-400/50 pointer-events-none rounded-[1.25rem]"></div>
            <div className="absolute inset-[10px] sm:inset-[12px] border-[1px] border-gray-400/50 pointer-events-none rounded-xl"></div>

            {/* LEFTTOP */}
            <div className="absolute top-[-0.2%] left-[-0.5%] w-5 sm:w-fit   pointer-events-none opacity-100  ">
              <img src="/images/END.svg" alt="border" className="w-full h-full object-contain" />
            </div>
            {/* LEFT LINE */}
            <div className='w-[1px] h-[94%] bg-black absolute top-[3%] left-0 z-99'></div>

            {/* LEFTBOTTOM */}
            <div className="absolute  bottom-[-0.15%] left-[-0.5%] w-5 sm:w-fit  -rotate-90   pointer-events-none opacity-100  ">
              <img src="/images/END.svg" alt="border" className="w-full h-full object-contain" />
            </div>

            {/* Corner Elements */}

            <div className="absolute top-[3%] left-[0%] w-13 sm:w-13 -rotate-90 pointer-events-none opacity-100 bg-white">
              <img src="/images/Border-Elements.png" alt="border" className="w-full h-full object-contain" />
            </div>
            <div className="absolute top-1.5 right-1.5 w-13 sm:w-13 pointer-events-none opacity-100 bg-white">
              <img src="/images/Border-Elements.png" alt="border" className="w-full h-full object-contain" />
            </div>
            <div className="absolute bottom-1.5 left-1.5 w-13 sm:w-13 rotate-180 pointer-events-none opacity-100 bg-white">
              <img src="/images/Border-Elements.png" alt="border" className="w-full h-full object-contain" />
            </div>
            <div className="absolute bottom-[3%] right-[0%] w-13 sm:w-13 rotate-90 pointer-events-none opacity-100 bg-white">
              <img src="/images/Border-Elements.png" alt="border" className="w-full h-full object-contain" />
            </div>

            {/* Content */}
            <div className="relative z-50  flex flex-col items-center text-center w-full px-2 scale-[0.65] sm:scale-[0.8] origin-center mt-2">
              {!showRSVP ? (
                <>
                  {/* <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 opacity-90">
                    <img src="/images/Stemp-Img.png" alt="Stamp" className="w-full h-full object-contain" />
                  </div> */}

                  {/* <h2 className="text-gray-500 text-[10px] sm:text-xs tracking-tighter uppercase font-medium">Frances and Zal</h2> */}

                  {/* <p className="text-gray-500 text-[9px] sm:text-[10px] leading-[12px] tracking-widest uppercase mt-2.5 sm:mt-1 font-light">
                    Would be delighted if you would join them<br />for the Navjote Ceremony of their son
                  </p> */}

                  {/* <h1 className="text-[#C9984C] text-2xl mt-1 mb-1 tracking-tighter uppercase FontPri whitespace-nowrap">
                    Walker Zal Masani
                  </h1> */}

                  {/* <p className="text-[#7c9caf] text-[10px] sm:text-[11px] leading-[14px] tracking-widest uppercase font-medium">
                    Wednesday, 30 December 2026<br />At 5 O'clock in the evening
                  </p> */}

                  {/* <div className="w-12 h-[1px] bg-[#7c9caf] my-2 sm:my-2 opacity-70"></div> */}

                  {/* <p className="text-gray-500 text-[9px] sm:text-[10px] leading-[11px] tracking-tight uppercase font-light">
                    Seth Jeejeebhoy Dadabhoy Agiary<br />Pilot Bunder Road, Colaba Mumbai, India
                  </p> */}

                  {/* <p className="text-gray-500 text-[10px] sm:text-[11px] tracking-widest uppercase mt-4 sm:mt-2 font-medium">
                    Dinner and dancing to follow
                  </p> */}

                  {/* CUSTOM GSAP RSVP BUTTON */}
                  <div className="mt-2 scale-[0.65] sm:scale-[0.75]">
                    <RSVPButton onClick={() => setShowRSVP(true)} />
                  </div>

                  {/* <div className="mt-2 text-[8px] sm:text-[9px] text-gray-400 tracking-tight">
                    <p>For Further Information and Queries:</p>
                    <p className="lowercase translate-y-[-30%]">masaninavjote@gmail.com</p>
                  </div> */}
                </>
              ) : (
                <div className="w-full flex flex-col items-center mt-2">
                  <h2 className="text-gray-500 text-[10px] sm:text-[11px] leading-[14px] tracking-widest uppercase font-medium mb-1">
                    The favour of your reply is requested by<br />00 | 00 | 0000
                  </h2>
                  <p className="text-gray-500 text-[8px] sm:text-[9px] tracking-widest uppercase font-light mb-4">
                    Kindly reply online at masaninavjote.com<br />or return this card by post.
                  </p>

                  <div className="w-full max-w-[260px] flex flex-col gap-3 text-[9px] sm:text-[10px] text-gray-500 tracking-wider text-left">
                    <div className="flex items-center gap-2 border-b border-gray-300 pb-1">
                      <span className="uppercase whitespace-nowrap">Names:</span>
                      <input type="text" value={names} onChange={(e) => setNames(e.target.value)} className="bg-transparent outline-none flex-1 text-gray-700" />
                    </div>

                    <div className="flex flex-col gap-2 mt-2 ml-2">
                      <label className="flex items-center gap-2 cursor-pointer uppercase">
                        <input
                          type="checkbox"
                          checked={rsvpStatus === 'accept'}
                          onChange={() => setRsvpStatus('accept')}
                          className="w-3 h-3 appearance-none border border-gray-400 checked:bg-[#99BBCF] relative flex items-center justify-center before:content-['✓'] before:absolute before:text-white before:text-[10px] before:opacity-0 checked:before:opacity-100 transition-colors"
                        />
                        Delighted to accept
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer uppercase">
                        <input
                          type="checkbox"
                          checked={rsvpStatus === 'decline'}
                          onChange={() => setRsvpStatus('decline')}
                          className="w-3 h-3 appearance-none border border-gray-400 checked:bg-[#99BBCF] relative flex items-center justify-center before:content-['✓'] before:absolute before:text-white before:text-[10px] before:opacity-0 checked:before:opacity-100 transition-colors"
                        />
                        Regretfully unable to attend
                      </label>
                    </div>

                    {rsvpStatus === 'accept' && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2 border-b border-gray-300 pb-1 mt-1">
                          <span className="uppercase whitespace-nowrap">Number Attending:</span>
                          <input type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="bg-transparent outline-none w-12 text-center text-gray-700" min="1" />
                        </div>

                        <div className="mt-3 text-center border-t border-b border-gray-300 py-2">
                          <p className="uppercase mb-2 text-[#7c9caf]">Meal Preference</p>
                          <div className="flex justify-center gap-4 text-[8px]">
                            <label className="flex items-center gap-1.5 cursor-pointer uppercase">
                              <input
                                type="radio"
                                name="meal"
                                value="vegetarian"
                                checked={mealPref === 'vegetarian'}
                                onChange={(e) => setMealPref(e.target.value)}
                                className="accent-[#99BBCF]"
                              />
                              Vegetarian
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer uppercase">
                              <input
                                type="radio"
                                name="meal"
                                value="non-vegetarian"
                                checked={mealPref === 'non-vegetarian'}
                                onChange={(e) => setMealPref(e.target.value)}
                                className="accent-[#99BBCF]"
                              />
                              Non-Vegetarian
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center mt-3 gap-3">
                      <button
                        onClick={() => setShowRSVP(false)}
                        className="px-5 py-1.5 border border-[#99BBCF] text-[#7c9caf] rounded-full text-[9px] uppercase hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => { alert('RSVP Submitted!'); setShowRSVP(false); setRsvpStatus(null); setNames(''); setGuestCount(''); }}
                        className="px-5 py-1.5 bg-[#99BBCF] text-white rounded-full text-[9px] uppercase hover:bg-[#7c9caf] transition-colors cursor-pointer"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM FLAP */}
        <div ref={bottomCardRef} className="w-full h-fit absolute top-[100%] left-0 z-20 pointer-events-none">
          <img src="/images/Card-Bottom-Part.png" alt="BOTTOM" className="w-full object-cover object-center" />
        </div>
      </div>

    </div>
  );
};

export default Hero;