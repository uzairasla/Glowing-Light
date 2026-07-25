import type { Metadata } from "next";
import { ArrowRight, Check, CircleDot, Database, FileCheck2, LockKeyhole, Wrench } from "lucide-react";
import "./product.css";

export const metadata: Metadata = {
  title: "PostgreSQL MCP Starter Kit",
  description: "Turn an approved PostgreSQL or Supabase schema into typed, production-oriented MCP tools without exposing arbitrary SQL.",
  alternates: { canonical: "/mcp-starter-kit" },
};

const features = [
  { icon: Database, index: "01", title: "Discover the schema", copy: "Inspect one PostgreSQL or Supabase schema with a development-only connection. Raw discovery data stays out of the runtime." },
  { icon: FileCheck2, index: "02", title: "Approve the surface", copy: "Review every entity, operation, field, row limit, and potentially sensitive column before a tool is generated." },
  { icon: Wrench, index: "03", title: "Generate typed tools", copy: "Create deterministic TypeScript tools with strict Zod inputs, fixed identifiers, pagination, and parameterized queries." },
];
const included = [
  "TypeScript MCP server on the official SDK", "PostgreSQL and Supabase schema discovery",
  "Interactive allowlist approval", "Search, get, create, update, and delete generators",
  "Doctor command with corrective diagnostics", "Unit and opt-in PostgreSQL integration tests",
  "Dockerfile and cross-platform CI", "Customer demo and Codex configuration example",
];

export default function McpStarterKitPage() {
  return (
    <div className="site-shell product-page">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Dev Fieldnotes home"><span className="brand-mark" aria-hidden="true">D<span>/</span>F</span><span>DEV FIELDNOTES</span></a>
        <nav className="product-nav" aria-label="Main navigation"><a href="/guides">Guides</a><a href="/author">Author</a><a className="product-nav-cta" href="/kits">All kits</a></nav>
      </header>
      <main>
        <section className="product-hero">
          <div className="product-hero-copy">
            <div className="product-kicker"><span><CircleDot size={12} /> Private beta</span><span>v0.3.0</span></div>
            <h1>Your database.<br /><em>Approved tools.</em><br />Ready for MCP.</h1>
            <p>A production-oriented TypeScript starter kit that turns a reviewed PostgreSQL or Supabase schema into safe, typed MCP tools.</p>
            <div className="product-actions"><a className="primary-button" href="#launch">Get launch updates <ArrowRight size={18} /></a><a className="text-link" href="#workflow">See how it works</a></div>
          </div>
          <div className="product-terminal" aria-label="Example starter-kit workflow">
            <div className="terminal-bar"><span /><span /><span /><strong>mcp-starter â€” terminal</strong></div>
            <div className="terminal-body">
              <p><span>$</span> npm run discover</p><p className="terminal-muted">Found public.customers</p><p className="terminal-success">âœ“ approved search, get, create</p>
              <p><span>$</span> npm run generate</p><p className="terminal-success">âœ“ generated 3 typed tools</p><p><span>$</span> npm run doctor</p>
              <div className="terminal-report"><p>PASS <b>Runtime environment</b></p><p>PASS <b>Generated files</b></p><p>PASS <b>Runtime database</b></p></div>
              <p className="terminal-cursor"><span>$</span> <i /></p>
            </div>
          </div>
        </section>
        <section className="product-strip" aria-label="Product highlights"><span>PostgreSQL + Supabase</span><span>///</span><span>Node.js 22+</span><span>///</span><span>TypeScript + Zod</span><span>///</span><span>STDIO MCP</span></section>
        <section className="workflow" id="workflow">
          <div className="product-section-heading"><span className="section-index">01 / THE WORKFLOW</span><h2>From schema to tools,<br />with a human in the loop.</h2><p>Discovery never becomes runtime access by accident. You decide exactly what the model can see and do before generation.</p></div>
          <div className="workflow-grid">{features.map(({ icon: Icon, index, title, copy }) => <article className="workflow-card" key={index}><div><Icon size={22} /><span>{index}</span></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </section>
        <section className="security-section">
          <div className="security-copy"><span className="section-index">02 / BUILT FOR RESTRAINT</span><LockKeyhole size={36} /><h2>No arbitrary SQL.<br />No surprise access.</h2><p>The model only gets generated tools backed by reviewed identifiers, strict inputs, parameterized values, bounded results, and your database role&apos;s permissions.</p></div>
          <div className="security-rules">{[
            ["Separate credentials", "Discovery access never falls back into the runtime."], ["Writes start off", "Newly discovered write operations are disabled by default."],
            ["One record at a time", "Updates and deletes require an explicit primary key."], ["Failure stays safe", "Generation validates before atomically replacing output."],
          ].map(([title, copy]) => <div key={title}><Check size={18} /><span><strong>{title}</strong><small>{copy}</small></span></div>)}</div>
        </section>
        <section className="included-section">
          <div className="included-intro"><span className="section-index">03 / IN THE KIT</span><h2>The boring parts,<br /><em>already handled.</em></h2><p>Start from a tested foundation instead of stitching together a protocol server, database layer, generator, and safety model.</p></div>
          <div className="included-list">{included.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p><Check size={17} /></div>)}</div>
        </section>
        <section className="launch-section" id="launch">
          <div><span className="section-index">04 / PRIVATE BETA</span><h2>Be first in line.</h2></div>
          <div className="launch-copy"><p>The starter kit is being prepared for its first commercial release. Join the launch list for availability, early-access pricing, and the field notes behind the build.</p><a className="primary-button" href="mailto:hello@devfieldnotes.dev?subject=MCP%20Starter%20Kit%20launch%20list">Join the launch list <ArrowRight size={18} /></a><small>No checkout yet. No invented ship date. Just a note when it is ready.</small></div>
        </section>
      </main>
      <footer><div className="footer-brand"><span className="brand-mark">D<span>/</span>F</span><div><strong>DEV FIELDNOTES</strong><small>Build notes for production-minded developers.</small></div></div><div className="footer-links"><a href="/guides">Guides</a><a href="/kits">Kits</a><a href="/author">Author</a></div><span className="copyright">{"\u00A9"} 2026 Dev Fieldnotes</span></footer>
    </div>
  );
}
