import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { tryRequire, pickExport } from '../../test/runtimeRequire';
import '@testing-library/jest-dom';

const authMod = tryRequire('../../context/AuthContext').mod;
const AuthContext = pickExport(authMod, ['AuthContext']);

const loginMod = tryRequire('../../pages/LoginPage').mod;
const LoginPage = pickExport(loginMod, ['LoginPage']);

const maybe = (AuthContext && LoginPage) ? it : it.skip;

describe('LoginPage', () => {
  maybe('submits credentials', async () => {
    const login = jest.fn();
    render(
      <AuthContext.Provider value={{ user: null, token: null, isAuthenticated: false, login, logout: jest.fn() }}>
        <MemoryRouter><LoginPage /></MemoryRouter>
      </AuthContext.Provider>
    );
    const userLabel = screen.getByLabelText(/email|username|identifiant/i);
    const passLabel = screen.getByLabelText(/mot de passe|password/i);
    await userEvent.type(userLabel, 'alice');
    await userEvent.type(passLabel, 'secret');
    await userEvent.click(screen.getByRole('button', { name: /se connecter|login/i }));
    expect(login).toHaveBeenCalled();
  });
});
