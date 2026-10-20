'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'atomik',
  title: 'Atomik Studio',
  basePath: '/admin',
  projectId: projectId || 'missing',
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Site settings').id('settings').child(S.document().schemaType('settings').documentId('settings')),
            S.divider(),
            S.documentTypeListItem('project').title('Projects'),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
