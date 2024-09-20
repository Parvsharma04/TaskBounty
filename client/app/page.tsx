"use client";

import { Hero } from "@/components/Hero";
import ImageCarousel from "@/components/ImageCarousel";
import LoadingPage from "@/components/Loading";
import GoalPage from "@/components/Goal";
import { Suspense } from "react";
import Hero2Page from "@/components/Hero2";
import Hero3Page from "@/components/Hero3";
import Hero4 from "@/components/Hero4";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

export default function Home() {
  const bodyRef = useRef(null);

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
        );
    },
    { scope: bodyRef }
  );

  return (
    <main ref={bodyRef} id="body">
      <div className="bg-black h-screen overflow-hidden" id="preload-container">
        <Image
          id="preload-image"
          className="absolute top-24 left-96"
          src="/solana.png"
          alt="solana logo"
          width={700}
          height={700}
        />
        <h1 className="absolute bottom-60 left-80 text-5xl" id="preload-title">
          Empower your Data with{" "}
          <span className="text-blue-600">TaskBounty</span>
        </h1>
        <div
          className="w-full bg-white absolute h-96 rounded-full rounded-b-none -bottom-40"
          id="preload-base"
        ></div>
      </div>
      <Suspense fallback={<LoadingPage />}>
        <section className="bg-black" id="section1">
          <Hero />
        </section>
        <section
          className="bg-black h-screen flex justify-center items-center"
          id="section2"
        >
          <GoalPage />
        </section>
        <section className="bg-black mb-32" id="section3">
          <ImageCarousel />
        </section>
        <section className="bg-black md:h-screen " id="section4">
          <Hero2Page />
        </section>
        <section className="bg-black md:h-screen " id="section5">
          <Hero3Page />
        </section>
        <section
          className="bg-black h-screen  flex justify-center items-center"
          id="section6"
        >
          <Hero4 />
        </section>
      </Suspense>
    </main>
  );
}
