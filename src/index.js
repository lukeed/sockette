function noop() {}

export default function (url, opts) {
	opts = opts || {};

	let k, ws, num, $={};
	let ms=opts.timeout || 1e3, max=opts.maxAttempts || Infinity;

	$.onmessage = opts.onmessage || noop;

	$.onclose = e => {
		(e.code !== 1e3 && e.code !== 1005) && $.reconnect(e);
		(opts.onclose || noop)(e);
	};

	$.onerror = e => {
		(e && e.code==='ECONNREFUSED') ? $.reconnect(e) : (opts.onerror || noop)(e);
	};

	$.onopen = e => {
		num=0; (opts.onopen || noop)(e);
	};

	$.open = () => {
		ws = new WebSocket(url, opts.protocols);
		for (k in $) ws[k] = $[k];
		return ws;
	};

	$.reconnect = e => {
		(++num < max) && setTimeout(_ => {
			(opts.onreconnect || noop)(e);
			$.open();
		}, ms);
	};

	$.json = x => {
		ws.send(JSON.stringify(x));
	};

	return $.open();
}
