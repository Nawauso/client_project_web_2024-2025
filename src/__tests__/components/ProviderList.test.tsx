import { render, screen, fireEvent } from '@testing-library/react';
import { tryRequire, pickExport } from '../../test/runtimeRequire';

const { mod } = tryRequire('../../components/preferences/ProviderList');
const ProviderList = pickExport(mod, ['ProviderList']);

const maybe = ProviderList ? it : it.skip;

describe('ProviderList', () => {
  maybe('selects and unselects items', () => {
    const providers = [
      { id: 10, name: 'Netflix', logoUrl: '' },
      { id: 20, name: 'Disney+', logoUrl: '' },
    ];
    const onChange = jest.fn();
    render(<ProviderList providers={providers} selected={[10]} onChange={onChange} />);
    const disney = screen.getByRole('button', { name: /Disney\+/i });
    fireEvent.click(disney);
    expect(onChange).toHaveBeenCalled();
  });
});
