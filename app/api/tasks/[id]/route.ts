import { NextResponse } from 'next/server'
import { getTaskById, updateTask, moveTaskStatus } from '@/lib/data/tasks'
import { taskSchema } from '@/forms/schemas'
import { z } from 'zod'

type RouteContext = { params: Promise<{ id: string }> }

const moveSchema = z.object({
  action: z.literal('move'),
  status: z.enum(['todo', 'doing', 'done']),
})

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  const body = await request.json()

  /* move-status shorthand: { action: "move", status: "done" } */
  const moveResult = moveSchema.safeParse(body)
  if (moveResult.success) {
    const { task, error } = moveTaskStatus(id, moveResult.data.status)
    if (error === 'TASK_NOT_FOUND') {
      return NextResponse.json({ message: 'Task not found.', code: error }, { status: 404 })
    }
    if (error === 'TASK_STATUS_INVALID') {
      return NextResponse.json({ message: 'Status change not allowed.', code: error }, { status: 400 })
    }
    return NextResponse.json(task)
  }

  /* full update: { title, status, description } */
  const parsed = taskSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Validation failed.', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const { task, error } = updateTask(id, parsed.data)
  if (error === 'TASK_NOT_FOUND') {
    return NextResponse.json({ message: 'Task not found.', code: error }, { status: 404 })
  }
  if (error === 'TASK_STATUS_INVALID') {
    return NextResponse.json({ message: 'Status change not allowed.', code: error }, { status: 400 })
  }
  return NextResponse.json(task)
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const task = getTaskById(id)
  if (!task) {
    return NextResponse.json({ message: 'Task not found.', code: 'TASK_NOT_FOUND' }, { status: 404 })
  }
  return NextResponse.json(task)
}
