import { NextRequest, NextResponse } from 'next/server'
import { listTasksForProject, createTask } from '@/lib/data/tasks'
import { taskSchema } from '@/forms/schemas'

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId')
  if (!projectId) {
    return NextResponse.json(
      { message: 'Missing projectId query parameter.', code: 'MISSING_PARAM' },
      { status: 400 },
    )
  }
  return NextResponse.json(listTasksForProject(projectId))
}

export async function POST(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId')
  if (!projectId) {
    return NextResponse.json(
      { message: 'Missing projectId query parameter.', code: 'MISSING_PARAM' },
      { status: 400 },
    )
  }
  const body = await request.json()
  const parsed = taskSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Validation failed.', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const task = createTask(projectId, parsed.data)
  return NextResponse.json(task, { status: 201 })
}
