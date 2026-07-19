import { defineArrayMember, defineField, defineType } from "sanity";

const richBodyField = defineField({
  name: "body",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
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
          { title: "Underline", value: "underline" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      name: "imageBlock",
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
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
    defineArrayMember({
      name: "iframe",
      title: "Embed / iframe",
      type: "object",
      fields: [
        defineField({
          name: "url",
          title: "URL",
          type: "url",
          validation: (rule) =>
            rule.required().uri({ scheme: ["http", "https"] }),
        }),
        defineField({
          name: "title",
          title: "Accessible title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "height",
          title: "Height",
          type: "number",
          initialValue: 420,
          validation: (rule) => rule.integer().min(160).max(900),
        }),
      ],
      preview: {
        select: { title: "title", subtitle: "url" },
      },
    }),
    defineArrayMember({
      name: "table",
      title: "Table",
      type: "object",
      fields: [
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
        defineField({
          name: "rows",
          title: "Rows",
          type: "array",
          of: [
            defineArrayMember({
              name: "row",
              title: "Row",
              type: "object",
              fields: [
                defineField({
                  name: "cells",
                  title: "Cells",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                  validation: (rule) => rule.min(1),
                }),
              ],
              preview: {
                select: { cells: "cells" },
                prepare({ cells }: { cells?: string[] }) {
                  return {
                    title: cells?.join(" | ") || "Empty row",
                  };
                },
              },
            }),
          ],
          validation: (rule) => rule.min(1),
        }),
      ],
      preview: {
        select: { title: "caption" },
        prepare({ title }: { title?: string }) {
          return { title: title || "Table" };
        },
      },
    }),
    defineArrayMember({
      name: "horizontalRule",
      title: "Divider",
      type: "object",
      fields: [
        defineField({
          name: "style",
          title: "Style",
          type: "string",
          initialValue: "line",
          options: {
            list: [{ title: "Line", value: "line" }],
          },
          readOnly: true,
        }),
      ],
      preview: {
        prepare() {
          return { title: "Divider" };
        },
      },
    }),
    defineArrayMember({
      name: "lead",
      title: "Lead paragraph",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Text",
          type: "text",
          rows: 4,
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: { title: "text" },
      },
    }),
    defineArrayMember({
      name: "tableOfContents",
      title: "Table of contents",
      type: "object",
      fields: [
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [
            defineArrayMember({
              name: "item",
              title: "Item",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "anchor",
                  title: "Anchor",
                  type: "string",
                  description: "Use the heading id without the #.",
                }),
              ],
            }),
          ],
        }),
      ],
      preview: {
        prepare() {
          return { title: "Table of contents" };
        },
      },
    }),
    defineArrayMember({
      name: "callout",
      title: "Callout",
      type: "object",
      fields: [
        defineField({
          name: "tone",
          title: "Tone",
          type: "string",
          initialValue: "reflection",
          options: {
            list: [
              { title: "Science", value: "science" },
              { title: "Philosophy", value: "philosophy" },
              { title: "Quran", value: "quran" },
              { title: "Reflection", value: "reflection" },
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
      preview: {
        select: { title: "title", subtitle: "tone" },
      },
    }),
    defineArrayMember({
      name: "cardGrid",
      title: "Card grid",
      type: "object",
      fields: [
        defineField({
          name: "cards",
          title: "Cards",
          type: "array",
          of: [
            defineArrayMember({
              name: "card",
              title: "Card",
              type: "object",
              fields: [
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
                  rows: 3,
                  validation: (rule) => rule.required(),
                }),
              ],
            }),
          ],
          validation: (rule) => rule.min(1),
        }),
      ],
      preview: {
        prepare() {
          return { title: "Card grid" };
        },
      },
    }),
    defineArrayMember({
      name: "stepList",
      title: "Numbered steps",
      type: "object",
      fields: [
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [
            defineArrayMember({
              name: "item",
              title: "Item",
              type: "text",
              rows: 3,
            }),
          ],
          validation: (rule) => rule.min(1),
        }),
      ],
      preview: {
        prepare() {
          return { title: "Numbered steps" };
        },
      },
    }),
    defineArrayMember({
      name: "quranVerse",
      title: "Quran verse",
      type: "object",
      fields: [
        defineField({
          name: "arabic",
          title: "Arabic",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "translation",
          title: "Translation",
          type: "text",
          rows: 4,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "reference",
          title: "Reference",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: { title: "reference", subtitle: "translation" },
      },
    }),
    defineArrayMember({
      name: "sideNote",
      title: "Side note",
      type: "object",
      fields: [
        defineField({
          name: "body",
          title: "Body",
          type: "text",
          rows: 4,
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: { title: "body" },
      },
    }),
    defineArrayMember({
      name: "svgFigure",
      title: "SVG figure",
      type: "object",
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "svg",
          title: "SVG markup",
          type: "text",
          rows: 12,
          validation: (rule) =>
            rule.required().custom((value) => {
              if (!value) {
                return true;
              }

              return value.trim().startsWith("<svg")
                ? true
                : "Paste only SVG markup that starts with <svg.";
            }),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "text",
          rows: 2,
        }),
      ],
      preview: {
        select: { title: "alt", subtitle: "caption" },
      },
    }),
    defineArrayMember({
      name: "conclusionPanel",
      title: "Conclusion panel",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
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
          rows: 5,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "finalLine",
          title: "Final line",
          type: "text",
          rows: 3,
        }),
      ],
      preview: {
        select: { title: "title", subtitle: "eyebrow" },
      },
    }),
    defineArrayMember({
      name: "sourceList",
      title: "Source list",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [
            defineArrayMember({
              name: "source",
              title: "Source",
              type: "object",
              fields: [
                defineField({
                  name: "text",
                  title: "Text",
                  type: "text",
                  rows: 3,
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "url",
                  title: "URL",
                  type: "url",
                }),
              ],
            }),
          ],
          validation: (rule) => rule.min(1),
        }),
      ],
      preview: {
        select: { title: "title" },
      },
    }),
  ],
});

const taxonomy = defineType({
  name: "taxonomy",
  title: "Taxonomy",
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
      description:
        "Leave empty for a layer 1 taxonomy. Choose a parent to make this a layer 2 taxonomy.",
      type: "reference",
      to: [{ type: "taxonomy" }],
      options: {
        filter: ({ document }) => {
          const currentId = document._id?.replace(/^drafts\./, "");

          return {
            filter:
              "!defined(parent) && _id != $currentId && _id != $draftId",
            params: {
              currentId,
              draftId: currentId ? `drafts.${currentId}` : "",
            },
          };
        },
      },
    }),
  ],
});

const article = defineType({
  name: "article",
  title: "Article",
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "taxonomies",
      title: "Taxonomies",
      description: "Tag this article to one or more journeys or topic groups.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "taxonomy" }] })],
    }),
    richBodyField,
  ],
});

export const schemaTypes = [article, taxonomy];
export const glowingLightSchemaTypes = schemaTypes;
export {healthBlogSchemaTypes} from "./health";
export {techBlogSchemaTypes} from "./tech";
