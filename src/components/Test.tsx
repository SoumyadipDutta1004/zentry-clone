"use client";
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';

const Test = () => {
  const headingRef = useRef(null);
  const heroHeading = ["Gaming", "Identity", "Reality", "Agentic AI"];
  const [currentIndex, setCurrentIndex] = useState(0); // Start at index 0

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroHeading.length);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [heroHeading.length]);

  useLayoutEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const split = new SplitType(el, { types: 'chars' });

    gsap.fromTo(
      split.chars,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: true,
      }
    );

    return () => {
      split.revert();
    };
  }, [currentIndex]);

  return (
    <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center">
      <h1
        id="hero-heading"
        ref={headingRef}
        className="special-font hero-heading absolute z-50 bottom-5 right-5 text-blue-300 text-6xl font-bold"
      >
        {heroHeading[currentIndex]} {/* Access directly using currentIndex */}
      </h1>
    </div>
  );
};

export default Test;