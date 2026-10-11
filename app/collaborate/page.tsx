import Link from "next/link";
import { SiteShell, ContactOptions } from "@/components/portfolio/shell";
import { InquiryForm } from "@/components/portfolio/inquiry-form";
import { Line } from "@/components/portfolio/line";
import { contact } from "@/lib/portfolio";
export const metadata = {
  title: "Send a Collaboration Request | Namrata Dahal",
};
export default function Collaborate() {
  return (
    <SiteShell>
      <main id="main" className="wrap collaborate-page">
        <aside className="collaborate-aside page-intro">
          <p className="eyebrow">LET’S WORK TOGETHER</p>
          <h1 data-lines>
            <Line>Your next story</Line>
            <Line>
              <em>starts here.</em>
            </Line>
          </h1>
          <p>
            Share a few details about your brand and the idea. It takes about
            two minutes, and I’ll reply {contact.responseTime}.
          </p>
          <div className="inquiry-promise">
            <span>01</span>
            <p>
              <strong>A considered fit.</strong>
              <br />
              Useful products and relevant stories come first.
            </p>
          </div>
          <div className="inquiry-promise">
            <span>02</span>
            <p>
              <strong>A clear scope.</strong>
              <br />
              Deliverables, timing, and usage are agreed together.
            </p>
          </div>
          <div className="inquiry-promise">
            <span>03</span>
            <p>
              <strong>A personal reply.</strong>
              <br />
              Your request comes straight to me, not an agency.
            </p>
          </div>
          <Link className="text-link" href="/partnerships">
            Read the partnership guide ↗
          </Link>
          <div className="aside-contact">
            <p>Prefer to talk first?</p>
            <ContactOptions />
          </div>
        </aside>
        <InquiryForm />
      </main>
    </SiteShell>
  );
}
