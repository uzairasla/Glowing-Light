import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { schemaTypes } from "@guiding-light/schemas";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  "";
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";

const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("article").title("Articles"),
      S.listItem()
        .title("Taxonomies")
        .child(
          S.documentList()
            .title("Layer 1 taxonomies")
            .schemaType("taxonomy")
            .filter('_type == "taxonomy" && !defined(parent)')
            .child((parentId) =>
              S.list()
                .title("Taxonomy")
                .items([
                  S.listItem()
                    .title("Edit parent")
                    .child(
                      S.document()
                        .schemaType("taxonomy")
                        .documentId(parentId),
                    ),
                  S.listItem()
                    .title("Layer 2 children")
                    .child(
                      S.documentList()
                        .title("Child taxonomies")
                        .schemaType("taxonomy")
                        .filter('_type == "taxonomy" && parent._ref == $parentId')
                        .params({ parentId })
                        .child((childId) =>
                          S.list()
                            .title("Child taxonomy")
                            .items([
                              S.listItem()
                                .title("Edit child")
                                .child(
                                  S.document()
                                    .schemaType("taxonomy")
                                    .documentId(childId),
                                ),
                              S.listItem()
                                .title("Tagged articles")
                                .child(
                                  S.documentList()
                                    .title("Articles")
                                    .schemaType("article")
                                    .filter('_type == "article" && references($childId)')
                                    .params({ childId }),
                                ),
                            ]),
                        ),
                    ),
                  S.listItem()
                    .title("Articles tagged to parent")
                    .child(
                      S.documentList()
                        .title("Articles")
                        .schemaType("article")
                        .filter('_type == "article" && references($parentId)')
                        .params({ parentId }),
                    ),
                ]),
            ),
        ),
    ]);

export default defineConfig({
  name: "guiding-light-studio",
  title: "Guiding Light Studio",
  projectId,
  dataset,
  basePath: "/",
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
