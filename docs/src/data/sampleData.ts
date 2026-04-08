import type { GraphData } from '@biki-dev/okve'

export const sampleData: GraphData = {
  nodes: [
    {
      id: '1',
      label: 'React',
      group: 'frontend',
      size: 2,
      metadata: {
        description: 'Component-driven UI library used to build the docs experience.',
        takeaway: 'The docs app should feel native to React developers.',
      },
    },
    {
      id: '2',
      label: 'TypeScript',
      group: 'language',
      size: 1.5,
      metadata: {
        description: 'Keeps the docs data model and navigation contracts type-safe.',
        takeaway: 'Strong types make the docs easier to maintain.',
      },
    },
    {
      id: '3',
      label: 'D3.js',
      group: 'frontend',
      size: 1.2,
      metadata: {
        description: 'Drives the interactive graph rendering and motion in the demo.',
        takeaway: 'Force layouts are a better fit than hard-coded coordinates.',
      },
    },
    {
      id: '4',
      label: 'Vite',
      group: 'tooling',
      size: 1,
      metadata: {
        description: 'Keeps the docs site fast to iterate on during development.',
        takeaway: 'A clean dev server helps the experience stay polished.',
      },
    },
    {
      id: '5',
      label: 'Node.js',
      group: 'runtime',
      size: 1.6,
      metadata: {
        description: 'Provides the runtime that builds and serves the docs site.',
        takeaway: 'Build output and package metadata should stay in sync.',
      },
    },
  ],
  edges: [
    {
      id: 'e1',
      source: '1',
      target: '2',
      label: 'typed with',
      directed: true,
      metadata: {
        reason: 'The docs app uses TypeScript for safer component and data contracts.',
        strength: 'high',
      },
    },
    {
      id: 'e2',
      source: '1',
      target: '3',
      label: 'rendered by',
      directed: true,
      metadata: {
        reason: 'The demo graph depends on D3 for positioning and interaction.',
        strength: 'high',
      },
    },
    {
      id: 'e3',
      source: '4',
      target: '1',
      label: 'builds',
      directed: true,
      metadata: {
        reason: 'Vite powers the local docs build and fast refresh workflow.',
        strength: 'medium',
      },
    },
    {
      id: 'e4',
      source: '5',
      target: '4',
      label: 'runs',
      directed: true,
      metadata: {
        reason: 'Node.js executes the tooling that serves the docs experience.',
        strength: 'medium',
      },
    },
  ],
}
