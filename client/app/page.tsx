"use client";
import { Hero } from "@/components/Hero";
import LoadingPage from "@/components/Loading";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<LoadingPage />}>
        <Hero />
      </Suspense>
    </main>
  );
}
