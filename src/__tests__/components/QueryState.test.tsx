import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryState } from '../../components/QueryState';

describe('QueryState', () => {
  it('renders QueryState component', () => {
    const { container } = render(
      <QueryState 
        title="Test"
        description="Test description"
      />
    );
    expect(container).toBeDefined();
  });
});