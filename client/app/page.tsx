"use client";
import { Hero } from "@/components/Hero";
import ImageCarousel from "@/components/ImageCarousel";
import LoadingPage from "@/components/Loading";
import Table from "@/components/Table";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<LoadingPage />}>
        <Hero />
        <ImageCarousel />
        <Table />
      </Suspense>
    </main>
  );
}
