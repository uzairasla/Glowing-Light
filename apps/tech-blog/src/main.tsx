import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./App";
import type { TechArticle } from "./tech-article";
import "./styles.css";

declare global {
  interface Window {
    __TECH_ARTICLE__?: TechArticle;
  }
}

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <App article={window.__TECH_ARTICLE__ ?? null} />
  </StrictMode>,
);
