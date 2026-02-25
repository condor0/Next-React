import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
	http.get('/api/success', () => {
		return HttpResponse.json({ message: 'Success' });
	}),
	http.get('/api/error', () => {
		return HttpResponse.json({ message: 'Error' }, { status: 500 });
	})
);

export { server };