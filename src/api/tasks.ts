import type { TaskStatus, TaskValues } from '../forms/schemas'
import {
  createTask,
  getTaskById,
  listTasksForProject,
  loadTasks,
  moveTaskStatus,
  updateTask,
  type TaskRecord,
} from '../state/tasksStore'
import { ApiClientError, request } from './client'
import { canTransitionTaskStatus } from '../utils/taskRules'

const DEFAULT_DELAY = 700

export function listTasks(projectId: string) {
  return request(() => listTasksForProject(projectId), { delayMs: DEFAULT_DELAY })
}

export function createTaskApi(projectId: string, values: TaskValues) {
  return request(
    () => {
      const tasks = loadTasks()
      const { task } = createTask(projectId, values, tasks)
      return task
    },
    { delayMs: DEFAULT_DELAY },
  )
}

export function updateTaskApi(taskId: string, values: TaskValues) {
  return request(
    () => {
      const tasks = loadTasks()
      const existing = getTaskById(taskId)
      if (!existing) {
        throw new ApiClientError('Task not found.', {
          status: 404,
          code: 'TASK_NOT_FOUND',
        })
      }
      if (!canTransitionTaskStatus(existing.status, values.status)) {
        throw new ApiClientError('Status change not allowed.', {
          status: 400,
          code: 'TASK_STATUS_INVALID',
        })
      }
      const nextTasks = updateTask(taskId, values, tasks)
      const updated = nextTasks.find((task) => task.id === taskId)
      if (!updated) {
        throw new ApiClientError('Unable to update task.', {
          status: 500,
          code: 'TASK_UPDATE_FAILED',
        })
      }
      return updated
    },
    { delayMs: DEFAULT_DELAY },
  )
}

export function moveTaskStatusApi(taskId: string, status: TaskStatus) {
  return request(
    () => {
      const tasks = loadTasks()
      const existing = getTaskById(taskId)
      if (!existing) {
        throw new ApiClientError('Task not found.', {
          status: 404,
          code: 'TASK_NOT_FOUND',
        })
      }
      if (!canTransitionTaskStatus(existing.status, status)) {
        throw new ApiClientError('Status change not allowed.', {
          status: 400,
          code: 'TASK_STATUS_INVALID',
        })
      }
      const nextTasks = moveTaskStatus(taskId, status, tasks)
      const updated = nextTasks.find((task) => task.id === taskId)
      if (!updated) {
        throw new ApiClientError('Unable to move task.', {
          status: 500,
          code: 'TASK_MOVE_FAILED',
        })
      }
      return updated
    },
    { delayMs: DEFAULT_DELAY },
  )
}

export type { TaskRecord }
