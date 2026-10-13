// Single source of truth for the creator-website launch campaign.
// Close this offer manually when 19 bookings are confirmed; a lead is NOT a booking.
// The deadline also closes the offer automatically, even if the manual switch is missed.
export const CREATOR_WEBSITE_OFFER = {
  standardPrice: 9999,
  launchPrice: 4999,
  maxLaunchBookings: 19,
  expiresAt: "2026-10-25T23:59:59+05:45",
  includedRevisions: 1,
} as const;

export function creatorWebsiteLaunchActive() {
  return (
    process.env.CREATOR_WEBSITE_OFFER_ENABLED !== "false" &&
    Date.now() <= Date.parse(CREATOR_WEBSITE_OFFER.expiresAt)
  );
}

export function formatNpr(value: number) {
  return "Rs. " + value.toLocaleString("en-IN");
}
