"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ScrollText from "@/components/ScrollText";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BookingModal, { useBookingModal } from "@/components/BookingModal";

export default function Home() {
  const { open, openModal, closeModal } = useBookingModal();

  return (
    <div className="relative min-h-screen">
      {/* Global background color washes */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-0 h-[60%] w-[50%] rounded-full" style={{ background: "#9AAF8C", filter: "blur(180px)", opacity: 0.06 }} />
        <div className="absolute top-[40%] right-0 h-[40%] w-[45%] rounded-full" style={{ background: "#E8A782", filter: "blur(160px)", opacity: 0.05 }} />
        <div className="absolute bottom-[10%] left-[20%] h-[35%] w-[40%] rounded-full" style={{ background: "#96AAC8", filter: "blur(160px)", opacity: 0.05 }} />
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(123,140,111,0.08),transparent_70%)]" />
      </div>

      <div className="relative z-10">
        <Navbar onBookCall={openModal} />
        <HeroSection onBookCall={openModal} />
        <ScrollText />

        <div className="pointer-events-none relative h-0">
          <div className="absolute -top-40 left-[10%] h-[300px] w-[300px] rounded-full sm:h-[400px] sm:w-[400px]" style={{ background: "#E8A782", filter: "blur(120px)", opacity: 0.08 }} />
          <div className="absolute -top-20 right-[5%] h-[250px] w-[250px] rounded-full sm:h-[350px] sm:w-[350px]" style={{ background: "#9AAF8C", filter: "blur(110px)", opacity: 0.07 }} />
        </div>

        <PricingSection />

        <div className="pointer-events-none relative h-0">
          <div className="absolute -top-32 left-[30%] h-[300px] w-[350px] rounded-full" style={{ background: "#96AAC8", filter: "blur(120px)", opacity: 0.06 }} />
        </div>

        <ContactSection onBookCall={openModal} />
        <Footer />
      </div>

      <BookingModal open={open} onClose={closeModal} />
    </div>
  );
}
