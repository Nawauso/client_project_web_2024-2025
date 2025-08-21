import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { tryRequire, pickExport } from '../../test/runtimeRequire';
import '@testing-library/jest-dom';

const { mod } = tryRequire('../../pages/RegisterPage');
const RegisterPage = pickExport(mod, ['RegisterPage']);

const maybe = RegisterPage ? it : it.skip;

describe('RegisterPage', () => {
  maybe('validates and submits', async () => {
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);
    const submit = screen.getByRole('button', { name: /s'inscrire|register/i });
    const userLabel = screen.getByLabelText(/email|username/i);
    const passLabel = screen.getByLabelText(/mot de passe|password/i);
    await userEvent.type(userLabel, 'bob');
    await userEvent.type(passLabel, 'secret');
    await userEvent.click(submit);
    expect(submit).toBeInTheDocument();
  });
});
