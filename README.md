# lonly

![status](https://badgen.net/badge/status/alpha/red/) [![codecov](https://codecov.io/gh/daniellacosse-code/lonly/graph/badge.svg?token=MQP3VXXJ0A)](https://codecov.io/gh/daniellacosse-code/lonly) [![Maintainability](https://api.codeclimate.com/v1/badges/9bc1ec955cd47c99b9ad/maintainability)](https://codeclimate.com/github/daniellacosse-code/lonly/maintainability)

## overview

**the onlyweb framework** is a lightweight, server-side rendering framework for [WebComponents](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components), built on top of the [Deno](https://deno.land/) runtime. It was designed for the [onlyweb.dev](https://onlyweb.dev) application with a focus on performance and transparency. Jump to ["concepts"](#concepts) for the breakdown.

### prerequisites

A basic understanding of native web development. MDN has a great [introduction to the web](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web) that you can follow.

## features

- server-side rendering for WebComponents, as already mentioned
- zero dependencies, apart from Deno
- css reset scoped to WebComponents by default
- react-like rendering, without the virtual dom
- lit-like templating, without the need for a build step
- robust logging
- lightweight i18n
- streamlined service worker and PWA deployment
- user agent checking (for when feature detection isn't enough)

### benchmarks

<img width="500" alt="Screenshot 2024-10-03 at 19 39 03" src="https://github.com/user-attachments/assets/b647a602-3254-4c8a-a732-a7f1686fb5bd">

```
cpu: Apple M1 Max
runtime: deno 1.40.5 (aarch64-apple-darwin)

file:///only-web/framework/bench.js
benchmark                     time (avg)        iter/s             (min … max)       p75       p99      p995
------------------------------------------------------------------------------ -----------------------------
benchHandleSmallTemplate      24.19 ns/iter  41,347,496.2    (21.3 ns … 33.52 ns) 25.55 ns 31.17 ns 31.74 ns
benchHandleLargeTemplate      14.72 µs/iter      67,920.9  (13.21 µs … 447.33 µs) 13.75 µs 25.25 µs 88.25 µs
escapeSmallString            588.03 ns/iter   1,700,603.5 (570.98 ns … 618.44 ns) 592.58 ns 618.44 ns 618.44 ns
escapeLargeString            687.48 µs/iter       1,454.6 (656.75 µs … 985.88 µs) 670.17 µs 943.21 µs 959.58 µs
minifySmallString            320.09 ns/iter   3,124,130.2  (314.2 ns … 346.37 ns) 325.17 ns 341.35 ns 346.37 ns
minifyLargeString            144.68 µs/iter       6,911.7 (138.29 µs … 441.88 µs) 140.12 µs 333.5 µs 340.17 µs
parseUserAgent               524.01 ns/iter   1,908,352.7 (513.68 ns … 555.03 ns) 525.63 ns 544.58 ns 555.03 ns
```

### tutorial outline

```js
import "jsr:@lonly/web";

class MainPage extends $Backend.Page {
  path = "/"
  render({ request: { url } }) {
    return this.html`<h1>Your search is: ${url.search}</h1>`;
  }
}
```

```js
import "jsr:@lonly/web";

class MainPage extends $Backend.Page {
  path = "/"
  render({ request: { url }, _: { meta } }) {
    return this.html`
      <head>
        ${meta({
          title: "what's my search?",
          description: "a simple page that shows the search query"
        })}
      </head>
      <body>
        <h1>Your search is: ${url.search}</h1>
      </body>
    `;
  }
}
```

```js
import "jsr:@lonly/web";

import messages from "%path/to/messages%" with { type: "json" };

class MainPage extends $Backend.Page {
  path = "/"
  resources = { messages }
  render({ request: { url }, _: { meta, msg } }) {
    return this.html`
      <head>
        ${meta({
          title: msg("what's my search?"),
          description: msg(
            "a simple page that shows the search query"
          )
        })}
      </head>
      <body>
        <h1>${msg("Your search is:")} ${url.search}</h1>
      </body>
    `;
  }
}
```

```js
class CopyElement extends $Frontend.Element {
  tag = "copy-code"
  attributes = {
    code: String,
    ["copy-message"]: String
  }

  render({ attributes: { code, ["copy-message"]: message } }) {
    return this.html`
      <style>
        div {
          display: relative;
        }
        code {
          font-family: monospace;
          font-size: 1rem;
          text-overflow: ellipsis;
        }
        div[popover] {
          display: absolute;
          top: 0;
          left: 0;
        }
      </style>
      <div>
        <code>${code}</code>
        <div popover>${message}</div>
      </div>
    `;
  }
}
```

```js
class CopyElement extends $Frontend.Element {
  tag = "copy-code"
  attributes = {
    code: String,
    copied: Boolean,
    ["copy-message"]: String
  }

  elements = {
    popover: "div[popover]"
  }

  requirements = {
    engine: {
      Firefox: "125",
      Safari: "17.0"
    }
  }

  click({
    attributes: { code, copied },
    elements: { popover }
  }) {
    if (copied) return;

    navigator.clipboard.writeText(code);

    popover.togglePopover();

    return { attributes: { copied: true } };
  }

  render({ attributes: { code, ['copy-message']: message } }) {
    return this.html`
      <style>
        div {
          display: relative;
        }
        code {
          font-family: monospace;
          font-size: 1rem;
          text-overflow: ellipsis;
        }
        div[popover] {
          display: absolute;
          top: 0;
          left: 0;
        }
      </style>
      <div>
        <code>${code}</code>
        <div popover>${message}</div>
      </div>
    `;
  }
}
```

```js
import "jsr:@lonly/web";

import messages from "%path/to/messages%" with { type: "json" };

import { CopyElement } from "%path/to/copy-code%";

class MainPage extends $Backend.Page {
  path = "/"
  resources = {
    messages,
    elements: { CopyElement }
  }
  render({ request: { url }, _: { meta, msg } }) {
    return this.html`
       <head>
        ${meta({
          title: msg("what's my search?"),
          description: msg(
            "a simple page that shows the search query"
          )
        })}
      </head>
      <body>
        <h1>${msg("Your search is:")} ${url.search}</h1>
        <copy-code
          code="${url.search}"
          copy-message="${msg("Copied!")}">
        </copy-code>
      </body>
    `;
  }
}
```

```js
import { start } from "jsr:@lonly/web";

class MainPage extends $Backend.Page {
  /* ... */
}

start({ MainPage });
```

### \[WIP\] examples

See the [.examples](./.examples) folder.
