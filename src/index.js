function noop() {}

export default function (url, opts) {
	opts = opts || {};

	let k, ws, $={};
	let ms=opts.timeout || 1e3, num=0, max=opts.maxAttempts || Infinity;

	for (k in opts) {
		(typeof opts[k] === 'function') && ($[k]=opts[k]);
	}

	$.onclose = e => {
		(e.code !== 1e3 && e.code !== 1005) && $.reconnect(e);
		(opts.onclose || noop)(e);
	};

	$.onerror = e => {
		(e && e.code==='ECONNREFUSED') ? $.reconnect(e) : (opts.onerror || noop)(e);
	};

	$.open = () => {
		ws = new WebSocket(url, opts.protocols);
		for (k in $) ws[k] = $[k];
		return ws;
	};

	$.reconnect = e => {
		(++num < max) && setTimeout(_ => {
			($.onreconnect || noop)(e);
			$.open();
		}, ms);
	};

	$.json = x => {
		ws.send(JSON.stringify(x));
	};

	$.onmessage = e => {

		let newData = e.data;
		if (typeof e.data === 'string') {
			try {
				newData = JSON.parse(e.data);
			}
			catch (e) {

			}
		}

		const newEvent = Object.assign({}, e, { data: newData });

		return (opts.onmessage || noop)(newEvent);
	}

	return $.open();
}
