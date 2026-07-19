"use client";

import {
  ArrowRight,
  BookOpen,
  Box,
  Check,
  ChevronRight,
  Clock3,
  FileStack,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

const topics = [
  "All",
  "Sanity",
  "AI workflows",
  "Hardware",
  "DevOps",
  "Automation",
];

const latest = [
  {
    number: "01",
    category: "Sanity",
    title: "Sanity content isn\u2019t updating in Next.js",
    description:
      "Trace stale content across drafts, perspectives, the Sanity CDN, Next.js caches, and revalidation without guessing.",
    time: "18 min",
    accent: "lime",
    href: "/guides/sanity-content-not-updating-nextjs",
  },
  {
    number: "02",
    category: "Hardware",
    title: "Build a production-ready wiring harness",
    description:
      "From connector selection to strain relief: the decisions that keep prototypes alive in the field.",
    time: "12 min",
    accent: "blue",
  },
  {
    number: "03",
    category: "Automation",
    title: "Turn a fragile script into a reliable internal tool",
    description:
      "Logging, retries, guardrails, and the few interface choices that make automations trustworthy.",
    time: "10 min",
    accent: "cream",
  },
];

const templates = [
  {
    type: "Notion + Sheets",
    title: "Technical Project Command Center",
    detail:
      "Plan, document, and ship complex builds without losing the thread.",
    price: "$29",
    tag: "BEST SELLER",
  },
  {
    type: "Docs + Checklist",
    title: "Hardware Build & Test Pack",
    detail:
      "Assembly travelers, bring-up sheets, and test records ready to adapt.",
    price: "$39",
    tag: "NEW",
  },
  {
    type: "Notion",
    title: "Engineering Decision Log",
    detail:
      "Capture the why behind important technical calls while it is still fresh.",
    price: "$12",
    tag: "",
  },
];

export function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function subscribe(event: React.FormEvent) {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Fieldnotes home">
          <span className="brand-mark" aria-hidden="true">
            F<span>/</span>N
          </span>
          <span>FIELDNOTES</span>
        </a>
        <nav
          className={menuOpen ? "nav open" : "nav"}
          aria-label="Main navigation"
        >
          <a href="#guides" onClick={() => setMenuOpen(false)}>
            Guides
          </a>
          <a href="#templates" onClick={() => setMenuOpen(false)}>
            Templates
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search">
            <Search size={19} />
          </button>
          <a className="shop-link" href="#templates">
            <ShoppingBag size={17} /> Shop
          </a>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="eyebrow">
            <span>Issue 001</span> Knowledge for people who build
          </div>
          <h1>
            Technical work,
            <br />
            <em>made practical.</em>
          </h1>
          <div className="hero-lower">
            <p>
              Field-tested guides, useful systems, and ready-to-run templates
              for technical people doing real work.
            </p>
            <a className="primary-button" href="#guides">
              Explore today&apos;s guide <ArrowRight size={18} />
            </a>
          </div>
          <div className="hero-aside" aria-hidden="true">
            <span>RESEARCH</span>
            <span>BUILD</span>
            <span>DOCUMENT</span>
            <span>REPEAT</span>
          </div>
        </section>

        <section className="ticker" aria-label="Site highlights">
          <span>
            <Sparkles size={15} /> New practical guide every weekday
          </span>
          <span>///</span>
          <span>Built for engineers, operators & technical teams</span>
          <span>///</span>
          <span>Zero fluff. Useful by lunch.</span>
        </section>

        <section className="content-section" id="guides">
          <div className="section-heading">
            <div>
              <span className="section-index">01 / THE LATEST</span>
              <h2>Start here. Build better.</h2>
            </div>
            <a href="#all-guides">
              View all guides <ArrowRight size={17} />
            </a>
          </div>
          <div className="topic-filter" aria-label="Filter articles">
            {topics.map((topic) => (
              <button
                key={topic}
                className={activeTopic === topic ? "active" : ""}
                onClick={() => setActiveTopic(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
          <div className="article-grid">
            {latest
              .filter(
                (item) =>
                  activeTopic === "All" || item.category === activeTopic,
              )
              .map((item) => (
                <article
                  className={`article-card ${item.accent}`}
                  key={item.number}
                >
                  <div className="article-visual">
                    <span className="article-number">{item.number}</span>
                    <div className="diagram">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="article-category">{item.category}</span>
                  </div>
                  <div className="article-body">
                    <div className="reading-time">
                      <Clock3 size={14} /> {item.time} read
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <a href={item.href ?? "#article"}>
                      Read the field guide <ChevronRight size={16} />
                    </a>
                  </div>
                </article>
              ))}
          </div>
        </section>

        <section className="manifesto" id="about">
          <span className="section-index">02 / WHY FIELDNOTES</span>
          <div className="manifesto-copy">
            <h2>
              We learn by doing.
              <br />
              Then we document it.
            </h2>
            <p>
              The internet has enough theory. Fieldnotes is about the exact
              steps, overlooked details, and reusable tools that move technical
              work forward.
            </p>
          </div>
          <div className="principles">
            <span>
              <Check size={17} /> Tested in real workflows
            </span>
            <span>
              <Check size={17} /> Written for practitioners
            </span>
            <span>
              <Check size={17} /> Updated as tools change
            </span>
          </div>
        </section>

        <section className="template-section" id="templates">
          <div className="template-intro">
            <span className="section-index">03 / THE TOOLKIT</span>
            <h2>Skip the blank page.</h2>
            <p>
              Thoughtful templates built from real technical work. Download
              once, adapt forever.
            </p>
            <a className="dark-button" href="#store">
              Browse all templates <ArrowRight size={18} />
            </a>
          </div>
          <div className="template-list">
            {templates.map((template, index) => (
              <a className="template-card" href="#product" key={template.title}>
                <div className="template-icon">
                  {index === 0 ? (
                    <FileStack />
                  ) : index === 1 ? (
                    <Box />
                  ) : (
                    <BookOpen />
                  )}
                </div>
                <div className="template-copy">
                  <span>{template.type}</span>
                  <h3>{template.title}</h3>
                  <p>{template.detail}</p>
                </div>
                <div className="template-price">
                  {template.tag && <small>{template.tag}</small>}
                  <strong>{template.price}</strong>
                  <ArrowRight size={18} />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="newsletter">
          <div>
            <span className="section-index">THE WEEKLY DISPATCH</span>
            <h2>
              One useful thing,
              <br />
              every Friday.
            </h2>
          </div>
          <div className="newsletter-form-wrap">
            <p>
              Our best guide, a tool worth trying, and one idea to make your
              work better.
            </p>
            {subscribed ? (
              <div className="success">
                <Check /> You&apos;re on the list. See you Friday.
              </div>
            ) : (
              <form onSubmit={subscribe}>
                <label className="sr-only" htmlFor="email">
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button type="submit">
                  Join free <ArrowRight size={17} />
                </button>
              </form>
            )}
            <small>No noise. Unsubscribe whenever.</small>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark">
            F<span>/</span>N
          </span>
          <div>
            <strong>FIELDNOTES</strong>
            <small>Useful knowledge for technical people.</small>
          </div>
        </div>
        <div className="footer-links">
          <a href="#guides">Guides</a>
          <a href="#templates">Templates</a>
          <a href="#about">About</a>
          <a href="mailto:hello@fieldnotes.tools">Contact</a>
        </div>
        <span className="copyright">{"\u00A9"} 2026 Fieldnotes</span>
      </footer>
    </div>
  );
}
