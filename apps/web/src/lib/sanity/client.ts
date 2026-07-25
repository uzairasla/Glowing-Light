import "server-only";

import { createClient } from "@sanity/client";
import { env } from "@/lib/env";

export const sanityClient = env.NEXT_PUBLIC_SANITY_PROJECT_ID
  ? createClient({
      projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
      useCdn: false,
      perspective: "published",
    })
  : null;

export async function sanityFetch<T>(
  query: string,
  params: Record<string, string> = {},
) {
  if (!sanityClient) {
    return null;
  }

  return sanityClient.fetch<T>(query, params, { cache: "no-store" });
}

const sanityReadToken = process.env.SANITY_API_READ_TOKEN;

const sanityPreviewClient =
  sanityClient && sanityReadToken
    ? sanityClient.withConfig({
        token: sanityReadToken,
        useCdn: false,
        perspective: "drafts",
      })
    : null;

export const isSanityPreviewConfigured = Boolean(sanityPreviewClient);

export async function sanityPreviewFetch<T>(
  query: string,
  params: Record<string, string> = {},
) {
  if (!sanityPreviewClient) {
    return sanityFetch<T>(query, params);
  }

  return sanityPreviewClient.fetch<T>(query, params, { cache: "no-store" });
}
