export const SITE_URL = "https://devfieldnotes.dev";
export const SITE_NAME = "Dev Fieldnotes";

export const AUTHOR = {
  name: "Uzair",
  url: `${SITE_URL}/author`,
  jobTitle: "Software Engineer",
  description:
    "Uzair is a software engineer with more than five years of experience building and evolving production systems with modern web technologies.",
};

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
