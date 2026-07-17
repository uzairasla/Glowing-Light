import Link from "next/link";
import { MoonStar, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";

const links = [
  { href: "/journeys", label: "Learn" },
  { href: "/questions", label: "Questions" },
  { href: "/my-journey", label: "My Journey" },
  { href: "/guides/new-muslim", label: "New Muslims" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/82 backdrop-blur-xl">
      <div className="container flex min-h-[72px] items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-3 font-extrabold tracking-normal">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-teal to-[#075961] text-white shadow-[0_8px_22px_rgba(13,125,131,.25)]">
            <MoonStar className="size-5" aria-hidden="true" />
          </span>
          <span>Guiding Light</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <form action="/auth/sign-out" method="post" className="hidden sm:block">
                <Button type="submit" variant="secondary" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href="/onboarding">Start</Link>
          </Button>
          <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
            <Menu className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
