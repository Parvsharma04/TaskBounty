"use client";

import { Hero } from "@/components/Hero";
import ImageCarousel from "@/components/ImageCarousel";
import { useEffect } from "react";
import Hero3Page from "@/components/Hero3";
import Hero4 from "@/components/Hero4";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { ScrollTrigger } from "gsap/all";
import FAQ from "@/components/FAQ";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const bodyRef = useRef(null);

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();
    })();
  }, []);

  useGSAP(
    () => {
      const t1 = gsap.timeline();

      t1.to(
        [
          "#section1",
          "#section2",
          "#section3",
          "#section4",
          "#section5",
          "#section6",
        ],
        {
          display: "none",
        }
      )
        .from("#preload-container", {
          scrollTop: 0,
          opacity: 0,
          duration: 1,
          xPercent: -100,
          stagger: 0.5,
        })
        .from("#preload-base", {
          opacity: 0,
          duration: 1,
          yPercent: -100,
          stagger: 0.5,
        })
        .from("#preload-title", {
          opacity: 0,
          duration: 1,
          yPercent: 100,
        })
        .from("#preload-image", {
          opacity: 0,
          duration: 1,
          xPercent: 100,
        })
        .to("#preload-container", {
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        })
        .to("#preload-container", {
          display: "none",
        })
        .from(
          [
            "#section1",
            "#section2",
            "#section3",
            "#section4",
            "#section5",
            "#section6",
          ],
          {
            display: "flex",
          }
        )
        .from("#section1", {
          xPercent: -100, // Move from left to right
          duration: 1,
          opacity: 0, // Optional: fade in effect
          ease: "power2.inOut",
        });

      window.scrollTo(0, 0);

      const t2 = gsap.timeline({
        scrollTrigger: {
          trigger: "#section1",
          start: "top bottom", // Adjust start point (triggers when section2 enters viewport)
          end: "top top", // Adjust end point (triggers when section2 reaches top)
          scrub: true, // Smooth scrolling
        },
      });

      t2.from("#section2Div", {
        xPercent: -100, // Move from left to right
        duration: 1,
        opacity: 0, // Optional: fade in effect
        ease: "power2.inOut",
      });

      const t3 = gsap.timeline({
        scrollTrigger: {
          trigger: "#section3",
          start: "top 90%",
          end: "top 50%",
          scrub: true,
        },
      });

      t3.from("#section4", {
        xPercent: -100, // Move from left to right
        duration: 2,
        opacity: 0, // Optional: fade in effect
        ease: "power2.inOut",
        stagger: 0.5,
      });

      const t4 = gsap.timeline({
        scrollTrigger: {
          trigger: "#section4",
          start: "top 70%",
          end: "top 30%",
          scrub: true,
        },
      });

      t4.from("#section5", {
        xPercent: -100, // Move from left to right
        duration: 2,
        opacity: 0, // Optional: fade in effect
        ease: "power2.inOut",
        stagger: 0.5,
      });
      const t5 = gsap.timeline({
        scrollTrigger: {
          trigger: "#section5",
          start: "top 70%",
          end: "top 30%",
          scrub: true,
        },
      });

      t5.from("#section6", {
        xPercent: -100, // Move from left to right
        duration: 2,
        opacity: 0, // Optional: fade in effect
        ease: "power2.inOut",
        stagger: 0.5,
      });

      const t6 = gsap.timeline({
        scrollTrigger: {
          trigger: "#section6",
          start: "top 70%",
          end: "top 30%",
          scrub: true,
        },
      });

      t6.from("#section7", {
        xPercent: -100, // Move from left to right
        duration: 2,
        opacity: 0, // Optional: fade in effect
        ease: "power2.inOut",
        stagger: 0.5,
      });
    },
    { scope: bodyRef }
  );

  return (
    <main
      ref={bodyRef}
      id="body smooth-wrapper"
      className="overflow-hidden scroll-smooth"
    >
      <div
        className="bg-gray-950 h-screen overflow-hidden"
        id="preload-container"
      >
        <Image
          id="preload-image"
          className="absolute top-48 md:top-24 md:left-96"
          src="/solana.png"
          alt="solana logo"
          width={700}
          height={700}
        />
        <h1
          className="absolute bottom-96 md:bottom-60 text-center md:left-[23%] text-3xl md:text-5xl"
          id="preload-title"
        >
          Empower your Data with{" "}
          <span className="text-blue-600">TaskBounty</span>
        </h1>
        <div
          className="w-full bg-white absolute h-96 rounded-3xl md:rounded-full rounded-b-none -bottom-10 md:-bottom-40"
          id="preload-base"
        ></div>
      </div>
      <div id="smooth-content">
        <section className="bg-gray-950" id="section1">
          <Hero />
        </section>
        <section
          className="bg-gray-950 h-screen flex justify-center items-center"
          id="section2"
        >
          <div
            id="section2Div"
            className="bg-gray-800 flex flex-col justify-center items-center w-2/3 rounded-xl p-7"
          >
            <h1
              id="section2Title"
              className="text-pink-600 md:text-5xl text-5xl mb-5 text-center font-myFont"
            >
              Our Mission
            </h1>
            <p
              id="section2Desc"
              className="text-white md:text-2xl text-xl text-justify font-myFont3"
            >
              To revolutionize data labeling by creating a decentralized
              platform that connects clients and workers efficiently and
              transparently.
            </p>
          </div>
        </section>
        <section className="bg-gray-950 mb-32" id="section3">
          <ImageCarousel />
        </section>
        <section className="bg-gray-950 md:h-screen" id="section4">
          <section
            id="features"
            className="relative block px-6 py-10 md:py-20 md:px-10  border-t border-b border-neutral-900 bg-neutral-900/30"
          >
            <div className="relative mx-auto max-w-5xl text-center">
              <h2 className="block w-full bg-gradient-to-b from-white to-gray-400 bg-clip-text font-bold text-transparent text-4xl md:text-5xl animate font-myFont2">
                Why Choose Us?
              </h2>
              <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400 text-2xl animate font-myFont3">
                Decentralized, Secure, and Efficient
              </p>
            </div>
            <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 gap-10 pt-14 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-6 text-center shadow">
                <div
                  className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border "
                  style={{
                    backgroundImage:
                      "linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)",
                    borderColor: "rgb(93, 79, 240)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-color-swatch"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M19 3h-4a2 2 0 0 0 -2 2v12a4 4 0 0 0 8 0v-12a2 2 0 0 0 -2 -2" />
                    <path d="M13 7.35l-2 -2a2 2 0 0 0 -2.828 0l-2.828 2.828a2 2 0 0 0 0 2.828l9 9" />
                    <path d="M7.3 13h-2.3a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h12" />
                    <line x1={17} y1={17} x2={17} y2="17.01" />
                  </svg>
                </div>
                <h3 className="mt-6 text-gray-400 font-myFont3 font-bold text-2xl">
                  Earn While You Work
                </h3>
                <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400 font-myFont3 text-xl">
                  Complete tasks and earn 0.0002 Solana for every job you
                  finish, ensuring fair compensation for your efforts.
                </p>
              </div>
              <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-6  text-center shadow">
                <div
                  className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border "
                  style={{
                    backgroundImage:
                      "linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)",
                    borderColor: "rgb(93, 79, 240)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-bolt"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="13 3 13 10 19 10 11 21 11 14 5 14 13 3" />
                  </svg>
                </div>
                <h3 className="mt-6 text-gray-400 font-myFont2 font-bold text-2xl">
                  Client Friendly Interface
                </h3>
                <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400 font-myFont3 text-xl">
                  Easily post tasks and manage projects with our intuitive
                  dashboard designed for seamless client experience.
                </p>
              </div>
              <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-6 text-center shadow">
                <div
                  className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border "
                  style={{
                    backgroundImage:
                      "linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)",
                    borderColor: "rgb(93, 79, 240)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-tools"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4" />
                    <line x1="14.5" y1="5.5" x2="18.5" y2="9.5" />
                    <polyline points="12 8 7 3 3 7 8 12" />
                    <line x1={7} y1={8} x2="5.5" y2="9.5" />
                    <polyline points="16 12 21 17 17 21 12 16" />
                    <line x1={16} y1={17} x2="14.5" y2="18.5" />
                  </svg>
                </div>
                <h3 className="mt-6 text-gray-400 font-myFont2 font-bold text-2xl">
                  Transparent Payments
                </h3>
                <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400 font-myFont3 text-xl">
                  Track your earnings and payouts in real-time, ensuring
                  transparency and trust in every transaction.
                </p>
              </div>
            </div>
            <div
              className="absolute bottom-0 left-0 z-0 h-1/3 w-full border-b"
              style={{
                backgroundImage:
                  "linear-gradient(to right top, rgba(79, 70, 229, 0.2) 0%, transparent 50%, transparent 100%)",
                borderColor: "rgba(92, 79, 240, 0.2)",
              }}
            ></div>
            <div
              className="absolute bottom-0 right-0 z-0 h-1/3 w-full"
              style={{
                backgroundImage:
                  "linear-gradient(to left top, rgba(220, 38, 38, 0.2) 0%, transparent 50%, transparent 100%)",
                borderColor: "rgba(92, 79, 240, 0.2)",
              }}
            ></div>
          </section>
        </section>
        <section className="bg-gray-950 md:h-screen" id="section5">
          <Hero3Page />
        </section>
        <section
          className="bg-gray-950 h-screen  flex justify-center items-center"
          id="section6"
        >
          <Hero4 />
        </section>
        <section className="bg-gray-950" id="section7">
          <FAQ />
        </section>
      </div>
    </main>
  );
}
