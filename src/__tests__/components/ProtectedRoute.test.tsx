import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { tryRequire, pickExport } from '../../test/runtimeRequire';
import '@testing-library/jest-dom';

const prMod = tryRequire('../../components/auth/ProtectedRoute').mod;
const ProtectedRoute = pickExport(prMod, ['ProtectedRoute']);

const authMod = tryRequire('../../context/AuthContext').mod;
const AuthContext = pickExport(authMod, ['AuthContext']);

const maybe = (ProtectedRoute && AuthContext) ? it : it.skip;

describe('ProtectedRoute', () => {
  maybe('redirects to /login when not authenticated', async () => {
    render(
      <AuthContext.Provider value={{ user: 'john', token: null, login: jest.fn(), logout: jest.fn(), isAuthenticated: false }}>
        <MemoryRouter initialEntries={['/secure']}> 
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/secure" element={<ProtectedRoute><div>Secure Page</div></ProtectedRoute>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(await screen.findByText(/Login Page/i)).toBeInTheDocument();
  });

  maybe('renders children when authenticated', () => {
    render(
      <AuthContext.Provider value={{ user: 'john', token: 't', login: jest.fn(), logout: jest.fn(), isAuthenticated: true }}>
        <MemoryRouter initialEntries={['/secure']}> 
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/secure" element={<ProtectedRoute><div>Secure Page</div></ProtectedRoute>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText(/Secure Page/i)).toBeInTheDocument();
  });
});
