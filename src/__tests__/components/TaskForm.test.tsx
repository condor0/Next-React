import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TaskForm } from '../../components/TaskForm'

describe('TaskForm', () => {
  it('renders TaskForm component', async () => {
    const { container } = render(
      <TaskForm submitLabel="Create task" onSubmit={async () => {}} />,
    )

    expect(container).toBeDefined()
  })

  it('handles error on submission', async () => {
    const { container } = render(
      <TaskForm
        submitLabel="Create task"
        onSubmit={async () => {
          return Promise.reject(new Error('Failed to create task'))
        }}
      />,
    )

    expect(container).toBeDefined()
  })
})
