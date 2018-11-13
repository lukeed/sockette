function noop() {}

export default function (url, opts) {
	opts = opts || {};

	var k, ws, num=0, $={}, self=this;
	var ms=opts.timeout || 1e3, max=opts.maxAttempts || Infinity;

	$.onmessage = opts.onmessage || noop;

	$.onclose = function (e) {
		e.code === 1e3 || e.code === 1005 || self.reconnect(e);
		(opts.onclose || noop)(e);
	};

	$.onerror = function (e) {
		(e && e.code==='ECONNREFUSED') ? self.reconnect(e) : (opts.onerror || noop)(e);
	};

	$.onopen = function (e) {
		num = 0;
		(opts.onopen || noop)(e);
	};

	self.open = function () {
		ws = new WebSocket(url, opts.protocols || []);
		for (k in $) ws[k] = $[k];
	};

	self.reconnect = function (e) {
		(num++ < max) ? setTimeout(_ => {
			(opts.onreconnect || noop)(e);
			self.open();
		}, ms) : (opts.onmaximum || noop)(e);
	};

	self.json = function (x) {
		ws.send(JSON.stringify(x));
	};

	self.send = function (x) {
		ws.send(x);
	};

	self.close = function (x, y) {
		ws.close(x, y);
	};

	self.open(); // init

	return self;
}
