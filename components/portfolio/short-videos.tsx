import { getContent } from "@/lib/content";
import { TikTokPlayer } from "@/components/portfolio/tiktok-player";
import { Line } from "@/components/portfolio/line";
export async function ShortVideos() {
  const { shortVideos } = await getContent();
  if (shortVideos.length === 0) return null;
  return (
    <section className="section wrap">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">SHORT-FORM HIGHLIGHTS</p>
          <h2 data-lines>
            <Line>Made for the</Line>
            <Line>
              <em>scroll.</em>
            </Line>
          </h2>
        </div>
        <p>
          Vertical videos from TikTok, where most of my audience finds me.
          Pressing play loads TikTok’s player.
        </p>
      </div>
      <div className="short-grid" data-stagger>
        {shortVideos.map((v) => (
          <article key={v.id} className="short-card" data-reveal>
            <TikTokPlayer
              id={v.id}
              title={v.title}
              views={v.views}
              poster={v.poster}
            />
            <h3>{v.title}</h3>
            <p>{v.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
