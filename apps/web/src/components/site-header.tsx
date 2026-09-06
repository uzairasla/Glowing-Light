import Link from "next/link";
import { ChevronDown, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTopics } from "@/lib/content";

const links = [
  { href: "/about", label: "About" },
  { href: "/faith-leaders", label: "Share" },
];

export async function SiteHeader() {
  const topics = await getTopics();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/82 backdrop-blur-xl">
      <div className="container flex min-h-[72px] items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-3 font-extrabold tracking-normal"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-teal to-[#075961] text-white shadow-[0_8px_22px_rgba(13,125,131,.25)]">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <span>Glowing Light</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/journeys" className="hover:text-primary">
            Journeys
          </Link>

          <div className="group relative">
            <Link
              href="/topics"
              className="inline-flex items-center gap-1.5 py-6 hover:text-primary"
              aria-haspopup="true"
            >
              Topics
              <ChevronDown
                className="size-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                aria-hidden="true"
              />
            </Link>

            <div className="invisible absolute left-1/2 top-full z-50 w-[min(64rem,calc(100vw-2rem))] -translate-x-1/2 pt-2 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-2xl border bg-white p-3 text-foreground shadow-xl">
                <div className="flex items-center justify-between gap-6 px-3 pb-3 pt-2">
                  <p className="text-xs font-extrabold uppercase tracking-[.16em] text-teal">
                    Browse topics
                  </p>
                  <Link
                    href="/topics"
                    className="shrink-0 text-sm font-bold text-teal transition hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    View all topics
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-2 lg:grid-cols-4">
                  {topics.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/topics/${topic.slug}`}
                      className="min-w-0 rounded-xl border border-transparent px-3 py-3 transition hover:border-teal-100 hover:bg-teal-50 focus-visible:border-teal-100 focus-visible:bg-teal-50 focus-visible:outline-none"
                    >
                      <span className="block font-bold leading-5 text-navy">
                        {topic.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {topic.articles.length}{" "}
                        {topic.articles.length === 1 ? "article" : "articles"}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/onboarding">Start</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
