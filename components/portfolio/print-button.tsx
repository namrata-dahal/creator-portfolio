"use client";
import posthog from "posthog-js";
const posthogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST,
);
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (posthogConfigured) posthog.capture("media_kit_print_requested");
        window.print();
      }}
    >
      Print / Save as PDF
    </button>
  );
}
