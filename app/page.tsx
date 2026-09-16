import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSectionServer";
import VideoSection from "./components/VideoSection";
import HomeTypeSection from "./components/HomeTypeSection";
import CoverSection from "./components/CoverSection";
import LifestyleSlider from "./components/LifestyleSlider";
import FeaturedVideoSection from "./components/FeaturedVideoSection";
import HomeCommunitySection from "./components/HomeCommunitySection";
import LoanCalculator from "./components/LoanCalculator";
import FooterServer from "./components/FooterServer";
import { connectDB } from "@/lib/mongodb";
import { SiteSetting, Project, ProjectPage, LifestyleSlide } from "@/lib/models";
import { fetchEntityData } from "@/lib/geo-schema";
import { PageSchema } from "@/lib/page-schema";

// Homepage pulls admin-editable content (projects, settings, lifestyle
// slides) from MongoDB — must render per-request, not freeze at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  await connectDB();

  const [settings, projects, lifestyleSlides, entityData] = await Promise.all([
    SiteSetting.find({ key: { $in: ["home_videos", "featured_video"] } }).lean(),
    Project.find({ is_published: true }).sort({ sort_order: 1 }).lean(),
    LifestyleSlide.find({ is_published: true }).sort({ sort_order: 1 }).lean(),
    fetchEntityData("/"),
  ]);

  // Resolve linked project page slugs
  const pageIds = projects.map((p) => p.linked_project_page_id).filter(Boolean);
  const projectPages = pageIds.length
    ? await ProjectPage.find({ _id: { $in: pageIds } }).select("_id slug").lean()
    : [];
  const slugById: Record<string, string | null> = {};
  for (const pp of projectPages) {
    slugById[String(pp._id)] = pp.slug ?? null;
  }

  const getSetting = (key: string) => settings.find((s) => s.key === key)?.value as Record<string, unknown> | undefined;

  const homeVideosSetting = getSetting("home_videos") as { video1?: { youtube_url?: string; title?: string }; video2?: { youtube_url?: string; title?: string } } | undefined;
  const featuredVideoSetting = getSetting("featured_video") as { youtube_url?: string; title?: string } | undefined;

  const homeVideos = [homeVideosSetting?.video1, homeVideosSetting?.video2]
    .filter((v) => v?.youtube_url)
    .map((v, i) => ({
      id: String(i + 1),
      title: v!.title ?? "",
      youtubeId: extractYouTubeId(v!.youtube_url!),
    }));

  const featuredVideo = featuredVideoSetting?.youtube_url
    ? { youtubeId: extractYouTubeId(featuredVideoSetting.youtube_url), title: featuredVideoSetting.title ?? "" }
    : null;

  const projectsData = JSON.parse(JSON.stringify(projects)).map((p: Record<string, unknown>) => ({
    ...p,
    id: p._id,
    project_pages: p.linked_project_page_id ? { slug: slugById[String(p.linked_project_page_id)] ?? null } : null,
  }));

  const slidesData = JSON.parse(JSON.stringify(lifestyleSlides)).map((s: Record<string, unknown>) => ({ ...s, id: s._id }));

  return (
    <>
      {entityData && (
        <script
          id="llm-data"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entityData) }}
        />
      )}
      <PageSchema path="/" title="Palm Springs" />
      <Navbar />
      <main>
        <HeroSection />
        <VideoSection videos={homeVideos} />
        <HomeTypeSection projects={projectsData} />
        <CoverSection />
        <LifestyleSlider slides={slidesData} />
        <FeaturedVideoSection video={featuredVideo} />
        <HomeCommunitySection />
        <LoanCalculator />
      </main>
      <FooterServer />
    </>
  );
}

/** Extract YouTube video ID from a full URL or bare ID string. */
function extractYouTubeId(input: string): string {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return input.trim();
}
