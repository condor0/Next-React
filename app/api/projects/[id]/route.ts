import { NextResponse } from 'next/server'
import { getProjectById, updateProject } from '@/lib/data/projects'
import { projectSchema } from '@/forms/schemas'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const project = getProjectById(id)
  if (!project) {
    return NextResponse.json(
      { message: 'Project not found.', code: 'PROJECT_NOT_FOUND' },
      { status: 404 },
    )
  }
  return NextResponse.json(project, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { message: 'Invalid JSON body.', code: 'INVALID_JSON' },
      { status: 400 },
    )
  }
  const parsed = projectSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Validation failed.', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const updated = updateProject(id, parsed.data)
  if (!updated) {
    return NextResponse.json(
      { message: 'Project not found.', code: 'PROJECT_NOT_FOUND' },
      { status: 404 },
    )
  }
  return NextResponse.json(updated)
}
