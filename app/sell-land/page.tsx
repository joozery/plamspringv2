import Navbar from "../components/Navbar";
import FooterServer from "../components/FooterServer";
import LandInquiryForm from "./LandInquiryForm";
import { PageSchema } from "@/lib/page-schema";

export const metadata = {
  title: "ขายที่ดิน | Palm Springs",
  description: "เสนอขายที่ดินกับ Palm Springs กรอกแบบฟอร์มเพื่อให้ทีมงานของเราติดต่อกลับ",
};

export default function SellLandPage() {
  return (
    <>
      <PageSchema path="/sell-land" title="ขายที่ดิน" />
      <Navbar />
      <main>
        {/* Hero banner */}
        <section className="relative flex items-center justify-center bg-gradient-to-br from-[#09418C] to-[#0a52b3] pt-20 pb-16 text-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative text-center">
            <h1 className="text-4xl font-black tracking-tight drop-shadow md:text-5xl">
              ขายที่ดิน
            </h1>
            <p className="mt-3 text-base font-medium text-blue-100 md:text-lg">
              เสนอขายที่ดินของคุณให้กับ Palm Springs
            </p>
          </div>
        </section>

        {/* Form section */}
        <section className="bg-gray-50 px-4 py-16">
          <div className="mx-auto max-w-2xl">
            <LandInquiryForm />
          </div>
        </section>
      </main>
      <FooterServer />
    </>
  );
}
