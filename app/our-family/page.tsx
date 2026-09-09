import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSectionServer";
import OurFamilyWelcome from "../components/OurFamilyWelcome";
import OurFamilySlider from "../components/OurFamilySlider";
import OurFamilyVideos from "../components/OurFamilyVideos";
import OurFamilyGrid from "../components/OurFamilyGrid";
import FooterServer from "../components/FooterServer";
import { connectDB } from "@/lib/mongodb";
import { SiteSetting, OurFamilyImage } from "@/lib/models";
import { PageSchema } from "@/lib/page-schema";

export const metadata = {
  title: "Our Family | Palm Springs",
  description: "Reviews and family stories from Palm Springs residents.",
};

export default async function OurFamilyPage() {
  await connectDB();

  const [settings, sliderImages, gridImages] = await Promise.all([
    SiteSetting.findOne({ key: "our_family_videos" }).lean(),
    OurFamilyImage.find({ section: "slider" }).sort({ sort_order: 1 }).lean(),
    OurFamilyImage.find({ section: "grid" }).sort({ sort_order: 1 }).lean(),
  ]);

  const familyVideos = settings?.value as { video1?: { youtube_url?: string; title?: string }; video2?: { youtube_url?: string; title?: string } } | undefined;

  const sliderData = JSON.parse(JSON.stringify(sliderImages)).map((d: Record<string, unknown>) => ({ ...d, id: d._id }));
  const gridData = JSON.parse(JSON.stringify(gridImages)).map((d: Record<string, unknown>) => ({ ...d, id: d._id }));

  return (
    <>
      <PageSchema path="/our-family" title="Our Family" />
      <Navbar />
      <main>
        <HeroSection />
        <OurFamilyWelcome />
        <OurFamilySlider images={sliderData} />
        <OurFamilyVideos
          video1={familyVideos?.video1}
          video2={familyVideos?.video2}
        />
        <OurFamilyGrid images={gridData} />
      </main>
      <FooterServer />
    </>
  );
}
