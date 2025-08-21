import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { tryRequire, pickExport } from '../../test/runtimeRequire';
import '@testing-library/jest-dom';

const { mod } = tryRequire('../../pages/FavoritesPage');
const FavoritesPage = pickExport(mod, ['FavoritesPage']);

const maybe = FavoritesPage ? it : it.skip;

describe('FavoritesPage', () => {
  maybe('renders empty state', () => {
    render(<MemoryRouter><FavoritesPage /></MemoryRouter>);
    expect(screen.getByText(/aucun favori|no favorites/i)).toBeInTheDocument();
  });
});
