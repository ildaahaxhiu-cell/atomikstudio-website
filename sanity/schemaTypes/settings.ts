import { defineArrayMember, defineField, defineType } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'instagram', type: 'url' }),
    defineField({ name: 'city', type: 'string', initialValue: 'Tirana' }),
    defineField({ name: 'country', type: 'string', initialValue: 'Albania' }),
    defineField({ name: 'heroLine', title: 'Homepage intro line', type: 'text', rows: 2 }),
    defineField({ name: 'statement', title: 'Studio statement', type: 'text', rows: 4 }),
    defineField({ name: 'clients', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({
      name: 'services',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', options: { list: ['Branding', 'Production', 'Web design', 'Art direction'] } }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
            defineField({ name: 'items', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'approach',
      title: 'How we work',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [defineField({ name: 'title', type: 'string' }), defineField({ name: 'text', type: 'text', rows: 3 })],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
