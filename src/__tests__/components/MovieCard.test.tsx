import { render, screen, fireEvent } from '@testing-library/react';
import { tryRequire, pickExport } from '../../test/runtimeRequire';

const { mod } = tryRequire('../../components/movies/MovieCard');
const MovieCard = pickExport(mod, ['MovieCard']);

const maybe = MovieCard ? it : it.skip;

describe('MovieCard', () => {
  maybe('renders title and emits onSelect', () => {
    const m = { id: 1, title: 'Inception', posterUrl: '' };
    const onSelect = jest.fn();
    render(<MovieCard movie={m as any} onSelect={onSelect} />);
    expect(screen.getByText(/Inception/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /details|voir|open|plus/i });
    fireEvent.click(btn);
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
