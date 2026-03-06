import type { TaskStatus, TaskValues } from '../forms/schemas'
import { fetchJson } from './client'
import type { TaskRecord } from '../lib/data/tasks'

export function listTasks(projectId: string) {
  return fetchJson<TaskRecord[]>(`/api/tasks?projectId=${encodeURIComponent(projectId)}`)
}

export function createTaskApi(projectId: string, values: TaskValues) {
  return fetchJson<TaskRecord>(`/api/tasks?projectId=${encodeURIComponent(projectId)}`, {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export function updateTaskApi(taskId: string, values: TaskValues) {
  return fetchJson<TaskRecord>(`/api/tasks/${encodeURIComponent(taskId)}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  })
}

export function moveTaskStatusApi(taskId: string, status: TaskStatus) {
  return fetchJson<TaskRecord>(`/api/tasks/${encodeURIComponent(taskId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ action: 'move', status }),
  })
}

export type { TaskRecord }
