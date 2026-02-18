import type { ProjectValues } from '../forms/schemas'
import { projectStatusOptions } from '../forms/schemas'

type ProjectRecord = ProjectValues & {
  id: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'day4-projects'

const defaultProjects: ProjectRecord[] = [
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

function safeParse(value: string | null): ProjectRecord[] | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as ProjectRecord[]
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

export function loadProjects(): ProjectRecord[] {
  const storage = getStorage()
  if (!storage) return [...defaultProjects]

  const stored = safeParse(storage.getItem(STORAGE_KEY))
  if (!stored || stored.length === 0) return [...defaultProjects]

  const byId = new Map(defaultProjects.map((project) => [project.id, project]))
  stored.forEach((project) => {
    byId.set(project.id, project)
  })

  return Array.from(byId.values())
}

export function saveProjects(projects: ProjectRecord[]) {
  const storage = getStorage()
  if (!storage) return
  storage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function getProjectById(id: string | undefined): ProjectRecord | null {
  if (!id) return null
  return loadProjects().find((project) => project.id === id) ?? null
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function ensureUniqueId(baseId: string, projects: ProjectRecord[]) {
  if (!projects.some((project) => project.id === baseId)) return baseId
  let suffix = 2
  let nextId = `${baseId}-${suffix}`
  while (projects.some((project) => project.id === nextId)) {
    suffix += 1
    nextId = `${baseId}-${suffix}`
  }
  return nextId
}

export function createProject(values: ProjectValues, projects: ProjectRecord[]) {
  const now = new Date().toISOString()
  const baseId = slugify(values.name) || 'project'
  const id = ensureUniqueId(baseId, projects)
  const project: ProjectRecord = {
    ...values,
    status: values.status || projectStatusOptions[0],
    id,
    createdAt: now,
    updatedAt: now,
  }
  const nextProjects = [project, ...projects]
  saveProjects(nextProjects)
  return { project, projects: nextProjects }
}

export function updateProject(
  id: string,
  values: ProjectValues,
  projects: ProjectRecord[],
) {
  const now = new Date().toISOString()
  const nextProjects = projects.map((project) =>
    project.id === id
      ? {
          ...project,
          ...values,
          updatedAt: now,
        }
      : project,
  )

  saveProjects(nextProjects)
  return nextProjects
}

export type { ProjectRecord }
