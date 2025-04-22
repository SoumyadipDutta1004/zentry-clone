"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";

import { heroHeading } from "@/constants/heading";
import AnimatedVideoButton from "./AnimatedVideoButton";
import Button from "./Button";

import { TiLocationArrow } from "react-icons/ti";

gsap.registerPlugin(ScrollTrigger);

const videoUrls = [
  "videos/hero-1.mp4",
  "videos/hero-2.mp4",
  "videos/hero-3.mp4",
  "videos/hero-4.mp4",
];

export default function Hero() {

  const [previousIndex, setPreviousIndex] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [headingIndex, setHeadingIndex] = useState<number>(1);
  const [hasClicked, setHasClicked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [videoBlobs, setVideoBlobs] = useState<string[]>([]);

  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const totalVideos = 4;


  useEffect(() => {
    const loadVideos = async () => {
      const blobs = await Promise.all(
        videoUrls.map(async (url) => {
          const response = await fetch(url);
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        })
      );
      setVideoBlobs(blobs);
    };

    loadVideos();
    setIsLoading(false);
  }, []);

  function handleMiniVdClick() {
    setHasClicked(true);
    setTimeout(() => {
      setPreviousIndex(currentIndex);
    }, 1000);
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  }

  useGSAP(() => {
    if (hasClicked) {
      gsap.set('#next-video', { visibility: 'visible' });

      const tl = gsap.timeline();
      tl.to('#next-video', {
        transformOrigin: 'center center',
        scale: 1,
        width: '100%',
        height: '100%',
        duration: 1,
        ease: 'power1.inOut',
        onStart: () => {
          nextVideoRef.current!.play();
        },
        onComplete: () => {
          setHeadingIndex((prevIndex) => (prevIndex % totalVideos) + 1);
        }
      });
      tl.from('#hero-heading1', {
        y: -50,
        x: -100,
        rotateZ: -10,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: true,
      });
      gsap.from('#current-video', {
        opacity: 0,
        scale: 0.3,
        duration: 1,
        delay: 0.3,
      });
      gsap.to(
        '#hero-heading2',
        {
          y: 200,
          x: 200,
          rotateX: 50,
          rotateY: -80,
          opacity: 1,
          duration: 1.5,
          delay: 0.2,
          ease: 'power2.out',
          overwrite: true,
        }
      );
    }
  }, { dependencies: [currentIndex], revertOnUpdate: true });

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 50% 30%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });


  return (
    <div id="hero" className="relative h-dvh w-screen overflow-hidden">
      {isLoading && (
        <div className="absolute-center z-50 h-screen w-screen bg-blue-75">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}
      <div id="video-frame" className="relative z-10 h-dvh w-screen overflow-hidden bg-blue-75">
        <div>
          <div className="absolute-center absolute z-50 cursor-pointer rounded-lg perspective-[1000px]" id="current-video">
            <AnimatedVideoButton
              onClick={handleMiniVdClick}
            >
              <video
                ref={currentVideoRef}
                src={videoBlobs[(currentIndex % totalVideos) + 1]}
                loop
                muted

                className="w-full h-full origin-center object-cover"
              />
            </AnimatedVideoButton>
          </div>
          <video
            ref={nextVideoRef}
            src={videoBlobs[currentIndex]}
            loop
            muted
            id="next-video"
            className="size-64 absolute-center invisible absolute z-20 object-cover"
          />

          <video
            src={videoBlobs[previousIndex]}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
          />
        </div>

        <h1 id="hero-heading1" className="special-font hero-heading absolute z-50 bottom-5 right-5 text-blue-75">
          {heroHeading[headingIndex - 1]}
        </h1>
        <h1 id="hero-heading2" className="special-font hero-heading absolute z-50 bottom-5 right-5 text-blue-75">
          {heroHeading[headingIndex - 1]}
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">redefi<b>n</b>e</h1>
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Meta-game Layer <br /> Unleash the Play Economy
            </p>
            <Button
              id="watch-trailer"
              title="Watch Trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        {heroHeading[headingIndex - 1]}
      </h1>

    </div>
  );
}
