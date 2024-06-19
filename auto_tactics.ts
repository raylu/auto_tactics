#!/usr/bin/env bun

import {score} from './shared/score';

const server = Bun.serve({
	fetch(req: Request): Response {
		const url = new URL(req.url);
		if (url.pathname === '/')
			return new Response(Bun.file('html/index.html'));
		else if (url.pathname === '/api/score')
			return new Response(score() + '\n');
		else if (url.pathname.startsWith('/credits'))
			return new Response(Bun.file('html/credits.html'));
		else if (url.pathname.startsWith('/static/')) {
			const headers: Record<string, string> = {};
			if (url.pathname.endsWith('.js'))
				headers['SourceMap'] = url.pathname + '.map';
			return new Response(Bun.file(url.pathname.substring(1)), {headers});
		}
		return new Response('404\n', { status: 404 });
	},
});
console.log(`listening on ${server.url.toString()}`);
