# `@onlyweb` ✨👁✨

![status](https://badgen.net/badge/status/pre-alpha/red/)
[![codecov](https://codecov.io/gh/daniellacosse-code/onlyweb/graph/badge.svg?token=MQP3VXXJ0A)](https://codecov.io/gh/daniellacosse-code/onlyweb)
[![Maintainability](https://api.codeclimate.com/v1/badges/9bc1ec955cd47c99b9ad/maintainability)](https://codeclimate.com/github/daniellacosse-code/onlyweb/maintainability)
[![JSR Scope](https://jsr.io/badges/@onlyweb)](https://jsr.io/@onlyweb)

## overview

**the onlyweb framework** is a lightweight, server-side rendering framework for native
[WebComponents](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components),
built entirely on top of the [Deno](https://deno.land/) runtime. It was designed for the
[onlyweb.dev](https://onlyweb.dev) application with a focus on performance,
transparency, and leveraging web standards.

The core philosophy is to provide a productive development experience without complex build steps, relying on Deno's built-in capabilities for TypeScript handling and tooling. It aims to stay close to the platform, using standard browser APIs wherever possible.

### features

*   **Server-Side Rendering:** Optimized for fast initial loads and SEO using native Web Components.
*   **Buildless Development:** Leverages Deno's runtime for TypeScript, formatting, linting, and testing, eliminating the need for a separate build pipeline.
*   **Zero Runtime Dependencies:** Relies only on the Deno standard library and native browser APIs.
*   **Standard CSS:** Encourages the use of standard CSS within Shadow DOM or shared style fragments, avoiding the need for pre-processors. Includes a basic CSS reset scoped to components by default.
*   **Declarative Rendering:** Offers a familiar component model (inspired by React/Lit) for defining UI based on attributes, but without a virtual DOM.
*   **Simple Templating:** Provides `html` tagged template literals for both backend and frontend rendering.
*   **Robust Logging:** Includes structured logging utilities (`@onlyweb/shared`) suitable for metrics and debugging.
*   **Lightweight i18n:** Basic internationalization support via the backend `createInliner`.
*   **Streamlined PWA Support:** Helpers for service worker registration.
*   **User Agent Checking:** Utilities for checking browser capabilities when feature detection isn't sufficient.

*(Note: Advanced client-side state management beyond attributes is planned for post-alpha releases).*

## prerequisites

```sh
brew bundle
```

A basic understanding of native web development. MDN has a great
[introduction to the web](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web)
that you can follow.

## examples

- [Basic Tutorial](.examples/tutorial/)
- [onlyweb.dev](.examples/onlyweb.dev/) _(The application this framework was initially built for)_