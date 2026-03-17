"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DiscoverySection from "@/components/DiscoverySection";
import MarqueeText from "@/components/MarqueeText";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BookingModal, { useBookingModal } from "@/components/BookingModal";

function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { open, openModal, closeModal } = useBookingModal();

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <Navbar onBookCall={openModal} />

        <HeroSection />

        <ScrollReveal className="bg-[#ECEAE7]">
          <DiscoverySection />
        </ScrollReveal>

        <ScrollReveal className="border-y border-[#1A1A1A]/[0.06] bg-white">
          <MarqueeText />
        </ScrollReveal>

        <ScrollReveal className="bg-[#ECEAE7]">
          <ServicesSection />
        </ScrollReveal>

        <ScrollReveal className="border-y border-[#1A1A1A]/[0.06] bg-white">
          <PricingSection />
        </ScrollReveal>

        <ScrollReveal className="bg-[#ECEAE7]">
          <ContactSection onBookCall={openModal} />
        </ScrollReveal>

        <Footer />
      </div>

      <BookingModal open={open} onClose={closeModal} />
    </div>
  );
}
