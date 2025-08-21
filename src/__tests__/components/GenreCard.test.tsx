import { screen, render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenreCard from '../../components/preferences/GenreCard';
import { Genre } from '../../models/Genre';

test('GenreCard renders and toggles', () => {
  const g: Genre = { id: 1, name: 'Action' };
  const onToggle = jest.fn();
  render(<GenreCard genre={g} selected={false} onToggle={onToggle} />);

  const btn = screen.getByRole('button', { name: /Action/i });
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
  expect(onToggle).toHaveBeenCalledWith(1);
});
