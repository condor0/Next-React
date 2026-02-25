import { http, HttpResponse } from 'msw';

export const handlers = [
	http.get('/api/success', () => {
		return HttpResponse.json({ message: 'Success' });
	}),
	http.get('/api/error', () => {
		return HttpResponse.json({ message: 'Error' }, { status: 500 });
	}),
];