import { cp, mkdir, readFile, writeFile } from "node:fs/promises";

await mkdir(new URL("../dist/server/", import.meta.url), { recursive: true });
await mkdir(new URL("../dist/.openai/", import.meta.url), { recursive: true });
await cp(
  new URL("../.openai/hosting.json", import.meta.url),
  new URL("../dist/.openai/hosting.json", import.meta.url),
);
const manifest = JSON.parse(
  await readFile(
    new URL("../dist/.vite/manifest.json", import.meta.url),
    "utf8",
  ),
);
const clientEntry = manifest["index.html"];
if (!clientEntry?.file)
  throw new Error("Vite client entry is missing from the build manifest.");
const cssLinks = (clientEntry.css ?? [])
  .map((href) => `<link rel="stylesheet" href="/${href}">`)
  .join("");

await writeFile(
  new URL("../dist/server/index.js", import.meta.url),
  `import {render} from "./entry-server.js";
const ARTICLE_PATH = "/guides/sanity-content-not-updating-nextjs";
const ARTICLE_QUERY = \`*[_type == "techArticle" && slug.current == $slug][0]{_id,title,"slug":slug.current,description,publishedAt,updatedAt,readTime,kicker,body,"taxonomies":taxonomies[]->title,sourceUrls,"coverImageUrl":coalesce(coverImage.asset->url, "/articles/sanity-content-not-updating/cover.png"),"coverImageAlt":coalesce(coverImage.alt, "A diagnostic content pipeline showing an update blocked at a cache layer between a CMS and website"),seoTitle,seoDescription}\`;
function escapeHtml(value = "") { return value.replace(/[&<>"']/g, (character) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[character])); }
function documentHtml(app, article) {
  const title = article?.seoTitle || article?.title || "Fieldnotes - Practical guides for technical work";
  const description = article?.seoDescription || article?.description || "Field-tested technical guides and ready-to-use templates for people who build.";
  const serialized = JSON.stringify(article).replace(/</g, "\\\\u003c");
  return \`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#11110f"><title>\${escapeHtml(title)}</title><meta name="description" content="\${escapeHtml(description)}">${cssLinks}<script type="module" src="/${clientEntry.file}"></script></head><body><div id="root">\${app}</div><script>window.__TECH_ARTICLE__=\${serialized}</script></body></html>\`;
}
async function getArticle(env) {
  const projectId = env.SANITY_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;
  const dataset = env.SANITY_DATASET || env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = env.SANITY_API_VERSION || env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-18";
  const url = new URL(\`https://\${projectId}.api.sanity.io/v\${apiVersion}/data/query/\${dataset}\`);
  url.searchParams.set("query", ARTICLE_QUERY); url.searchParams.set("$slug", JSON.stringify("sanity-content-not-updating-nextjs")); url.searchParams.set("perspective", "published");
  const response = await fetch(url, {headers: env.SANITY_API_READ_TOKEN ? {Authorization: \`Bearer \${env.SANITY_API_READ_TOKEN}\`} : {}});
  if (!response.ok) throw new Error(\`Sanity query failed with \${response.status}\`);
  return (await response.json()).result;
}
export default { async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname.includes(".")) return env.ASSETS.fetch(request);
  try {
    const article = url.pathname === ARTICLE_PATH ? await getArticle(env) : null;
    if (url.pathname === ARTICLE_PATH && !article) return new Response("The article has not been published in Sanity yet.", {status: 404});
    return new Response(documentHtml(render(url.pathname, article), article), {headers: {"content-type":"text/html; charset=UTF-8","cache-control":"public, max-age=0, s-maxage=60"}});
  } catch (error) { console.error(error); return new Response("The article could not be loaded.", {status: 502}); }
}};
`,
);
