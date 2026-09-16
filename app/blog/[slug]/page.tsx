import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import FooterServer from "../../components/FooterServer";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models";
import { PageSchema } from "@/lib/page-schema";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const post = await Post.findOne({ slug }).select("title excerpt").lean();
  if (!post) return {};
  return { title: `${post.title} | Palm Springs`, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();

  const post = await Post.findOne({ slug, is_published: true }).lean();
  if (!post) notFound();

  const isCsr = post.type === "csr";
  const backHref = isCsr ? "/about" : "/blog";
  const backLabel = isCsr ? "← กลับหน้า About Us" : "← กลับหน้า Blog";
  const badgeLabel = isCsr ? "CSR Projects" : "Blog";
  const badgeClass = isCsr
    ? "bg-green-100 text-green-700"
    : "bg-blue-100 text-[#09418C]";

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <PageSchema path={`/blog/${slug}`} title={post.title} />
      <Navbar />

      {/* Hero cover */}
      {post.cover_image_url && (
        <div className="relative flex w-full items-center justify-center overflow-hidden bg-gray-50 py-10 md:pt-30 md:py-16">
          {/* Blurred background to act as dynamic gradient padding */}
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center blur-3xl opacity-60"
            style={{ backgroundImage: `url(${post.cover_image_url})` }}
          />

          {/* 1:1 Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="relative z-10 aspect-square w-11/12 max-w-[360px] rounded-xl object-cover shadow-2xl md:max-w-[480px]"
          />
        </div>
      )}

      <main className="mx-auto max-w-3xl px-6 py-10 md:px-8 md:py-14">
        {/* Back link */}
        <Link
          href={backHref}
          className="mb-6 inline-block text-sm font-medium text-gray-500 transition-colors hover:text-primary"
        >
          {backLabel}
        </Link>

        {/* Badge + date */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
            {badgeLabel}
          </span>
          {publishedDate && (
            <span className="text-sm text-gray-400">{publishedDate}</span>
          )}
        </div>

        {/* Title */}
        <h1 className="mb-5 text-3xl font-bold leading-snug text-primary md:text-4xl">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-8 border-l-4 border-primary pl-5 text-lg leading-relaxed text-gray-500">
            {post.excerpt}
          </p>
        )}

        {/* Divider */}
        <hr className="mb-8 border-gray-200" />

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-primary
            prose-p:leading-relaxed prose-p:text-gray-700
            prose-a:text-primary prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-primary prose-blockquote:text-gray-500
            prose-ul:text-gray-700 prose-ol:text-gray-700
            prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />
      </main>

      <FooterServer />
    </>
  );
}
