import type { TaskStatus, TaskValues } from '../forms/schemas'
import { taskStatusOptions } from '../forms/schemas'
import { canTransitionTaskStatus, runTaskRuleChecks } from '../utils/taskRules'

export type TaskRecord = TaskValues & {
  id: string
  projectId: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'day7-tasks'

const defaultTasks: TaskRecord[] = [
  {
    id: 'alpha-kickoff',
    projectId: 'alpha',
    title: 'Kickoff summary',
    description: 'Align on scope, owners, and milestone dates.',
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'alpha-risks',
    projectId: 'alpha',
    title: 'Risk register',
    description: 'Capture top 3 risks and mitigation owners.',
    status: 'doing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'atlas-dependencies',
    projectId: 'atlas',
    title: 'Dependency list',
    description: 'Document upstream services and SLAs.',
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'nova-review',
    projectId: 'nova',
    title: 'Component review',
    description: 'Schedule review with design and QA.',
    status: 'done',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

runTaskRuleChecks()

function safeParse(value: string | null): TaskRecord[] | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as TaskRecord[]
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

export function loadTasks(): TaskRecord[] {
  const storage = getStorage()
  if (!storage) return [...defaultTasks]

  const stored = safeParse(storage.getItem(STORAGE_KEY))
  if (!stored || stored.length === 0) return [...defaultTasks]

  const byId = new Map(defaultTasks.map((task) => [task.id, task]))
  stored.forEach((task) => {
    byId.set(task.id, task)
  })

  return Array.from(byId.values())
}

export function saveTasks(tasks: TaskRecord[]) {
  const storage = getStorage()
  if (!storage) return
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function listTasksForProject(projectId: string): TaskRecord[] {
  return loadTasks().filter((task) => task.projectId === projectId)
}

export function getTaskById(taskId: string): TaskRecord | null {
  return loadTasks().find((task) => task.id === taskId) ?? null
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function ensureUniqueId(baseId: string, tasks: TaskRecord[]) {
  if (!tasks.some((task) => task.id === baseId)) return baseId
  let suffix = 2
  let nextId = `${baseId}-${suffix}`
  while (tasks.some((task) => task.id === nextId)) {
    suffix += 1
    nextId = `${baseId}-${suffix}`
  }
  return nextId
}

function resolveStatus(status?: TaskStatus) {
  return status ?? taskStatusOptions[0]
}

export function createTask(projectId: string, values: TaskValues, tasks: TaskRecord[]) {
  const now = new Date().toISOString()
  const baseId = slugify(values.title) || 'task'
  const id = ensureUniqueId(baseId, tasks)
  const task: TaskRecord = {
    ...values,
    status: resolveStatus(values.status),
    id,
    projectId,
    createdAt: now,
    updatedAt: now,
  }
  const nextTasks = [task, ...tasks]
  saveTasks(nextTasks)
  return { task, tasks: nextTasks }
}

export function updateTask(taskId: string, values: TaskValues, tasks: TaskRecord[]) {
  const now = new Date().toISOString()
  const nextTasks = tasks.map((task) => {
    if (task.id !== taskId) return task
    if (!canTransitionTaskStatus(task.status, values.status)) {
      throw new Error('Invalid task status transition.')
    }
    return {
      ...task,
      ...values,
      updatedAt: now,
    }
  })

  saveTasks(nextTasks)
  return nextTasks
}

export function moveTaskStatus(
  taskId: string,
  status: TaskStatus,
  tasks: TaskRecord[],
) {
  const now = new Date().toISOString()
  const nextTasks = tasks.map((task) => {
    if (task.id !== taskId) return task
    if (!canTransitionTaskStatus(task.status, status)) {
      throw new Error('Invalid task status transition.')
    }
    return {
      ...task,
      status,
      updatedAt: now,
    }
  })

  saveTasks(nextTasks)
  return nextTasks
}
