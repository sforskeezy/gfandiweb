"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DiscoverySection from "@/components/DiscoverySection";
import LogoCloudSection from "@/components/LogoCloudSection";
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
        <HeroSection onBookCall={openModal} />
        <DiscoverySection />
        <LogoCloudSection />
        <MarqueeText />
        <ServicesSection />
        <PricingSection />
        <ContactSection onBookCall={openModal} />
        <Footer />
      </div>

      <BookingModal open={open} onClose={closeModal} />
    </div>
  );
}
