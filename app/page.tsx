"use client";

import { Header } from "./components/layout/Header";
import { Hero } from "./components/sections/Hero";
import { Features } from "./components/sections/Features";
import { Demo } from "./components/sections/Demo";
import { CTA } from "./components/sections/CTA";
import { Footer } from "./components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        <Hero />
        <Features />
        <Demo />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
