export const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Contact", path: "/contact" },
  { name: "LMS", path: "/login" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
