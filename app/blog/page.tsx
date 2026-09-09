import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSectionServer";
import BlogHeader from "../components/BlogHeader";
import BlogList from "../components/BlogList";
import FooterServer from "../components/FooterServer";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models";
import { PageSchema } from "@/lib/page-schema";

export const metadata = {
  title: "Blog | Palm Springs",
  description: "บทความต่างๆ จาก Palm Springs",
};

export default async function BlogPage() {
  await connectDB();

  const posts = await Post.find({ type: "blog", is_published: true })
    .select("_id title slug excerpt cover_image_url")
    .sort({ published_at: -1 })
    .lean();

  const postsData = JSON.parse(JSON.stringify(posts)).map((p: Record<string, unknown>) => ({ ...p, id: p._id }));

  return (
    <>
      <PageSchema path="/blog" title="Blog" />
      <Navbar />
      <main>
        <HeroSection />
        <BlogHeader />
        <BlogList posts={postsData} />
      </main>
      <FooterServer />
    </>
  );
}
