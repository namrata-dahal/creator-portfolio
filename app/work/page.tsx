import { SiteShell, BrandCTA } from "@/components/portfolio/shell";
import { VideoLibrary } from "@/components/portfolio/video-library";
import { ShortVideos } from "@/components/portfolio/short-videos";
import { CaseStudies } from "@/components/portfolio/showcase";
import { Line } from "@/components/portfolio/line";
import { getContent } from "@/lib/content";
export const metadata = { title: "Selected Work & Videos | Namrata Dahal" };
export const revalidate = 300;
export default async function Work() {
  const { statsDate, videos, videoViewsDate } = await getContent();
  return (
    <SiteShell>
      <main id="main">
        <section className="wrap page-hero page-intro">
          <p className="eyebrow">THE PORTFOLIO / SELECTED WORK</p>
          <h1 data-lines>
            <Line>Stories with</Line>
            <Line>
              <em>something to say.</em>
            </Line>
          </h1>
          <p>
            Watch the content, hear my voice, and see how education, nursing,
            and everyday life come together.
          </p>
        </section>
        <section className="wrap video-section">
          <VideoLibrary videos={videos} viewsDate={videoViewsDate} />
        </section>
        <ShortVideos />
        <section className="section wrap" id="brand-work">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">BRAND COLLABORATIONS</p>
              <h2 data-lines>
                <Line>Useful ideas.</Line>
                <Line>
                  <em>Made approachable.</em>
                </Line>
              </h2>
            </div>
            <p>
              What each brand needed, what I made, and the views it earned.
              Views as of {statsDate}.
            </p>
          </div>
          <CaseStudies />
        </section>
        <BrandCTA />
      </main>
    </SiteShell>
  );
}
