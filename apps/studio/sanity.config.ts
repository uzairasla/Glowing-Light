import {visionTool} from "@sanity/vision";
import {defineConfig} from "sanity";
import {structureTool, type StructureBuilder, type StructureResolver} from "sanity/structure";
import {
  glowingLightSchemaTypes,
  healthBlogSchemaTypes,
  techBlogSchemaTypes,
} from "@guiding-light/schemas";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  "";
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";

function taxonomyStructure(
  S: StructureBuilder,
  options: {articleType: string; taxonomyType: string; articleTitle: string; taxonomyTitle: string},
) {
  const {articleType, taxonomyType, articleTitle, taxonomyTitle} = options;

  return S.list()
    .title("Content")
    .items([
      S.documentTypeListItem(articleType).title(articleTitle),
      S.listItem()
        .title(taxonomyTitle)
        .child(
          S.documentList()
            .title(`Top-level ${taxonomyTitle.toLowerCase()}`)
            .schemaType(taxonomyType)
            .filter(`_type == $taxonomyType && !defined(parent)`)
            .params({taxonomyType})
            .child((parentId) =>
              S.list()
                .title("Taxonomy")
                .items([
                  S.listItem()
                    .title("Edit taxonomy")
                    .child(S.document().schemaType(taxonomyType).documentId(parentId)),
                  S.listItem()
                    .title("Child taxonomies")
                    .child(
                      S.documentList()
                        .title("Child taxonomies")
                        .schemaType(taxonomyType)
                        .filter(`_type == $taxonomyType && parent._ref == $parentId`)
                        .params({taxonomyType, parentId}),
                    ),
                  S.listItem()
                    .title("Tagged articles")
                    .child(
                      S.documentList()
                        .title(articleTitle)
                        .schemaType(articleType)
                        .filter(`_type == $articleType && references($parentId)`)
                        .params({articleType, parentId}),
                    ),
                ]),
            ),
        ),
    ]);
}

const glowingLightStructure: StructureResolver = (S) =>
  taxonomyStructure(S, {
    articleType: "article",
    taxonomyType: "taxonomy",
    articleTitle: "Glowing Light Articles",
    taxonomyTitle: "Glowing Light Taxonomies",
  });

const healthBlogStructure: StructureResolver = (S) =>
  S.list()
    .title("Health Blog")
    .items([
      S.documentTypeListItem("healthArticle").title("Health Articles"),
      S.documentTypeListItem("healthTaxonomy").title("Health Taxonomies"),
      S.documentTypeListItem("medicalReviewer").title("Medical Reviewers"),
    ]);

const techBlogStructure: StructureResolver = (S) =>
  S.list()
    .title("Tech Blog")
    .items([
      S.documentTypeListItem("techArticle").title("Tech Articles"),
      S.documentTypeListItem("techTaxonomy").title("Tech Taxonomies"),
      S.documentTypeListItem("techSeries").title("Article Series"),
      S.documentTypeListItem("techAuthor").title("Tech Authors"),
    ]);

export default defineConfig([
  {
    name: "glowing-light",
    title: "Glowing Light",
    subtitle: "Faith, learning, and journeys",
    projectId,
    dataset,
    basePath: "/glowing-light",
    plugins: [structureTool({structure: glowingLightStructure}), visionTool()],
    schema: {types: glowingLightSchemaTypes},
  },
  {
    name: "health-blog",
    title: "Health Blog",
    subtitle: "Evidence-aware health publishing",
    projectId,
    dataset,
    basePath: "/health-blog",
    plugins: [structureTool({structure: healthBlogStructure}), visionTool()],
    schema: {types: healthBlogSchemaTypes},
  },
  {
    name: "tech-blog",
    title: "Tech Blog",
    subtitle: "Technical guides and templates",
    projectId,
    dataset,
    basePath: "/tech-blog",
    plugins: [structureTool({structure: techBlogStructure}), visionTool()],
    schema: {types: techBlogSchemaTypes},
  },
]);
