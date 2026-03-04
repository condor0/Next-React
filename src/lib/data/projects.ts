import type { ProjectValues } from '@/forms/schemas'

export type ProjectRecord = ProjectValues & {
  id: string
  createdAt: string
  updatedAt: string
}

const seedProjects: ProjectRecord[] = [
  {
    id: 'alpha',
    name: 'Project Alpha',
    status: 'In progress',
    ownerEmail: 'alpha@company.com',
    description: 'Align research activities with the upcoming release window.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'atlas',
    name: 'Atlas Migration',
    status: 'Planned',
    ownerEmail: 'atlas@company.com',
    description: 'Map data pipelines and agree on ownership for each domain.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'nova',
    name: 'Nova Storybook',
    status: 'In review',
    ownerEmail: 'nova@company.com',
    description: 'Document component coverage and collect review feedback.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/* ── in-memory store (lives for the lifetime of the server process) ── */

const store = new Map<string, ProjectRecord>(
  seedProjects.map((p) => [p.id, p]),
)

/* ── reads ── */

export function listProjects(): ProjectRecord[] {
  return Array.from(store.values())
}

export function getProjectById(id: string): ProjectRecord | null {
  return store.get(id) ?? null
}

/* ── writes ── */

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function ensureUniqueId(baseId: string): string {
  if (!store.has(baseId)) return baseId
  let suffix = 2
  while (store.has(`${baseId}-${suffix}`)) suffix += 1
  return `${baseId}-${suffix}`
}

export function createProject(values: ProjectValues): ProjectRecord {
  const now = new Date().toISOString()
  const id = ensureUniqueId(slugify(values.name) || 'project')
  const project: ProjectRecord = { ...values, id, createdAt: now, updatedAt: now }
  store.set(id, project)
  return project
}

export function updateProject(
  id: string,
  values: ProjectValues,
): ProjectRecord | null {
  const existing = store.get(id)
  if (!existing) return null
  const updated: ProjectRecord = {
    ...existing,
    ...values,
    updatedAt: new Date().toISOString(),
  }
  store.set(id, updated)
  return updated
}
