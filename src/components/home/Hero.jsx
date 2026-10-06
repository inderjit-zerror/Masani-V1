'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { GiClover } from "react-icons/gi";
import { RiMailOpenLine } from '@remixicon/react';


const Hero = () => {
  const container = useRef(null);
  const initialContentRef = useRef(null);
  const inviteCardRef = useRef(null);
  const openBtnRef = useRef(null);

  const topCardRef = useRef(null);
  const bottomCardRef = useRef(null);
  const thumbRef = useRef(null);
  const textRef = useRef(null);
  const phoneIconRef = useRef(null);

  const [answered, setAnswered] = useState(false);
  const [opened, setOpened] = useState(false);

  // Use refs for drag state to prevent React re-renders during 60fps animations
  const dragData = useRef({ isDragging: false, startX: 0, answered: false });
  const maxDrag = 252; // Container(320) - Thumb(56) - Padding(12)

  // 1. Initial Setup: Handled by GSAP to prevent Tailwind CSS Transform conflicts
  useGSAP(() => {
    gsap.set(inviteCardRef.current, { autoAlpha: 0, scale: 0.9, display: 'none' });

    // Set 3D transforms for envelope flaps
    gsap.set(topCardRef.current, { rotateX: -180, transformOrigin: 'bottom center', transformStyle: 'preserve-3d' });
    gsap.set(bottomCardRef.current, { rotateX: 180, transformOrigin: 'top center', transformStyle: 'preserve-3d' });

    // Centering the button precisely via GSAP instead of Tailwind's -translate-x-1/2
    gsap.set(openBtnRef.current, { autoAlpha: 0, y: 40, xPercent: -50, left: '50%', display: 'none' });

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
          gsap.to(phoneIconRef.current, { color: '#292726', duration: 0.2 });
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

  // 3. Phase 1: Slide to Answer Transition
  useGSAP(() => {
    if (answered && !opened) {
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
        .to(openBtnRef.current, {
          display: 'block',
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: 'expo.out'
        }, "-=1.0");
    }
  }, { dependencies: [answered, opened], scope: container });

  // 4. Phase 2: Open Invite Transition
  const handleOpenInvite = () => {
    setOpened(true);
    const tl = gsap.timeline();

    tl.to(openBtnRef.current, {
      autoAlpha: 0,
      y: 20,
      duration: 0.8,
      ease: 'power4.inOut',
      onComplete: () => gsap.set(openBtnRef.current, { display: 'none' })
    })
      .to('.STEMPDIV', {
        opacity: 0,
        duration: 1.2,
        ease: 'power4.inOut'
      }, "-=0.2")
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
          gsap.to('.CCENTERDIV', {
            zIndex: 50
          })
        }
      }, "<") // '<' syncs this animation precisely with the previous one
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
  };

  return (
    <div ref={container} className="w-full h-screen BgPrimery relative flex justify-center items-center overflow-hidden font-sans select-none">

      <img src="/images/Texture1.jpg" alt="DD" className='w-full h-full absolute top-0 left-0 object-cover object-center  z-1 opacity-50' />
      <img src="https://www.adinawedsakiva.com/images/flower_bg.webp" alt="DD" className='w-full h-full absolute top-0 left-0 z-2 object-cover object-center opacity-80' />

      {/* BORDER */}
      <div className='w-[150px] h-[150px] absolute top-2 left-2 z-2 object-cover object-center opacity-100 -rotate-90'>
        <img src="/images/Border-Elements.png" alt="DD" className='w-full object-cover object-center' />
      </div>
      <div className='w-[150px] h-[150px] absolute bottom-2 right-2 z-2 object-cover object-center opacity-100 rotate-90'>
        <img src="/images/Border-Elements.png" alt="DD" className='w-full object-cover object-center' />
      </div>
      <div className='w-[150px] h-[150px] absolute top-2 right-2 z-2 object-cover object-center opacity-100 '>
        <img src="/images/Border-Elements.png" alt="DD" className='w-full object-cover object-center' />
      </div>
      <div className='w-[150px] h-[150px] absolute bottom-2 left-2 z-2 object-cover object-center opacity-100 rotate-180'>
        <img src="/images/Border-Elements.png" alt="DD" className='w-full object-cover object-center' />
      </div>

      {/* --- INITIAL CALL SCREEN --- */}
      <div ref={initialContentRef} className="absolute inset-0 flex flex-col items-center justify-center py-24 z-50 b">


        <div className="flex flex-col items-center mt-12 space-y-4 px-4 text-center z-5">

          <div className="text-black  text-[4rem] leading-[4.1rem] sm:text-[6rem] sm:leading-[6.1rem]  FontPri capitalize  ">
            <h1 className="hero-text" style={{ visibility: 'hidden', opacity: 0 }}>Masani</h1>
            <h1 className="hero-text mb-5 text-[2rem] leading-[2.1rem] sm:text-[3rem] sm:leading-[3.1rem]" style={{ visibility: 'hidden', opacity: 0 }}>and</h1>
            <h1 className="hero-text" style={{ visibility: 'hidden', opacity: 0 }}>Navjot</h1>
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
            className="w-[56px] h-[56px] bg-[#f5f5f5]  rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 "
            style={{ transform: 'scale(0)' }}
          >
            <div ref={phoneIconRef} className=" TxtPri   flex items-center justify-center ">
              <GiClover className='w-6  h-6 ' />
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

        <div className="w-[150px] aspect-square absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-60  STEMPDIV">
          <img src="/images/Stemp-Img.png" alt="CENTER" className="w-full h-full  object-cover object-center" />
        </div>

        {/* TOP FLAP */}
        <div ref={topCardRef} className="w-full h-fit absolute bottom-[100%] left-0 z-30 ">
          <img src="/images/Card-Top-Part.svg" alt="TOP" className="w-full object-cover object-center" />
        </div>

        {/* CENTER BODY */}
        <div className="w-full aspect-square absolute top-0 left-0 z-10  CCENTERDIV bg-[#99BBCF]">
          {/* <img src="/images/Card-Middel-Part.svg" alt="CENTER" className="w-full h-full object-cover object-center" /> */}

          <div className="w-[95%] aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10  CCENTERDIV">
            <img src="/images/MAINCENTER.png" alt="CENTER" className="w-full h-full object-cover object-center" />
          </div>
        </div>

        {/* BOTTOM FLAP */}
        <div ref={bottomCardRef} className="w-full h-fit absolute top-[100%] left-0 z-20 ">
          <img src="/images/Card-Bottom-Part.png" alt="BOTTOM" className="w-full object-cover object-center" />
        </div>
      </div>

      {/* --- OPEN INVITE BUTTON --- */}
      <div ref={openBtnRef} className="absolute bottom-20 z-[90]" style={{ display: 'none', opacity: 0, visibility: 'hidden' }}>
        <button
          onClick={handleOpenInvite}
          className="flex items-center gap-2.5 px-6 py-3  text-[#292726] text-sm font-medium tracking-wide rounded-sm border border-[#292726] transition-all duration-200 ease-out hover:bg-[#292726] hover:text-[white] hover:shadow-lg active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <span className="uppercase">Click to Open Invite</span>
        </button>
      </div>

    </div>
  );
};

export default Hero;