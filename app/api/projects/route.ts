import { NextResponse } from 'next/server'
import { listProjects, createProject } from '@/lib/data/projects'
import { projectSchema } from '@/forms/schemas'

export async function GET() {
  return NextResponse.json(listProjects(), {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}

export async function POST(request: Request) {
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
      {
        message: 'Validation failed.',
        code: 'VALIDATION_ERROR',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    )
  }
  const project = createProject(parsed.data)
  return NextResponse.json(project, { status: 201 })
}
