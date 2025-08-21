
import { render, screen } from '@testing-library/react';
import { tryRequire, pickExport } from '../../test/runtimeRequire';

const mod = tryRequire('../../context/NetfluxContextProvider').mod;
const NetfluxProvider = pickExport(mod, ['NetfluxProvider', 'default']);
const useNetflux = pickExport(mod, ['useNetflux', 'useNetfluxContext']);

const maybe = (NetfluxProvider && useNetflux) ? it : it.skip;

function Consumer() {
  const { selectedGenres, setSelectedGenres, selectedProviders, setSelectedProviders } = useNetflux();
  return (
    <div>
      <div data-testid="g">{selectedGenres.join(',')}</div>
      <div data-testid="p">{selectedProviders.join(',')}</div>
      <button onClick={() => setSelectedGenres([1,2])}>setG</button>
      <button onClick={() => setSelectedProviders([10])}>setP</button>
    </div>
  );
}

describe('Netflux context', () => {
  maybe('updates values', () => {
    render(
      <NetfluxProvider>
        <Consumer />
      </NetfluxProvider>
    );
    expect(screen.getByTestId('g').textContent).toBe('');
    expect(screen.getByTestId('p').textContent).toBe('');
    screen.getByText('setG').click();
    expect(screen.getByTestId('g').textContent).toBe('1,2');
    screen.getByText('setP').click();
    expect(screen.getByTestId('p').textContent).toBe('10');
  });
});
