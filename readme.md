<div align="center">
  <img src="https://github.com/lukeed/sockette/raw/master/sockette.jpg" alt="Sockette" height="250" />
</div>

<h1 align="center">Sockette</h1>

<div align="center">
  <a href="https://npmjs.org/package/sockette">
    <img src="https://badgen.now.sh/npm/v/sockette" alt="version" />
  </a>
  <a href="https://travis-ci.org/lukeed/sockette">
    <img src="https://badgen.now.sh/travis/lukeed/sockette" alt="travis" />
  </a>
  <a href="https://npmjs.org/package/sockette">
    <img src="https://badgen.now.sh/npm/dm/sockette" alt="downloads" />
  </a>
</div>

<div align="center">The cutest little WebSocket wrapper! 🧦</div>

<br />

Sockette is a tiny (367 bytes) wrapper around `WebSocket` that will automatically reconnect if the connection is lost!

In addition to attaching [additional API methods](#api), Sockette allows you to **reuse** instances, avoiding the need to redeclare all event listeners.

You have direct access to the (current) underlying `WebSocket` within every `EventListener` callback (via `event.target`).


## Install

```
$ npm install --save sockette
```


## Usage

Unlike `WebSocket`, you should declare all event listeners on initialization:
```js
const Sockette = require('sockette');

const ws = new Sockette('ws://localhost:3000', {
  timeout: 5e3,
  maxAttempts: 10,
  onopen: e => console.log('Connected!', e),
  onmessage: e => console.log('Received:', e),
  onreconnect: e => console.log('Reconnecting...', e),
  onmaximum: e => console.log('Stop Attempting!', e),
  onclose: e => console.log('Closed!', e),
  onerror: e => console.log('Error:', e)
});

ws.send('Hello, world!');
ws.json({type: 'ping'});
ws.close(); // graceful shutdown

// Reconnect 10s later
setTimeout(ws.reconnect, 10e3);
```


## API

### Sockette(url, options)

Returns: `Sockette`

Returns the `Sockette` instance.

#### url
Type: `String`

The URL you want to connect to &mdash; Should be prefixed with `ws://` or `wss://`. This is passed directly to `WebSocket`.

#### options.protocols
Type: `String|Array`

Either a single protocol string or an array of strings used to indicate sub-protocols. See the [`WebSocket` docs][MDN] for more info.

#### options.timeout
Type: `Number`<br>
Default: `1000`

The amount of time (in `ms`) to wait in between reconnection attempts. Defaults to 1 second.

#### options.maxAttempts
Type: `Number`<br>
Default: `Infinity`

The maximum number of attempts to reconnect.

> **Important:** Pass `-1` if you want to disable this feature. Although, this is main reason to use Sockette! :joy:

#### options.onopen
Type: `Function`

The `EventListener` to run in response to `'open'` events. It receives the `Event` object as its only parameter.

> This is called when the connection has been established and is ready to send and receive data.

> **Important:** Sockette will forget the number of previous reconnection attempts, so that the next time connection is lost, you will consistently retry `n` number of times, as determined by `options.maxAttempts`.

#### options.onmessage
Type: `Function`

The `EventListener` to run in response to `'message'` events. It receives the `Event` object as its only parameter.

> This is called when a message has been received from the server. You'll probably want `event.data`!

#### options.onreconnect
Type: `Function`

The callback to run when attempting to reconnect to the server.

If Sockette is automatically reconnecting in response to an `error` or unexpected `close` event, then your `onreconnect` callback will receive the forwarded `Event` object.

#### options.onmaximum
Type: `Function`

The callback to run when the [`maxAttempts`](o#ptionsmaxattempts) limit has been met.

This callback will receive the forwarded `Event` object from `onclose`.

#### options.onclose
Type: `Function`

The `EventListener` to run in response to `'close'` events. It receives the `Event` object as its only parameter.

> This is called when the connection has been closed for any reason.

> **Important:** If the `event.code` is _not_ `1000` or `1005` an automatic reconnect attempt will be queued.

#### options.onerror
Type: `Function`

The `EventListener` to run in response to `'error'` events. It receives the `Event` object as its only parameter.

> This is called anytime an error occurs.

> **Important:** If the `event.code` is `ECONNREFUSED`, an automatic reconnect attempt will be queued.

### send(data)

Identical to [`WebSocket#send()`][send], capable of sending multiple data types.

### close(code, reason)

Identical to [`WebSocket#close()`][close].

> **Note:** The `code` will default to `1005` unless specified.

### json(obj)

Convenience method that passes your `obj` (Object) through `JSON.stringify` before passing it to [`WebSocket#send()`][send].

### reconnect()

If [`options.maxAttempts`](#optionsmaxattempts) has not been exceeded, enqueues a reconnection attempt. Otherwise, it runs your [`options.onmaximum`](#optionsonmaximum) callback.

### open()

Initializes a new `WebSocket` &mdash; used on initialization and by [`reconnect()`](#reconnect).


## License

MIT © [Luke Edwards](https://lukeed.com)

[MDN]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
[close]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#close()
[send]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#send()
