import type { ProjectValues } from '../forms/schemas'
import {
  createProject,
  getProjectById,
  loadProjects,
  updateProject,
  type ProjectRecord,
} from '../state/projectsStore'
import { ApiClientError, request } from './client'

const DEFAULT_DELAY = 300

export function listProjects() {
  return request(() => loadProjects(), { delayMs: DEFAULT_DELAY })
}

export function getProject(id: string) {
  return request(
    () => {
      const project = getProjectById(id)
      if (!project) {
        throw new ApiClientError('Project not found.', {
          status: 404,
          code: 'PROJECT_NOT_FOUND',
        })
      }
      return project
    },
    { delayMs: DEFAULT_DELAY },
  )
}

export function createProjectApi(values: ProjectValues) {
  return request(() => {
    const projects = loadProjects()
    const { project } = createProject(values, projects)
    return project
  },
  { delayMs: DEFAULT_DELAY })
}

export function updateProjectApi(id: string, values: ProjectValues) {
  return request(() => {
    const projects = loadProjects()
    if (!projects.some((project) => project.id === id)) {
      throw new ApiClientError('Project not found.', {
        status: 404,
        code: 'PROJECT_NOT_FOUND',
      })
    }
    const nextProjects = updateProject(id, values, projects)
    const updated = nextProjects.find((project) => project.id === id)
    if (!updated) {
      throw new ApiClientError('Unable to update project.', {
        status: 500,
        code: 'PROJECT_UPDATE_FAILED',
      })
    }
    return updated
  },
  { delayMs: DEFAULT_DELAY })
}

export type { ProjectRecord }
