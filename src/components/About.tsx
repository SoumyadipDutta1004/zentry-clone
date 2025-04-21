"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);



export default function About() {

  useGSAP(() => {
    const gsapTimelineConfig = {
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      }
    };
    const clipAnimation = gsap.timeline(gsapTimelineConfig);

    clipAnimation.to('.mask-clip-path', {
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
    });

    clipAnimation.to('#rocks', {
      top: '100px'
    }, 0);
  }, []);

  return (
    <div id="about" className="w-screen min-h-screen relative">
      <div className="max-w-6xl mx-auto relative mb-8 mt-32 flex flex-col items-center gap-5">
        <h2 className="font-general uppercase">
          Welcome to Zentry
        </h2>
        <div className="mt-5 text-center text-4xl uppercase leading-[0.8] md:text-[6rem] special-font hero-heading">
          Discover the world&apos;s largest shared adventure
        </div>
        <div className="about-subtext">
          <p>The Game of Games begins-your life, now an epic MMORPG</p>
          <p>Zentry unites every player from countless games and platforms</p>
        </div>
      </div>
      <div className="h-dvh w-screen relative" id="clip">
        <div className="mask-clip-path about-image">
          <Image
            src="/img/about.webp"
            alt="Background"
            width={1920}
            height={1080}
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
        <Image
          id="rocks"
          src="/img/rocks.webp"
          alt="Background"
          width={1920}
          height={1080}
          className="absolute left-0 -top-24 object-cover z-100"
        />
      </div>
    </div>
  );
}
