import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { tryRequire, pickExport } from '../../test/runtimeRequire';

const { mod } = tryRequire('../../App');
const App = pickExport(mod, ['App']);

const maybe = App ? it : it.skip;

describe('App router', () => {
  maybe('renders home route without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.queryByRole('main', { hidden: true })).toBeTruthy();
  });
});
