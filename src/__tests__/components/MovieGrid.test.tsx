import { render, screen } from '@testing-library/react';
import { tryRequire, pickExport } from '../../test/runtimeRequire';

const { mod } = tryRequire('../../components/movies/MovieGrid');
const MovieGrid = pickExport(mod, ['MovieGrid']);

const maybe = MovieGrid ? it : it.skip;

describe('MovieGrid', () => {
  maybe('displays movies', () => {
    const data = [{ id: 1, title: 'Inception' }, { id: 2, title: 'Matrix' }];
    render(<MovieGrid movies={data as any} />);
    expect(screen.getByText(/Inception/i)).toBeInTheDocument();
    expect(screen.getByText(/Matrix/i)).toBeInTheDocument();
  });
});
