# the onlyweb framework ✨👁✨

![status](https://badgen.net/badge/status/pre-alpha/red/) [![codecov](https://codecov.io/gh/daniellacosse-code/onlyweb.dev/graph/badge.svg?token=MQP3VXXJ0A)](https://codecov.io/gh/daniellacosse-code/onlyweb.dev) [![Maintainability](https://api.codeclimate.com/v1/badges/9bc1ec955cd47c99b9ad/maintainability)](https://codeclimate.com/github/daniellacosse-code/onlyweb.dev/maintainability)

https://github.com/daniellacosse-code/onlyweb.dev/assets/3759828/cd94622b-aedb-4831-bb52-9f6b3974b7cb

## overview

**the onlyweb framework** is a lightweight, server-side rendering framework for WebComponents, built on top of the [Deno](https://deno.land/) runtime. It was designed for the [onlyweb.dev](https://onlyweb.dev) application with a focus on performance and transparency. Jump to ["concepts"](#concepts) for the breakdown.

### prerequisites

A basic understanding of native web development. MDN has a great [introduction to the web](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web) that you can follow.

## features

- server-side rendering for WebComponents, as already mentioned
- zero dependencies, apart from deno
- easy service worker and PWA deployment
- css reset scoped to WebComponents by default
- react-like rendering, without the virtual dom
- lit-like templating, without the need for a build step
- user agent checking (for when feature detection isn't enough)
- robust logging
- lightweight i18n

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

TODO: explain that mainly there are two environments with mirrored APIs:

- backend vs. frontend (which share globalThis)
- page vs. element
- inliner vs. template

## example

See the [[WIP] onlyweb.dev application source](../app/) for a full example!
