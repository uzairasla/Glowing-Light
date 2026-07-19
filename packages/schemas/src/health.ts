import {defineArrayMember, defineField, defineType} from "sanity";

const healthTaxonomy = defineType({
  name: "healthTaxonomy",
  title: "Health Taxonomy",
  type: "document",
  fields: [
    defineField({name: "title", title: "Title", type: "string", validation: (rule) => rule.required()}),
    defineField({name: "slug", title: "Slug", type: "slug", options: {source: "title"}, validation: (rule) => rule.required()}),
    defineField({name: "description", title: "Description", type: "text", rows: 3}),
    defineField({
      name: "parent", title: "Parent taxonomy", type: "reference", to: [{type: "healthTaxonomy"}],
      options: {filter: ({document}) => {
        const id = document._id?.replace(/^drafts\./, "");
        return {filter: "!defined(parent) && _id != $id && _id != $draftId", params: {id, draftId: id ? `drafts.${id}` : ""}};
      }},
    }),
  ],
});

const medicalReviewer = defineType({
  name: "medicalReviewer",
  title: "Medical Reviewer",
  type: "document",
  fields: [
    defineField({name: "name", title: "Name", type: "string", validation: (rule) => rule.required()}),
    defineField({name: "credentials", title: "Credentials", type: "string", validation: (rule) => rule.required()}),
    defineField({name: "bio", title: "Biography", type: "text", rows: 4}),
    defineField({name: "profileUrl", title: "Profile URL", type: "url"}),
  ],
});

const healthArticle = defineType({
  name: "healthArticle",
  title: "Health Article",
  type: "document",
  groups: [
    {name: "content", title: "Content", default: true},
    {name: "review", title: "Medical review"},
    {name: "seo", title: "SEO"},
  ],
  fields: [
    defineField({name: "title", title: "Title", type: "string", group: "content", validation: (rule) => rule.required()}),
    defineField({name: "slug", title: "Slug", type: "slug", group: "content", options: {source: "title"}, validation: (rule) => rule.required()}),
    defineField({name: "description", title: "Description", type: "text", rows: 3, group: "content", validation: (rule) => rule.required().max(180)}),
    defineField({name: "publishedAt", title: "Published at", type: "datetime", group: "content"}),
    defineField({
      name: "taxonomies", title: "Health taxonomies", type: "array", group: "content",
      of: [defineArrayMember({type: "reference", to: [{type: "healthTaxonomy"}]})],
    }),
    defineField({
      name: "body", title: "Body", type: "array", group: "content", validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "block",
          styles: [{title: "Normal", value: "normal"}, {title: "Heading 2", value: "h2"}, {title: "Heading 3", value: "h3"}, {title: "Quote", value: "blockquote"}],
          lists: [{title: "Bullet", value: "bullet"}, {title: "Numbered", value: "number"}],
          marks: {annotations: [defineArrayMember({name: "link", type: "object", fields: [defineField({name: "href", type: "url", validation: (rule) => rule.required().uri({scheme: ["http", "https"]})})]})]},
        }),
        defineArrayMember({name: "healthImage", title: "Image", type: "image", options: {hotspot: true}, fields: [
          defineField({name: "alt", title: "Alternative text", type: "string", validation: (rule) => rule.required()}),
          defineField({name: "caption", title: "Caption", type: "string"}),
        ]}),
        defineArrayMember({name: "healthCallout", title: "Health callout", type: "object", fields: [
          defineField({name: "tone", title: "Tone", type: "string", options: {list: ["Information", "Caution", "When to seek care"]}}),
          defineField({name: "title", title: "Title", type: "string", validation: (rule) => rule.required()}),
          defineField({name: "body", title: "Body", type: "text", rows: 4, validation: (rule) => rule.required()}),
        ]}),
        defineArrayMember({name: "healthSources", title: "Sources", type: "object", fields: [
          defineField({name: "items", title: "Sources", type: "array", of: [defineArrayMember({name: "source", type: "object", fields: [
            defineField({name: "title", title: "Title", type: "string", validation: (rule) => rule.required()}),
            defineField({name: "publisher", title: "Publisher", type: "string"}),
            defineField({name: "url", title: "URL", type: "url", validation: (rule) => rule.required()}),
          ]})], validation: (rule) => rule.required().min(1)}),
        ]}),
      ],
    }),
    defineField({name: "reviewer", title: "Medical reviewer", type: "reference", to: [{type: "medicalReviewer"}], group: "review"}),
    defineField({name: "reviewedAt", title: "Medically reviewed at", type: "datetime", group: "review"}),
    defineField({name: "evidenceNote", title: "Evidence and limitations", type: "text", rows: 4, group: "review"}),
    defineField({name: "medicalDisclaimer", title: "Medical disclaimer", type: "text", rows: 3, group: "review", initialValue: "This article is for general educational purposes and is not a substitute for professional medical advice."}),
    defineField({name: "seoTitle", title: "SEO title", type: "string", group: "seo", validation: (rule) => rule.max(65)}),
    defineField({name: "seoDescription", title: "SEO description", type: "text", rows: 2, group: "seo", validation: (rule) => rule.max(180)}),
    defineField({name: "socialImage", title: "Social image", type: "image", group: "seo", options: {hotspot: true}}),
  ],
  preview: {select: {title: "title", subtitle: "description", media: "socialImage"}},
});

export const healthBlogSchemaTypes = [healthArticle, healthTaxonomy, medicalReviewer];
