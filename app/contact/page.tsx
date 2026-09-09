import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSectionServer";
import ContactHero from "../components/ContactHero";
import ContactCards from "../components/ContactCards";
import FooterServer from "../components/FooterServer";
import { PageSchema } from "@/lib/page-schema";

export const metadata = {
  title: "Contact Us | Palm Springs",
  description: "ติดต่อเรา ร่วมงานกับเรา เสนอขายที่ดิน",
};

export default function ContactPage() {
  return (
    <>
      <PageSchema path="/contact" title="Contact Us" />
      <Navbar />
      <main>
        <HeroSection />
        <ContactHero />
        <ContactCards />
      </main>
      <FooterServer />
    </>
  );
}
