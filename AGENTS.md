# Project content preference

- For English Quran quotations, use Sayyid Abul A'la Maududi's _Tafhim al-Quran_ translation (`en-al-maududi`) unless the user explicitly requests another edition.
- Always retrieve Quran text and translations from the connected quran.ai source before quoting them. Do not rely on memory.

# Deployment and application architecture

- Use Vercel as the only deployment target for this repository.
- Use Next.js for the tech blog and its server-side rendering.
- Do not use, configure, publish, or deploy through OpenAI Sites or a Cloudflare Worker.
- Do not maintain a separate Sites-specific or Cloudflare-specific runtime. Implement routes, Sanity fetching, caching, metadata, and server rendering through the Next.js application.
# Build artifact cleanup

- After running `npm run build`, `pnpm build`, or any other build command for a Next.js app, remove that app's generated `.next` directory once the build result has been recorded.