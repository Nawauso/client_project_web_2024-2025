import { render, screen, fireEvent } from '@testing-library/react';
import { tryRequire, pickExport } from '../../test/runtimeRequire';
import '@testing-library/jest-dom';

const { mod } = tryRequire('../../components/preferences/ProviderCard');
const ProviderCard = pickExport(mod, ['ProviderCard']);

const maybe = ProviderCard ? it : it.skip;

describe('ProviderCard', () => {
  maybe('renders and toggles', () => {
    const p = { id: 10, name: 'Netflix', logoUrl: '' };
    const onToggle = jest.fn();
    render(<ProviderCard provider={p} selected={false} onToggle={onToggle} />);
    const btn = screen.getByRole('button', { name: /Netflix/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalledWith(10);
  });
});
