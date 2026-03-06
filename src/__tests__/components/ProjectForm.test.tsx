import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProjectForm } from '../../components/ProjectForm'

describe('ProjectForm', () => {
  it('renders ProjectForm component', () => {
    const { container } = render(
      <ProjectForm submitLabel="Create Project" onSubmit={async () => {}} />,
    )
    expect(container).toBeDefined()
  })
})
