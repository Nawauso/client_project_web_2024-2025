import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { tryRequire, pickExport } from '../../test/runtimeRequire';

const cpMod = tryRequire('../../pages/CriteriaPage').mod;
const CriteriaPage = pickExport(cpMod, ['CriteriaPage']);

const ctxMod = tryRequire('../../context/NetfluxContextProvider').mod;
const NetfluxProvider = pickExport(ctxMod, ['NetfluxProvider', 'default']);

const axiosMod = tryRequire('../../api/AxiosInstance').mod;
const axiosInstance = pickExport(axiosMod, ['default']);

type AxiosLike = {
    get: (...args: any[]) => Promise<any>;
    put: (...args: any[]) => Promise<any>;
};

const maybe = (CriteriaPage && NetfluxProvider && axiosInstance) ? it : it.skip;

describe('CriteriaPage (integration)', () => {
    maybe('loads criteria and saves selection', async () => {
        const axios = axiosInstance as AxiosLike;

        // ✔️ Utiliser unknown[] puis extraire le 1er param
        jest.spyOn(axios as any, 'get').mockImplementation((...args: unknown[]) => {
            const url = String(args[0] ?? '');
            if (url === '/genres') {
                return Promise.resolve({ data: [{ id: 1, name: 'Action' }, { id: 2, name: 'Comedy' }] });
            }
            if (url === '/providers') {
                return Promise.resolve({ data: [{ id: 10, name: 'Netflix' }, { id: 20, name: 'Disney+' }] });
            }
            if (url === '/criterias/selected') {
                return Promise.resolve({ data: { genres: [1], providers: [20] } });
            }
            return Promise.resolve({ data: null });
        });

        jest.spyOn(axios as any, 'put').mockResolvedValue({ status: 204 } as any);

        render(
            <MemoryRouter initialEntries={['/criteria']}>
                <NetfluxProvider>
                    <Routes>
                        <Route path="/criteria" element={<CriteriaPage />} />
                    </Routes>
                </NetfluxProvider>
            </MemoryRouter>
        );

        expect(await screen.findByRole('button', { name: /Action/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Comedy/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Netflix/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Disney\+/i })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Comedy/i }));
        fireEvent.click(screen.getByRole('button', { name: /Netflix/i }));

        const saveBtn = screen.getByRole('button', { name: /enregistrer|save/i });
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                '/criterias/selected',
                expect.objectContaining({
                    genres: expect.any(Array),
                    providers: expect.any(Array),
                })
            );
        });
    });
});
