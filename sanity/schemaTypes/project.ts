import { defineArrayMember, defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Client / project name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'sector', type: 'string', description: 'Shown next to the name, e.g. "Aesthetic clinic".' }),
    defineField({
      name: 'disciplines',
      type: 'array',
      description: 'Used for the filters on the Work page.',
      of: [{ type: 'string' }],
      options: { list: ['Branding', 'Production', 'Web design', 'Art direction'] },
    }),
    defineField({ name: 'services', title: 'Service tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'year', type: 'number' }),
    defineField({ name: 'summary', type: 'text', rows: 2, description: 'One line for cards and lists.' }),
    defineField({ name: 'intro', type: 'text', rows: 5, description: 'Opening paragraph on the case study.' }),
    defineField({
      name: 'media',
      title: 'Images',
      description: 'The first image is the cover. Wide images run full width, tall ones are paired.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() })],
        }),
      ],
    }),
    defineField({
      name: 'credits',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [defineField({ name: 'role', type: 'string' }), defineField({ name: 'name', type: 'string' })],
          preview: { select: { title: 'name', subtitle: 'role' } },
        }),
      ],
    }),
    defineField({ name: 'featured', title: 'Show on homepage', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', type: 'number', description: 'Lower numbers come first.' }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'sector', media: 'media.0' } },
})
