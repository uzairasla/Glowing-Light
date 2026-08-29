import { createClient } from "@sanity/client";
import { env } from "@/lib/env";

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "dis8yhkz";

export const sanityClient = createClient({
  projectId,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false,
  perspective: "published",
});

export async function sanityFetch<T>(
  query: string,
  params: Record<string, string> = {},
) {
  return sanityClient.fetch<T>(query, params, { cache: "no-store" });
}
