function noop() {}

export default function (url, opts) {
	opts = opts || {};

	let k, fn, ws, $={};
	let ms=opts.timeout || 1e3, num=0, max=opts.maxAttempts || Infinity;

	for (k in opts) {
		(typeof opts[k] === 'function') && ($[k]=opts[k]);
	}

	$.onclose = e => {
		(e.code !== 1e3) && reconnect(e);
		(opts.onclose || noop)(e);
	};

	$.onerror = e => {
		(e && e.code==='ECONNREFUSED') ? reconnect(e) : (opts.onerror || noop)(e);
	};

	$.open = _ => {
		ws = new WebSocket(url, opts.protocols);
		fn=ws.close; ws.close=(x,y) => ws && fn.call(ws, x||1e3, y);
		for (k in $) ws[k] = $[k];
		return ws;
	};

	$.reconnect = e => {
		(++num < max) && setTimeout(_ => {
			($.onreconnect || noop)(e);
			$.open();
		}, ms);
	};

	return $.open();
}
