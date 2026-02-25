import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectForm } from '../../components/ProjectForm';
import { server } from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProjectForm', () => {
  it('renders ProjectForm component', () => {
    const { container } = render(
      <ProjectForm 
        submitLabel="Create Project"
        onSubmit={async () => {}}
      />
    );
    expect(container).toBeDefined();
  });
});