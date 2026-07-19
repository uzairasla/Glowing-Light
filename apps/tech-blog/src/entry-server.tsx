import { renderToString } from "react-dom/server";
import { App } from "./App";
import type { TechArticle } from "./tech-article";

export function render(pathname: string, article: TechArticle | null) {
  return renderToString(<App pathname={pathname} article={article} />);
}
