export const PROFILE_TABS = [
  "Account",
  "Shipping",
  "Orders",
  "Return",
  "Help Center",
] as const;
export type ProfileTab = (typeof PROFILE_TABS)[number];
