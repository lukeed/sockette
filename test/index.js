const test = require('tape');
const fn = require('..');

test('exports', t => {
	t.is(typeof fn, 'function', 'exports a function');
	t.end();
});
