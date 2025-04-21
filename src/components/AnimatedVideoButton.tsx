"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ReactNode, useEffect, useRef } from "react";
import { useState } from "react";


export default function AnimatedVideoButton({
  children,
  onClick,
}: {
  children: ReactNode,
  onClick?: () => void,
}) {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const [isMouseOnBox, setIsMouseOnBox] = useState(false);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  // Calculate the mouse position and the box rotation values
  useEffect(() => {
    setCenter({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    function handleMouseMove(e: MouseEvent) {
      setMousePosition({
        x: e.clientX - center.x,
        y: e.clientY - center.y
      });
      setRotation({
        x: (mousePosition.x / center.x) * 30,
        y: (mousePosition.y) / center.y * -30
      });
    }

    function handleMouseEnterWindow() {
      setIsMouseEnter(true);
    };
    function handleMouseLeaveWindow() {
      setIsMouseEnter(false);
    };

    // Set isMouseMoving to true
    setIsMouseMoving(true);

    // Reset timer
    clearTimeout(timeoutRef.current!);
    // Reset the isMouseMoving if the mouse is stop moving
    timeoutRef.current = setTimeout(() => {
      setIsMouseMoving(false);
    }, 1000); // 1s after mouse stops

    document.addEventListener('mousemove', handleMouseMove);
    document.querySelector('#hero')?.addEventListener('mouseover', handleMouseEnterWindow);
    document.querySelector('#hero')?.addEventListener('mouseout', handleMouseLeaveWindow);


    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.querySelector('#hero')?.removeEventListener('mouseout', handleMouseLeaveWindow);
      document.querySelector('#hero')?.removeEventListener('mouseover', handleMouseEnterWindow);
    };
  }, [center.x, center.y, mousePosition.x, mousePosition.y]);

  useEffect(() => {
    function handleWindowResize() {
      setCenter({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useGSAP(() => {
    if (!boxRef.current) return;
    if (isMouseOnBox) {
      gsap.to(boxRef.current, {
        scale: 1.1,
        duration: 1.3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
    else if (!isMouseMoving || !isMouseEnter) {
      // Return to initial position when mouse stops
      gsap.to(boxRef.current, {
        scale: 0,
        duration: 1
      });
      return;
    }
  }, [isMouseMoving, isMouseEnter, isMouseOnBox]);

  // Rotate the box like 3d on the mouse movement
  useGSAP(() => {
    if (!boxRef.current) return;
    if (!isMouseEnter) return;

    // Stop any previous animation
    gsap.killTweensOf(boxRef.current);

    gsap.to(boxRef.current, {
      rotateY: rotation.x * 1.5,
      rotateX: rotation.y * 1.5,
      translateZ: `${Math.abs(rotation.x + rotation.y) * 2}px`,
      x: rotation.x * 4,
      y: (rotation.y * -1) * 4,
      width: '256px',
      height: '256px',
      scale: 1
    });
  }, [rotation]);

  const absoluteCenter = "absolute top-1/2 left-1/2 -translate-1/2";

  return (
    <div
      onClick={onClick}
      ref={boxRef}
      className={`${absoluteCenter} rounded-lg translate-z-[0px] rotate-x-[0deg] rotate-y-[0deg] border-2 scale-0 z-30 overflow-hidden`}
      onMouseEnter={() => {
        setIsMouseOnBox(true);
      }}
      onMouseLeave={() => {
        setIsMouseOnBox(false);
      }}
    >
      {children}
    </div>
  );
}
