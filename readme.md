<div align="center">
  <img src="https://github.com/lukeed/sockette/raw/master/sockette.jpg" alt="Sockette" height="250" />
</div>

<h1 align="center">Sockette</h1>

<div align="center">
  <a href="https://npmjs.org/package/sockette">
    <img src="https://img.shields.io/npm/v/sockette.svg" alt="version" />
  </a>
  <a href="https://travis-ci.org/lukeed/sockette">
    <img src="https://img.shields.io/travis/lukeed/sockette.svg" alt="travis" />
  </a>
  <a href="https://npmjs.org/package/sockette">
    <img src="https://img.shields.io/npm/dm/sockette.svg" alt="downloads" />
  </a>
</div>

<div align="center">The cutest little WebSocket wrapper! 🧦</div>

<br />

Sockette is a tiny (344 bytes) wrapper around `WebSocket` that will automatically reconnect if the connection is lost!

Upon creation, the `WebSocket` is returned directly, exposing the native `close` and `send` methods.

In addition to attaching [additional API methods](#api), Sockette allows you to **reuse** instances, avoiding the need to redeclare all event listeners.


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
  onclose: e => console.log('Closed!', e),
  onerror: e => console.log('Error:', e)
});

ws.send('Hello, world!');
ws.close(); // graceful shutdown

// Reconnect 10s later
setTimeout(ws.reconnect, 10e3);
```

> **Note:** You don't have to use `new` to instantiate!

```js
const socket = require('sockette');
let ws = socket('ws://localhost:3000');
```


## API

### Sockette(url, options)

Returns: `WebSocket`

Returns the underlying [`WebSocket`][MDN] directly.

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

#### options.onmessage
Type: `Function`

The `EventListener` to run in response to `'message'` events. It receives the `Event` object as its only parameter.

> This is called when a message has been received from the server. You'll probably want `event.data`!

If `event.data` is a JSON string, it is parsed into an Object.

E.g. Instead of the following `Event`:

```
{
  data: '{"foo": "bar", "baz": [1, 2, 3] }'
}
```

You get the parsed Object representation:

```
{
  data: {
    foo: "bar",
    baz: [1, 2, 3]
  }
}
```

#### options.onreconnect
Type: `Function`

The callback to run when attempting to reconnect to the server.

If Sockette is automatically reconnecting in response to an `error` or unexpected `close` event, then your `onreconnect` callback will receive the forwarded `Event` object.

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

### json(obj)

Convenience method that passes your `obj` (Object) through `JSON.stringify` before passing it to [`WebSocket#send()`][send].

### reconnect()

If [`options.maxAttempts`](#optionsmaxattempts) has not been exceeded, enqueues a reconnection attempt.

### open()

Initializes a new `WebSocket` &mdash; used on initialization and by [`reconnect()`](#reconnect).


## License

MIT © [Luke Edwards](https://lukeed.com)

[MDN]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
[close]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#close()
[send]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#send()
