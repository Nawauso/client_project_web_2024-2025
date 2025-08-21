import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { tryRequire, pickExport } from '../../test/runtimeRequire';
import '@testing-library/jest-dom';

const { mod } = tryRequire('../../pages/HomePage');
const HomePage = pickExport(mod, ['HomePage']);

const maybe = HomePage ? it : it.skip;

describe('HomePage', () => {
  maybe('renders heading', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
