import { http, HttpResponse } from 'msw';

const API = (globalThis as any).VITE_API_BASE_URL || 'http://localhost:8080/api';

export const handlers = [
  http.get(`${API}/genres`, () => {
    return HttpResponse.json([
      { id: 1, name: 'Action' },
      { id: 2, name: 'Comedy' },
    ]);
  }),

  http.get(`${API}/providers`, () => {
    return HttpResponse.json([
      { id: 10, name: 'Netflix' },
      { id: 20, name: 'Disney+' },
    ]);
  }),

  http.get(`${API}/criterias/selected`, () => {
    return HttpResponse.json({
      genres: [1],
      providers: [20],
    });
  }),

  http.put(`${API}/criterias/selected`, async ({ request }) => {
    const body = await request.json();
    if (!body || !Array.isArray(body.genres) || !Array.isArray(body.providers)) {
      return new HttpResponse('Bad Request', { status: 400 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API}/auth/verify`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
