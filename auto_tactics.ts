#!/usr/bin/env bun

import {score} from './shared/score';

const server = Bun.serve({
	async fetch(req: Request): Promise<Response> {
		const url = new URL(req.url);
		if (url.pathname === '/')
			return new Response(Bun.file('html/index.html'));
		else if (url.pathname === '/api/score')
			return new Response(score() + '\n');
		else if (url.pathname.startsWith('/credits'))
			return new Response(Bun.file('html/credits.html'));
		else if (url.pathname.startsWith('/static/')) {
			const file = Bun.file(url.pathname.substring(1));
			if (!await file.exists())
				return new Response('404\n', {status: 404});
			return new Response(file);
		}
		return new Response('404\n', {status: 404});
	},
});
console.log(`listening on ${server.url.toString()}`);
