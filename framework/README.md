# the onlyweb framework ✨👁✨

![status](https://badgen.net/badge/status/pre-alpha/red/) [![codecov](https://codecov.io/gh/daniellacosse-code/onlyweb.dev/graph/badge.svg?token=MQP3VXXJ0A)](https://codecov.io/gh/daniellacosse-code/onlyweb.dev) [![Maintainability](https://api.codeclimate.com/v1/badges/9bc1ec955cd47c99b9ad/maintainability)](https://codeclimate.com/github/daniellacosse-code/onlyweb.dev/maintainability)

https://github.com/daniellacosse-code/onlyweb.dev/assets/3759828/cd94622b-aedb-4831-bb52-9f6b3974b7cb

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

![benchmarks](https://c10.patreonusercontent.com/4/patreon-media/p/post/99703883/3a76a7cd607e4d50bc1ee9c684c33b0e/e30%3D/1.png?token-time=1711670400&token-hash=Oc2E9Tq6jbzAbKSqWXWvyIE3K1FZNjnVkTBDyecyiM4%3D)

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

## concepts

```mermaid
block-beta
  block
    columns 2
    backend:2
    page:2
    responses
    inliner
  end
  block
    columns 2
    frontend:2
    element:2
    host
    template
  end
```

The **onlyweb framework** is split into two main environments: the backend and the frontend. These environments have mirrored APIs that are designed to work together. _(You can infer which environment you're in based on the properties present on `globalThis`.)_

### backend

The backend server serves content via Deno. Key concepts:

1. **Page**: encapsulates a set of possible responses to an endpoint and chooses which response to use when. The **Page** also manages the **Inliner**.
2. **Response**: an object that represents how the Deno HTTP web server will respond to a given Request. [Learn more about HTTP here.](https://developer.mozilla.org/en-US/docs/Web/HTTP)
3. **Inliner**: _inlines_ content into a **Response**, building the static content you wish to respond with just in time.

### frontend

The frontend renders content in the browser via WebComponnents. Key concepts:

1. **Element**: an HTML tag representing some meaningful section or component of your application. [Learn more about HTML Elements here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element).
2. **Host**: an in-memory object representing the current **Element** instance. Through its host you access an **Element**'s lifecycle, events, and current child elements. Think of it as the _"face"_ of the **Element**.
3. **Template**: the blueprint for the **Element**'s internals, driven by a set of data attributes you select. Think of it as the _"guts"_ of the **Element**.

I know this is a bit abstract, so let's walk through a simple example to make things more concrete.

> [!TIP]
> **When in doubt, everything in the framework has JSDoc annotations - just look at the source!**

### basic tutorial

1. Start by registering the main **Page** we're going to serve from the backend:

```js
import Backend from "https://github.com/daniellacosse-code/onlyweb.dev/raw/master/framework/backend/module.js";

Backend.Page.Register("/", {
  responses: {
    handleDefault: (request) => Backend.Page.Response.html`
        <body>
          <h1>Your search is: ${request.url.search}</h1>
        </body>
      `;
    }
  }
});
```

2. The default response has no metadata, so external sites won't know how to display it.
   Use the **Inliner** to add some:

```js
Backend.Page.Register("/", {
  responses: {
    handleDefault: (request, inliner) => Backend.Page.Response.html`
      <head>
        ${inliner.metadata({
          title: "what's my search?",
          description: "a simple page that shows the search query",
        })}
      </head>
      <body>
        <h1>Your search is: ${request.url.search}</h1>
      </body>
    `;
  }
});
```

3. Our page only works in English. Provide the **Inliner** with [a folder of translations like this one](../app/assets/messages/) so we can support those languages:

```js
Backend.Page.Register("/", {
  responses: {
    handleDefault: (request, inliner) => Backend.Page.Response.html`
      <head>
        ${inliner.metadata({
          title: inliner.message("what's my search?"),
          description: inliner.message("a simple page that shows the search query"),
        })}
      </head>
      <body>
        <h1>${inliner.message("Your search is:")} ${request.url.search}</h1>
      </body>
    `;
  },
  inliner: {
    messages: "%path/to/messages/folder%"
  }
});
```

4. We want to be able to easily copy our search string to the clipboard. We'll have to create a new frontend **Element** to do this. Here's that initial file:

```js
import Frontend from "https://github.com/daniellacosse-code/onlyweb.dev/raw/master/framework/frontend/module.js";

Frontend.Element.Register("copy-code", {
  template: {
    attributes: { copied: Boolean, ["copy-message"]: String, code: String },
    // Note that the html template tag here is different than the Backends'
    handleBuild: ({ code, copied, ["copy-message"]: copyMessage }) => Frontend.Element.html`
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
        <div popover>${copyMessage}</div>
      </div>
    `;
  }
});
```

5. The onlyweb framework simply wraps the existing Event API to handle I/O. To do the copy, listen for the click event in the **Host**:

```js
Frontend.Element.Register("copy-code", {
  host: {
    handleMount: () => {
      this.addEventListener("click", () => {
        if (this.template.attributes.copied) {
          return;
        }

        globalThis.navigator.clipboard.writeText(this.templateAttributes.code);

        this.template.querySelector("div[popover]").togglePopover();
        this.template.attributes.copied = true;
      });
    }
  },
  template: {
    attributes: { copied: Boolean, ["copy-message"]: String, code: String },
    // Note that the html template tag here is different than the Backends'
    handleBuild: ({ code, copied, ["copy-message"]: copyMessage }) => Frontend.Element.html`
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
        <div popover>${copyMessage}</div>
      </div>
    `;
  }
});
```

6. Now to actually use our `<copy-code>` **Element** we must inline it into the **Page**. You do that like so:

```js
Backend.Page.Register("/", {
  responses: {
    handleDefault: (request, inliner) => Backend.Page.Response.html`
      <head>
        ${inliner.metadata({
          title: inliner.message("what's my search?"),
          description: inliner.message("a simple page that shows the search query"),
        })}
      </head>
      <body>
        <h1>${inliner.message("Your search is:")} ${request.url.search}</h1>

        ${inliner.elements("%path/to/element/copy-code.js%")}
        <copy-code code="${request.url,search}" copy-message="${inliner.message("Copied!")}"></copy-code>
      </body>
    `;
  },
  inliner: {
    messages: "%path/to/messages/folder%"
  }
});
```

7. HTML popovers aren't super supported yet, so let's indicate that in our pages' requirements:

> TODO([#170](https://github.com/daniellacosse-code/onlyweb.dev/issues/170)): this doesn't quite work yet

8. Finally, create a new file for your app's main entrypoint. Import your page and start the backend!

```js
import Backend from "https://github.com/daniellacosse-code/onlyweb.dev/raw/master/framework/backend/module.js";

import "%path/to/page.js%";

Backend.start({ port: 8080 });
```

### \[WIP\] full example

See the [onlyweb.dev application source](../app/) for a full example!
