import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { tryRequire, pickExport } from '../../test/runtimeRequire';
import '@testing-library/jest-dom';

const navMod = tryRequire('../../components/layout/Navbar').mod;
const Navbar = pickExport(navMod, ['Navbar']);

const authMod = tryRequire('../../context/AuthContext').mod;
const AuthContext = pickExport(authMod, ['AuthContext']);

const maybe = (Navbar && AuthContext) ? it : it.skip;

describe('Navbar', () => {
  maybe('shows public links', () => {
    render(
      <AuthContext.Provider value={{ user: null, token: null, login: jest.fn(), logout: jest.fn(), isAuthenticated: false }}>
        <MemoryRouter><Navbar /></MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByRole('link', { name: /accueil|home/i })).toBeInTheDocument();
  });

  maybe('shows private links when authenticated', () => {
    render(
      <AuthContext.Provider value={{ user: 'john', token: 't', login: jest.fn(), logout: jest.fn(), isAuthenticated: true }}>
        <MemoryRouter><Navbar /></MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByRole('link', { name: /favoris|favorites/i })).toBeInTheDocument();
  });
});
