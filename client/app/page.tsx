// "use client";

import { Hero } from "@/components/Hero";
import ImageCarousel from "@/components/ImageCarousel";
import LoadingPage from "@/components/Loading";
import Table from "@/components/Table";
import GoalPage from "@/components/Goal";
import { Suspense } from "react";
import Hero2Page from "@/components/Hero2";
import Hero3Page from "@/components/Hero3";
import Link from "next/link";
import Image from "next/image";
import Hero4 from "@/components/Hero4";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<LoadingPage />}>
        <section className="bg-black ">
          <Hero />
        </section>
        <section className="bg-black h-screen flex justify-center items-center ">
          <GoalPage />
        </section>
        <section className="bg-black mb-32">
          <ImageCarousel />
        </section>
        <section className="bg-black md:h-screen ">
          <Hero2Page />
        </section>
        <section className="bg-black md:h-screen ">
          <Hero3Page />
        </section>
        <section className="bg-black h-screen  flex justify-center items-center">
          <Hero4 />
        </section>
      </Suspense>
    </main>
  );
}
