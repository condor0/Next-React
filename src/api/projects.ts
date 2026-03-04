import type { ProjectValues } from '../forms/schemas'
import { fetchJson } from './client'
import type { ProjectRecord } from '../lib/data/projects'

export function listProjects() {
  return fetchJson<ProjectRecord[]>('/api/projects')
}

export function getProject(id: string) {
  return fetchJson<ProjectRecord>(`/api/projects/${encodeURIComponent(id)}`)
}

export function createProjectApi(values: ProjectValues) {
  return fetchJson<ProjectRecord>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export function updateProjectApi(id: string, values: ProjectValues) {
  return fetchJson<ProjectRecord>(`/api/projects/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  })
}

export type { ProjectRecord }
