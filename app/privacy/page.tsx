import { SiteShell } from "@/components/portfolio/shell";
import { Line } from "@/components/portfolio/line";
import { contact } from "@/lib/portfolio";
export const metadata = { title: "Privacy & Content Notes | Namrata Dahal" };
export default function Privacy() {
  return (
    <SiteShell>
      <main id="main" className="wrap policy-page page-intro">
        <p className="eyebrow">UPDATED 11 OCTOBER 2026</p>
        <h1 data-lines>
          <Line>Privacy &amp;</Line>
          <Line>
            <em>content notes.</em>
          </Line>
        </h1>
        <section>
          <h2>Collaboration requests</h2>
          <p>
            When you send the collaboration form, this website collects your
            name, work email, brand, optional website, main goal, product and
            idea details, preferred format and platforms, budget range, timing,
            intended usage, and your privacy consent. Namrata uses these details
            only to review your request and reply to you. They are never
            published, sold, or shared with other brands or agencies.
          </p>
          <p>
            Draft entries stay in your browser until you send them. Sent
            requests are stored in a database hosted by Supabase that only
            Namrata can access; the website itself cannot read requests back.
            Namrata receives an email alert for each new request and a weekly
            summary of open requests, and you may receive a confirmation copy at
            the email address you provide. These emails are sent through Resend.
          </p>
          <p>
            Requests are kept while they are needed to respond and to manage any
            resulting collaboration. To ask for a copy of your request or for
            its deletion, message{" "}
            <a href={contact.instagram}>{contact.instagramHandle}</a> on
            Instagram with your request reference.
          </p>
        </section>
        <section>
          <h2>Analytics and site performance</h2>
          <p>
            We use Google Analytics to understand how the site is used: the pages
            visited, which videos are played, which filters are chosen, and
            which form steps are completed, including the format, goal, budget
            range, and number of platforms selected. Your name, email, and
            message are not sent to analytics. Google Analytics keeps a random
            identifier in your browser’s storage to recognise return visits,
            and it also reports website errors so they can be fixed.
          </p>
          <p>
            Google Analytics counts page views without cookies, and
            Speed Insights measures how quickly pages load. You can block these
            tools with your browser’s privacy settings or a content blocker;
            the site works the same without them.
          </p>
        </section>
        <section>
          <h2>Embedded videos and external services</h2>
          <p>
            YouTube and TikTok players load only after you press play. YouTube
            videos use the privacy-enhanced youtube-nocookie.com player, but
            playback can still involve data processing by YouTube or TikTok.
            Links to social platforms follow those platforms’ own policies.
            Fonts are served from this website, and the site is hosted on
            Google Cloud Platform, which processes technical request information to operate
            it.
          </p>
        </section>
        <section>
          <h2>Performance figures</h2>
          <p>
            Displayed view counts and collaboration history are dated
            creator-provided snapshots. Views are not unique people, results
            across different periods are not combined, and past performance does
            not guarantee future results.
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
