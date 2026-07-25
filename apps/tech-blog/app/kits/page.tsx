import type { Metadata } from "next";
import { ArrowRight, Boxes, Check, FlaskConical, PackageCheck } from "lucide-react";
import "./kits.css";

export const metadata: Metadata = {
  title: "Developer Kits",
  description: "Production-minded starter kits built from real implementation work, with tested foundations and practical field notes.",
  alternates: { canonical: "/kits" },
};

export default function KitsPage() {
  return (
    <div className="site-shell kits-page">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Dev Fieldnotes home"><span className="brand-mark" aria-hidden="true">D<span>/</span>F</span><span>DEV FIELDNOTES</span></a>
        <nav className="kits-nav" aria-label="Main navigation"><a href="/guides">Guides</a><a className="active" href="/kits">Kits</a><a href="/author">Author</a></nav>
      </header>
      <main>
        <section className="kits-hero">
          <div className="kits-orbit" aria-hidden="true"><span /><span /><span /></div>
          <div className="kits-eyebrow"><Boxes size={15} /> Dev Fieldnotes Kits / Catalog 001</div>
          <h1>Skip the blank repo.<br /><em>Start from field-tested.</em></h1>
          <div className="kits-hero-bottom">
            <p>Focused developer kits for the parts of modern systems that take longer to make reliable than they do to prototype.</p>
            <a className="primary-button" href="#catalog">Browse the catalog <ArrowRight size={18} /></a>
          </div>
        </section>

        <section className="kits-principles">
          <span><Check size={16} /> Built from real implementation work</span>
          <span><Check size={16} /> Tested before release</span>
          <span><Check size={16} /> Documentation included</span>
          <span><Check size={16} /> Updated through field notes</span>
        </section>

        <section className="kits-catalog" id="catalog">
          <div className="kits-heading">
            <span className="section-index">01 / THE CATALOG</span>
            <h2>One useful foundation<br />at a time.</h2>
            <p>The catalog will grow as new kits earn their way out of experiments and into repeatable production workflows.</p>
          </div>
          <article className="featured-kit">
            <div className="featured-kit-visual">
              <div className="kit-status"><span /> Private beta · v0.3.0</div>
              <div className="database-stack" aria-hidden="true"><span /><span /><span /></div>
              <div className="kit-code">POSTGRESQL<br />→ APPROVAL<br />→ MCP TOOLS</div>
            </div>
            <div className="featured-kit-copy">
              <span>Kit 001 / AI Infrastructure</span>
              <h3>PostgreSQL MCP Starter Kit</h3>
              <p>Discover a PostgreSQL or Supabase schema, approve the exact model-facing surface, and generate safe typed MCP tools.</p>
              <ul>
                <li>Human-reviewed tool generation</li>
                <li>Strict runtime guardrails</li>
                <li>Diagnostics, tests, CI, and Docker</li>
              </ul>
              <a href="/mcp-starter-kit">Explore this kit <ArrowRight size={17} /></a>
            </div>
          </article>
          <div className="next-kits">
            <div><PackageCheck size={25} /><span><strong>More kits will live here</strong><small>Each release gets its own product page, documentation, changelog, and supporting guides.</small></span></div>
            <div><FlaskConical size={25} /><span><strong>Built in public</strong><small>New ideas begin as field notes. Only tested, reusable systems become kits.</small></span></div>
          </div>
        </section>

        <section className="kits-cta">
          <span className="section-index">02 / FOLLOW THE WORK</span>
          <h2>See what earns<br />a place in the catalog.</h2>
          <div><p>Read the implementation notes, failure reports, and production lessons behind current and future kits.</p><a className="primary-button" href="/guides">Read the field notes <ArrowRight size={18} /></a></div>
        </section>
      </main>
      <footer><div className="footer-brand"><span className="brand-mark">D<span>/</span>F</span><div><strong>DEV FIELDNOTES</strong><small>Tested solutions for modern web development.</small></div></div><div className="footer-links"><a href="/guides">Guides</a><a href="/kits">Kits</a><a href="/author">Author</a></div><span className="copyright">{"\u00A9"} 2026 Dev Fieldnotes</span></footer>
    </div>
  );
}
