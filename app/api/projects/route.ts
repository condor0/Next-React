import { NextResponse } from 'next/server'
import { listProjects, createProject } from '@/lib/data/projects'
import { projectSchema } from '@/forms/schemas'

export async function GET() {
  return NextResponse.json(listProjects())
}

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = projectSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Validation failed.', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const project = createProject(parsed.data)
  return NextResponse.json(project, { status: 201 })
}
