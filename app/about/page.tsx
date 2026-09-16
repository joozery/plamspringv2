import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSectionServer";
import AboutContent from "../components/AboutContent";
import MilestoneSection from "../components/MilestoneSection";
import AwardsSection from "../components/AwardsSection";
import FooterServer from "../components/FooterServer";
import { connectDB } from "@/lib/mongodb";
import { Milestone, Award, Post, SiteSetting } from "@/lib/models";
import { PageSchema } from "@/lib/page-schema";

export const metadata = {
  title: "About Us | Palm Springs",
  description: "Learn about Palm Springs – our history, vision, and mission.",
};

export default async function AboutPage() {
  await connectDB();

  const [milestones, awards, csrPosts, aboutSetting] = await Promise.all([
    Milestone.find().sort({ sort_order: 1 }).lean(),
    Award.find({ is_published: true }).sort({ sort_order: 1 }).lean(),
    Post.find({ type: "csr", is_published: true }).select("id title slug cover_image_url excerpt").sort({ published_at: -1 }).lean(),
    SiteSetting.findOne({ key: "about_content" }).lean(),
  ]);

  const ms = JSON.parse(JSON.stringify(milestones)).map((d: Record<string, unknown>) => ({ ...d, id: d._id }));
  const aw = JSON.parse(JSON.stringify(awards)).map((d: Record<string, unknown>) => ({ ...d, id: d._id }));
  const posts = JSON.parse(JSON.stringify(csrPosts)).map((d: Record<string, unknown>) => ({ ...d, id: d._id }));

  return (
    <>
      <PageSchema path="/about" title="About Us" />
      <Navbar />
      <main>
        <HeroSection />
        <AboutContent data={aboutSetting?.value as Parameters<typeof AboutContent>[0]["data"]} />
        <MilestoneSection milestones={ms} />
        <AwardsSection awards={aw} csrPosts={posts} />
      </main>
      <FooterServer />
    </>
  );
}
