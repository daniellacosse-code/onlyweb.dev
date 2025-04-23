# `@onlyweb` ✨👁✨

![status](https://badgen.net/badge/status/pre-alpha/red/)
[![codecov](https://codecov.io/gh/daniellacosse-code/onlyweb/graph/badge.svg?token=MQP3VXXJ0A)](https://codecov.io/gh/daniellacosse-code/onlyweb)
[![Maintainability](https://api.codeclimate.com/v1/badges/9bc1ec955cd47c99b9ad/maintainability)](https://codeclimate.com/github/daniellacosse-code/onlyweb/maintainability)
[![JSR Scope](https://jsr.io/badges/@onlyweb)](https://jsr.io/@onlyweb)

## overview

**the onlyweb framework** is a lightweight, server-side rendering framework for
[WebComponents](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components),
built on top of the [Deno](https://deno.land/) runtime. It was designed for the
[onlyweb.dev](https://onlyweb.dev) application with a focus on performance and
transparency. Jump to ["concepts"](#concepts) for the breakdown.

### prerequisites

```sh
brew bundle
```

A basic understanding of native web development. MDN has a great
[introduction to the web](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web)
that you can follow.

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

### \[WIP\] examples

TODO