import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { App } from './App';

describe('App', () => {
  it('renders the scaffold overview', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

    render(<App />);

    expect(screen.getByRole('heading', { name: /full-stack app scaffold/i })).toBeInTheDocument();
    expect(screen.getByText(/react \+ vite/i)).toBeInTheDocument();
    expect(screen.getByText(/postgresql \+ prisma/i)).toBeInTheDocument();
  });
});
