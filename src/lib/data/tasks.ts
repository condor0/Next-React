import type { TaskStatus, TaskValues } from '@/forms/schemas'

export type TaskRecord = TaskValues & {
  id: string
  projectId: string
  createdAt: string
  updatedAt: string
}

const seedTasks: TaskRecord[] = [
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

/* ── in-memory store ── */

const store = new Map<string, TaskRecord>(seedTasks.map((t) => [t.id, t]))

/* ── task transition rules (server-side copy) ── */

const statusOrder: TaskStatus[] = ['todo', 'doing', 'done']

function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  if (from === to) return true
  const fromIdx = statusOrder.indexOf(from)
  const toIdx = statusOrder.indexOf(to)
  return Math.abs(fromIdx - toIdx) === 1
}

/* ── reads ── */

export function listTasksForProject(projectId: string): TaskRecord[] {
  return Array.from(store.values()).filter((t) => t.projectId === projectId)
}

export function getTaskById(taskId: string): TaskRecord | null {
  return store.get(taskId) ?? null
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

export function createTask(projectId: string, values: TaskValues): TaskRecord {
  const now = new Date().toISOString()
  const id = ensureUniqueId(slugify(values.title) || 'task')
  const task: TaskRecord = {
    ...values,
    status: values.status ?? statusOrder[0],
    id,
    projectId,
    createdAt: now,
    updatedAt: now,
  }
  store.set(id, task)
  return task
}

export function updateTask(
  taskId: string,
  values: TaskValues,
): { task: TaskRecord | null; error?: string } {
  const existing = store.get(taskId)
  if (!existing) return { task: null, error: 'TASK_NOT_FOUND' }
  if (!canTransition(existing.status, values.status)) {
    return { task: null, error: 'TASK_STATUS_INVALID' }
  }
  const updated: TaskRecord = {
    ...existing,
    ...values,
    updatedAt: new Date().toISOString(),
  }
  store.set(taskId, updated)
  return { task: updated }
}

export function moveTaskStatus(
  taskId: string,
  status: TaskStatus,
): { task: TaskRecord | null; error?: string } {
  const existing = store.get(taskId)
  if (!existing) return { task: null, error: 'TASK_NOT_FOUND' }
  if (!canTransition(existing.status, status)) {
    return { task: null, error: 'TASK_STATUS_INVALID' }
  }
  const updated: TaskRecord = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  }
  store.set(taskId, updated)
  return { task: updated }
}
