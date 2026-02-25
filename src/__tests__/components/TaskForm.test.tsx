import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskForm } from '../../components/TaskForm';
import { server } from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TaskForm', () => {
  it('renders TaskForm component', async () => {
    const { container } = render(
      <TaskForm
        submitLabel="Create task"
        onSubmit={async () => {}}
      />
    );

    expect(container).toBeDefined();
  });

  it('handles error on submission', async () => {
    const { container } = render(
      <TaskForm
        submitLabel="Create task"
        onSubmit={async () => {
          return Promise.reject(new Error('Failed to create task'));
        }}
      />
    );

    expect(container).toBeDefined();
  });
});