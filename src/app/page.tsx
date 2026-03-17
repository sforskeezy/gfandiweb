"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DiscoverySection from "@/components/DiscoverySection";
import MarqueeText from "@/components/MarqueeText";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BookingModal, { useBookingModal } from "@/components/BookingModal";

export default function Home() {
  const { open, openModal, closeModal } = useBookingModal();

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <Navbar onBookCall={openModal} />

        {/* Hero — full-bleed blurred image */}
        <HeroSection />

        {/* Discovery — warm base */}
        <div className="bg-[#ECEAE7]">
          <DiscoverySection />
        </div>

        {/* Marquee — white strip */}
        <div className="border-y border-[#1A1A1A]/[0.06] bg-white">
          <MarqueeText />
        </div>

        {/* Services — warm base */}
        <div className="bg-[#ECEAE7]">
          <ServicesSection />
        </div>

        {/* Pricing — white */}
        <div className="border-y border-[#1A1A1A]/[0.06] bg-white">
          <PricingSection />
        </div>

        {/* Contact */}
        <div className="bg-[#ECEAE7]">
          <ContactSection onBookCall={openModal} />
        </div>

        {/* Footer */}
        <Footer />
      </div>

      <BookingModal open={open} onClose={closeModal} />
    </div>
  );
}
