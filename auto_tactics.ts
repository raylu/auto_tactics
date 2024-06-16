#!/usr/bin/env bun

const server = Bun.serve({
	fetch(req: Request): Response {
		const url = new URL(req.url);
		if (url.pathname === '/')
			return new Response(Bun.file('html/index.html'));
		else if (url.pathname.startsWith('/static/'))
			return new Response(Bun.file(url.pathname.substring(1)));
		return new Response('404\n', { status: 404 });
	},
});
console.log(`listening on ${server.url.toString()}`);
