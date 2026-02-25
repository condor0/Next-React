import type { TaskStatus } from '../forms/schemas'
import { taskStatusOptions } from '../forms/schemas'

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: 'Todo',
  doing: 'Doing',
  done: 'Done',
}

export function getAdjacentTaskStatuses(status: TaskStatus): TaskStatus[] {
  const index = taskStatusOptions.indexOf(status)
  const previous = taskStatusOptions[index - 1]
  const next = taskStatusOptions[index + 1]
  return [previous, next].filter(Boolean) as TaskStatus[]
}

export function getAllowedTaskStatuses(status: TaskStatus): TaskStatus[] {
  return [status, ...getAdjacentTaskStatuses(status)]
}

export function canTransitionTaskStatus(from: TaskStatus, to: TaskStatus) {
  if (from === to) return true
  return getAdjacentTaskStatuses(from).includes(to)
}

let hasRun = false

export function runTaskRuleChecks() {
  if (hasRun || import.meta.env.PROD) return
  hasRun = true

  console.assert(
    canTransitionTaskStatus('todo', 'doing') === true,
    'Task rules: todo -> doing should be allowed.',
  )
  console.assert(
    canTransitionTaskStatus('todo', 'done') === false,
    'Task rules: todo -> done should be blocked.',
  )
  console.assert(
    canTransitionTaskStatus('doing', 'done') === true,
    'Task rules: doing -> done should be allowed.',
  )
  console.assert(
    canTransitionTaskStatus('doing', 'todo') === true,
    'Task rules: doing -> todo should be allowed.',
  )
  console.assert(
    canTransitionTaskStatus('done', 'doing') === true,
    'Task rules: done -> doing should be allowed.',
  )
  console.assert(
    canTransitionTaskStatus('done', 'todo') === false,
    'Task rules: done -> todo should be blocked.',
  )
}
