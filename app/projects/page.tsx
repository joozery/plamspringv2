import Navbar from "../components/Navbar";
import FooterServer from "../components/FooterServer";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { ProjectPage } from "@/lib/models";
import { PageSchema } from "@/lib/page-schema";

export const metadata = {
  title: "โครงการของเรา | Palm Springs",
  description: "รวมโครงการบ้านคุณภาพจาก Palm Springs เชียงใหม่",
};

export default async function ProjectsPage() {
  await connectDB();
  const raw = await ProjectPage.find({ is_published: true })
    .select("_id name subtitle hero_image_url slug")
    .sort({ sort_order: 1 })
    .lean();

  const projects = JSON.parse(JSON.stringify(raw)).map((p: Record<string, unknown>) => ({ ...p, id: p._id }));

  const list = projects;
  const featured = list[0];
  const rest = list.slice(1);

  return (
    <>
      <PageSchema path="/projects" title="โครงการของเรา" />
      <Navbar />
      <main className="bg-[#F8F7F4]">

        {/* ── Hero ── */}
        <section className="relative mt-16 overflow-hidden bg-[#09418C] md:mt-20">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full border border-white/10" />

          <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-end md:px-12 md:py-20">
            <div>
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/50">
                Palm Springs · Chiang Mai
              </p>
              <h1 className="text-3xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
                โครงการของเรา
              </h1>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-px w-10 bg-white/40" />
                <span className="text-sm text-white/60">
                  {list.length} โครงการ
                </span>
              </div>
            </div>

            <p className="hidden max-w-xs text-sm leading-relaxed text-white/60 md:block md:text-right">
              คัดสรรโครงการที่อยู่อาศัยคุณภาพสูง<br />
              เพื่อชีวิตที่ดีกว่าในเชียงใหม่
            </p>
          </div>
        </section>

        {/* ── Projects ── */}
        <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-20">

          {list.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                <svg className="h-9 w-9 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">ยังไม่มีโครงการในขณะนี้</p>
            </div>
          )}

          {/* Mobile: all projects in 2-col grid */}
          {list.length > 0 && (
            <>
              {/* Mobile grid (2 cols, all projects) */}
              <div className="grid grid-cols-2 gap-3 md:hidden">
                {list.map((project: { id: string; name: string; hero_image_url?: string; subtitle?: string; slug?: string }) => (
                  <Link
                    key={project.id}
                    href={project.slug ? `/projects/${project.slug}` : "#"}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                      {project.hero_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.hero_image_url}
                          alt={project.name}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#09418C]/20 to-[#09418C]/40" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        {project.subtitle && (
                          <p className="mb-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white/60">
                            {project.subtitle}
                          </p>
                        )}
                        <h3 className="text-sm font-bold leading-snug text-white">
                          {project.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Desktop: featured full-width + rest in 3-col grid */}
              <div className="hidden md:block">
                {featured && (
                  <Link
                    href={featured.slug ? `/projects/${featured.slug}` : "#"}
                    className="group mb-6 block"
                  >
                    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl">
                      {featured.hero_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={featured.hero_image_url}
                          alt={featured.name}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#09418C]/20 to-[#09418C]/40" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute left-8 top-8 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                        Featured
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white/60">
                          {featured.subtitle || "Palm Springs"}
                        </p>
                        <h2 className="text-4xl font-bold text-white">
                          {featured.name}
                        </h2>
                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/80 transition-all duration-300 group-hover:text-white">
                          <span>ดูโครงการ</span>
                          <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {rest.length > 0 && (
                  <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
                    {rest.map((project: { id: string; name: string; hero_image_url?: string; subtitle?: string; slug?: string }) => (
                      <Link
                        key={project.id}
                        href={project.slug ? `/projects/${project.slug}` : "#"}
                        className="group block"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                          {project.hero_image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={project.hero_image_url}
                              alt={project.name}
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-[#09418C]/20 to-[#09418C]/40" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            {project.subtitle && (
                              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-white/60">
                                {project.subtitle}
                              </p>
                            )}
                            <h3 className="text-lg font-bold leading-snug text-white">
                              {project.name}
                            </h3>
                            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-white/70 transition-all duration-300 group-hover:text-white">
                              <span>ดูโครงการ</span>
                              <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </section>
      </main>
      <FooterServer />
    </>
  );
}
