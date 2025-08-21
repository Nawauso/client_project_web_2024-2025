import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthProvider, AuthContext } from '../../context/AuthContext';
import { ContextNetfluxProvider } from '../../context/NetfluxContextProvider';
import axiosInstance from '../../api/AxiosInstance';

// Mock AxiosInstance utilisé par AuthProvider (ex: /auth/verify)
jest.mock('../../api/AxiosInstance', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
    },
}));

const mocked = axiosInstance as unknown as { get: jest.Mock };

// Petit consommateur du contexte Auth pour piloter login/logout
function Consumer() {
    // On cast en any pour ne pas dépendre des types exacts exportés
    const ctx = React.useContext(AuthContext) as any;

    return (
        <div>
            <div data-testid="user">{ctx?.user ?? ''}</div>
            <div data-testid="isAuth">{ctx?.isAuthenticated ? '1' : '0'}</div>
            <button onClick={() => ctx.login('alice', 'token123')}>login</button>
            <button onClick={() => ctx.logout()}>logout</button>
        </div>
    );
}

beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
});

test('login stores token and user; logout clears them', async () => {
    // AuthProvider peut vérifier le token côté API : on renvoie 200 OK
    mocked.get.mockResolvedValue({ status: 200 });

    render(
        <MemoryRouter initialEntries={['/']}>
            {/* ⚠️ AuthProvider dépend de useNetfluxContext → wrapper requis */}
            <ContextNetfluxProvider>
                <AuthProvider>
                    <Consumer />
                </AuthProvider>
            </ContextNetfluxProvider>
        </MemoryRouter>
    );

    // Au départ pas authentifié
    expect(screen.getByTestId('isAuth').textContent).toBe('0');

    // Simule un login
    await userEvent.click(screen.getByText('login'));
    expect(screen.getByTestId('isAuth').textContent).toBe('1');
    expect(localStorage.getItem('token')).toBe('token123');
    expect(localStorage.getItem('user')).toBe('alice');

    // Simule un logout (et attend la maj d'état asynchrone)
    await userEvent.click(screen.getByText('logout'));

    await waitFor(() => {
        expect(screen.getByTestId('isAuth').textContent).toBe('0');
    });
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
});
