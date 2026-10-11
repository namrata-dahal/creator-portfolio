"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  formats,
  budgets,
  inquirySchema,
  type InquiryInput,
} from "@/lib/inquiry-schema";
import { contact } from "@/lib/portfolio";
import posthog from "posthog-js";
const posthogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST,
);
const initial: InquiryInput = {
  name: "",
  email: "",
  brand: "",
  website: "",
  objective: "Brand awareness",
  format: "Sponsored short-form video",
  budget: "NPR 10,000–25,000",
  platforms: ["Instagram"],
  timeline: "",
  usage: "Not sure yet",
  details: "",
  consent: true,
};
export function InquiryForm() {
  const [data, setData] = useState(initial),
    [step, setStep] = useState(0),
    [token, setToken] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [receipt, setReceipt] = useState(""),
    [consent, setConsent] = useState(false),
    [confirmed, setConfirmed] = useState(false);
  const reduce = useReducedMotion();
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const trap = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const preferred = new URLSearchParams(window.location.search).get("format");
    if (formats.includes(preferred as (typeof formats)[number]))
      setData((d) => ({ ...d, format: preferred as (typeof formats)[number] }));
    let active = true;
    fetch("/api/inquiries/token", { cache: "no-store" })
      .then(async (r) => {
        const j = (await r.json()) as { token: string; error?: string };
        if (!r.ok) throw new Error(j.error);
        if (active) setToken(j.token);
      })
      .catch(() => {
        if (active)
          setError(
            "The form could not connect. Refresh to retry, or contact me on Instagram.",
          );
      });
    return () => {
      active = false;
    };
  }, []);
  function update<K extends keyof InquiryInput>(
    key: K,
    value: InquiryInput[K],
  ) {
    setData((d) => ({ ...d, [key]: value }));
    setError("");
  }
  function next() {
    if (!form.current?.reportValidity()) return;
    if (step === 1 && data.platforms.length === 0) {
      setError("Choose at least one platform.");
      return;
    }
    if (posthogConfigured)
      posthog.capture("inquiry_step_completed", {
        completed_step: step + 1,
        collaboration_format: data.format,
      });
    setError("");
    setStep((s) => s + 1);
    setTimeout(() => heading.current?.focus(), 0);
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 2) {
      next();
      return;
    }
    if (!consent) {
      setError("Please agree to the privacy notice.");
      return;
    }
    const parsed = inquirySchema.safeParse({ ...data, consent });
    if (!parsed.success) {
      setError(
        parsed.error.issues[0].message + " Use Edit to review your details.",
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          token,
          hpCheck: trap.current?.value || "",
        }),
      });
      const result = (await r.json()) as {
        id: string;
        confirmationSent?: boolean;
        error?: string;
      };
      if (!r.ok)
        throw new Error(result.error || "Could not save your request.");
      if (posthogConfigured)
        posthog.capture("collaboration_inquiry_submitted", {
          collaboration_format: parsed.data.format,
          budget_range: parsed.data.budget,
          objective: parsed.data.objective,
          platform_count: parsed.data.platforms.length,
          intended_usage: parsed.data.usage,
        });
      setConfirmed(!!result.confirmationSent);
      setReceipt(result.id);
      setTimeout(() => heading.current?.focus(), 0);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not send your request. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (receipt)
    return (
      <div className="form-panel success-panel">
        <span className="success-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />
          </svg>
        </span>
        <p className="eyebrow">REQUEST RECEIVED</p>
        <h2 tabIndex={-1} ref={heading}>
          Thank you,
          <br />
          <em>{data.name.split(" ")[0]}.</em>
        </h2>
        <p>
          Your brief is with me. I’ll reply {contact.responseTime} at{" "}
          <strong>{data.email}</strong>.
          {confirmed
            ? " A copy of your request is on its way to your inbox."
            : ""}
        </p>
        <p className="receipt">Reference: {receipt}</p>
        <p className="small-note">
          This is a request, not a confirmed booking. We’ll agree the scope,
          timing and fee together.
        </p>
        <a className="button dark" href="/work">
          Explore more work <span>↗</span>
        </a>
      </div>
    );
  return (
    <form ref={form} onSubmit={submit} className="form-panel">
      <ol className="form-progress" aria-label="Request progress">
        {["Your brand", "The campaign", "Review & send"].map((s, i) => (
          <li
            key={s}
            aria-current={step === i ? "step" : undefined}
            className={step >= i ? "current" : ""}
          >
            <span>{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <h2 ref={heading} tabIndex={-1}>
        {
          [
            "Let’s meet your brand.",
            "What shall we create?",
            "A quick final look.",
          ][step]
        }
      </h2>
      <p className="form-lead">
        {
          [
            "A little context helps me understand the fit.",
            "Tell me the scope you have in mind.",
            "Check your details before sending your request.",
          ][step]
        }
      </p>
      <div className="honeypot" aria-hidden="true">
        {/* Label and name must avoid autofill keywords (company, name, email...) or browsers fill this trap and real requests get rejected. */}
        <label>
          Leave this empty
          <input
            ref={trap}
            name="hp_check"
            tabIndex={-1}
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
          />
        </label>
      </div>
      <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
      {step === 0 ? (
        <fieldset>
          <legend className="sr-only">Your brand details</legend>
          <div className="form-row">
            <label>
              Your name *
              <input
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Full name"
              />
            </label>
            <label>
              Work email *
              <input
                type="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@brand.com"
              />
            </label>
          </div>
          <label>
            Brand / company *
            <input
              value={data.brand}
              onChange={(e) => update("brand", e.target.value)}
              autoComplete="organization"
              required
              minLength={2}
              maxLength={150}
              placeholder="Your brand name"
            />
          </label>
          <label>
            Brand website <span className="optional">(optional)</span>
            <input
              type="url"
              value={data.website}
              onChange={(e) => update("website", e.target.value)}
              maxLength={300}
              placeholder="https://yourbrand.com"
            />
          </label>
          <label>
            Your main goal *
            <select
              value={data.objective}
              onChange={(e) =>
                update("objective", e.target.value as InquiryInput["objective"])
              }
            >
              {[
                "Brand awareness",
                "Product launch",
                "Leads or sign-ups",
                "Content production",
                "Other",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Tell me about the product and your idea *
            <textarea
              value={data.details}
              onChange={(e) => update("details", e.target.value)}
              required
              minLength={20}
              maxLength={4000}
              rows={4}
              placeholder="What do you offer, who is it for, and what would you like the content to achieve?"
            />
          </label>
        </fieldset>
      ) : null}
      {step === 1 ? (
        <fieldset>
          <legend className="sr-only">Campaign details</legend>
          <label>
            Collaboration format *
            <select
              value={data.format}
              onChange={(e) =>
                update("format", e.target.value as InquiryInput["format"])
              }
            >
              {formats.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <div className="platform-field">
            <span>Platforms *</span>
            <div className="platform-choices">
              {[
                "YouTube",
                "TikTok",
                "Instagram",
                "Facebook",
                "Brand channels",
              ].map((p) => (
                <label key={p}>
                  <input
                    type="checkbox"
                    checked={data.platforms.includes(
                      p as InquiryInput["platforms"][number],
                    )}
                    onChange={(e) =>
                      update(
                        "platforms",
                        e.target.checked
                          ? [
                              ...data.platforms,
                              p as InquiryInput["platforms"][number],
                            ]
                          : data.platforms.filter((x) => x !== p),
                      )
                    }
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-row">
            <label>
              Budget range *
              <select
                value={data.budget}
                onChange={(e) =>
                  update("budget", e.target.value as InquiryInput["budget"])
                }
              >
                {budgets.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Intended content usage *
              <select
                value={data.usage}
                onChange={(e) =>
                  update("usage", e.target.value as InquiryInput["usage"])
                }
              >
                {[
                  "Organic use only",
                  "Paid advertising",
                  "Organic and paid advertising",
                  "Not sure yet",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Ideal timing / deadline *
            <input
              value={data.timeline}
              onChange={(e) => update("timeline", e.target.value)}
              required
              minLength={2}
              maxLength={150}
              placeholder="e.g. A launch next month, with flexible posting dates"
            />
          </label>
          <div className="form-help">
            <strong>Not sure about the format?</strong>
            <p>
              Choose “Help me choose” and share your goal. The final
              deliverables, fee, and rights will be agreed before production.
            </p>
          </div>
        </fieldset>
      ) : null}
      {step === 2 ? (
        <div>
          <div className="review-block">
            <div>
              <h3>Your brand</h3>
              <button type="button" onClick={() => setStep(0)}>
                Edit
              </button>
            </div>
            <p>
              <strong>{data.brand}</strong>
              <br />
              {data.name} · {data.email}
            </p>
            {data.website ? <p>{data.website}</p> : null}
            <p>{data.objective}</p>
            <p className="preserve-lines">{data.details}</p>
          </div>
          <div className="review-block">
            <div>
              <h3>The campaign</h3>
              <button type="button" onClick={() => setStep(1)}>
                Edit
              </button>
            </div>
            <p>
              {data.format}
              <br />
              {data.platforms.join(", ")}
              <br />
              {data.budget}
              <br />
              {data.timeline}
              <br />
              {data.usage}
            </p>
          </div>
          <label className="consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>
              I agree to my details being stored to review and respond to this
              inquiry, as described in the{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                privacy notice
              </a>
              .
            </span>
          </label>
        </div>
      ) : null}
      </motion.div>
      </AnimatePresence>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="form-controls">
        {step > 0 ? (
          <button
            type="button"
            className="button outline"
            onClick={() => {
              setStep((s) => s - 1);
              setError("");
            }}
            disabled={busy}
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <button className="button dark" type="submit">
            Continue <span>→</span>
          </button>
        ) : (
          <button
            className="button dark"
            type="submit"
            disabled={busy || !token}
          >
            {busy ? "Sending…" : "Send collaboration request"} <span>↗</span>
          </button>
        )}
      </div>
      <p className="form-note">
        Your request is saved only when you send it. No booking or payment is
        created.
      </p>
    </form>
  );
}
