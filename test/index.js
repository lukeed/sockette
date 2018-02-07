const test = require('tape');
const Sockette = require('..');
const MockServer = require('mock-socket').Server;

test('exports', t => {
	t.is(typeof Sockette, 'function', 'exports a function');
	t.end();
});

test('onmessage', t => {
	t.test('should receive data as string when server sends string', st => {
		st.timeoutAfter(500);
		const mockServer = new MockServer('ws://localhost:8080');

		const stringFromServer = 'foo bar biz';

		const ws = new Sockette('ws://localhost:8080', {
			onmessage: e => {
				mockServer.stop();
				st.equal(typeof e.data, 'string', 'Event data is a string');
				st.deepEqual(e.data, stringFromServer, 'Event data is the same as the server data');
				st.end();
			}
		});

		mockServer.send(stringFromServer);
	});

	t.test('should receive data as object when server sends object', st => {
		const mockServer = new MockServer('ws://localhost:8080');
		st.timeoutAfter(500);
		const jsonMessageFromServer = { foo: "bar", baz: [1, 2, 3] };

		mockServer.start();
		const ws = new Sockette('ws://localhost:8080', {
			onmessage: e => {
				mockServer.stop();
				st.equal(typeof e.data, 'object', 'Event data is an object');
				st.deepEqual(e.data, jsonMessageFromServer, 'Event data is the same as the server data');
				st.end();
			}
		});
		mockServer.send(JSON.stringify(jsonMessageFromServer));
	});

	t.test('should receive data as ArrayBuffer when server sends ArrayBuffer', st => {
		const mockServer = new MockServer('ws://localhost:8080');
		st.timeoutAfter(500);
		const arrayBufferFromServer = new ArrayBuffer(42);

		mockServer.start();
		const ws = new Sockette('ws://localhost:8080', {
			onmessage: e => {
				mockServer.stop();
				st.equal(typeof e.data, 'object', 'Event data is an object');
				st.deepEqual(e.data, arrayBufferFromServer, 'Event data is the same as the server data');
				st.end();
			}
		});
		mockServer.send(JSON.stringify(arrayBufferFromServer));
	});
});
