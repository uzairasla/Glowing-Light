import { defineArrayMember, defineField, defineType } from "sanity";

const techTaxonomy = defineType({
  name: "techTaxonomy",
  title: "Tech Taxonomy",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "parent",
      title: "Parent taxonomy",
      type: "reference",
      to: [{ type: "techTaxonomy" }],
      options: {
        filter: ({ document }) => {
          const id = document._id?.replace(/^drafts\./, "");
          return {
            filter: "!defined(parent) && _id != $id && _id != $draftId",
            params: { id, draftId: id ? `drafts.${id}` : "" },
          };
        },
      },
    }),
  ],
});

const techAuthor = defineType({
  name: "techAuthor",
  title: "Tech Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "bio", title: "Biography", type: "text", rows: 4 }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "githubUrl", title: "GitHub URL", type: "url" }),
  ],
});

const techSeries = defineType({
  name: "techSeries",
  title: "Article Series",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
});

const techArticle = defineType({
  name: "techArticle",
  title: "Tech Article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "verification", title: "Technical verification" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: "kicker",
      title: "Article kicker",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "readTime",
      title: "Reading time",
      type: "string",
      group: "content",
      description: "For example: 18 min",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "techAuthor" }],
      group: "content",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "content",
    }),
    defineField({
      name: "updatedAt",
      title: "Last verified at",
      type: "datetime",
      group: "verification",
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      group: "content",
      options: { list: ["Beginner", "Intermediate", "Advanced"] },
    }),
    defineField({
      name: "taxonomies",
      title: "Tech taxonomies",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "techTaxonomy" }],
        }),
      ],
    }),
    defineField({
      name: "series",
      title: "Series",
      type: "reference",
      to: [{ type: "techSeries" }],
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Inline code", value: "code" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    validation: (rule) =>
                      rule.required().uri({ scheme: ["http", "https"] }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          name: "techImage",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
        defineArrayMember({
          name: "codeBlock",
          title: "Code block",
          type: "object",
          fields: [
            defineField({
              name: "filename",
              title: "Filename / label",
              type: "string",
            }),
            defineField({
              name: "language",
              title: "Language",
              type: "string",
              options: {
                list: [
                  "typescript",
                  "javascript",
                  "tsx",
                  "jsx",
                  "groq",
                  "json",
                  "bash",
                  "css",
                  "html",
                  "text",
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tone",
              title: "Example type",
              type: "string",
              initialValue: "neutral",
              options: {
                list: [
                  { title: "Neutral", value: "neutral" },
                  { title: "Correct", value: "good" },
                  { title: "Common mistake", value: "bad" },
                ],
              },
            }),
            defineField({
              name: "code",
              title: "Code",
              type: "text",
              rows: 16,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Explanation",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: { title: "filename", subtitle: "language" },
            prepare: ({ title, subtitle }) => ({
              title: title || "Code block",
              subtitle,
            }),
          },
        }),
        defineArrayMember({
          name: "techCallout",
          title: "Technical callout",
          type: "object",
          fields: [
            defineField({
              name: "tone",
              title: "Tone",
              type: "string",
              initialValue: "note",
              options: {
                list: [
                  { title: "Note", value: "note" },
                  { title: "Warning", value: "warning" },
                  { title: "Tip", value: "tip" },
                ],
              },
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "testedVersions",
      title: "Tested versions",
      type: "array",
      group: "verification",
      of: [
        defineArrayMember({
          name: "version",
          type: "object",
          fields: [
            defineField({
              name: "package",
              title: "Package or tool",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "version",
              title: "Version",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "repositoryUrl",
      title: "Example repository",
      type: "url",
      group: "verification",
    }),
    defineField({
      name: "sourceUrls",
      title: "Sources",
      type: "array",
      group: "verification",
      of: [
        defineArrayMember({
          name: "source",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "seo",
      validation: (rule) => rule.max(65),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
      group: "seo",
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: "socialImage",
      title: "Social image",
      type: "image",
      group: "seo",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "socialImage" },
  },
});

export const techBlogSchemaTypes = [
  techArticle,
  techTaxonomy,
  techAuthor,
  techSeries,
];
