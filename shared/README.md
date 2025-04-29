# `@onlyweb/shared`

A collection of shared utility functions for the OnlyWeb framework.
Utilities in this package are designed to be runtime agnostic.

## Table of Contents (JSR Docs)

> [!WARNING]
> JSR won't generate documentation links until OWF has a full, stable release.

*   **HTML Utilities**
    *   `html/escape.ts` - Functions for escaping HTML characters.
    *   `html/minify.ts` - Functions for minifying HTML strings.
*   **Templating**
    *   `template/create.ts` - Utilities for processing template literals.
*   **User Agent**
    *   `userAgent/parse.ts` - Function to parse user agent strings.
    *   `userAgent/merge.ts` - Function to merge user agent requirements.
    *   `userAgent/check.ts` - Function to check if a user agent meets requirements.
    *   `userAgent/types.ts` - Type definitions for user agent data.
*   **Logging**
    *   `log/log.ts` - Structured logging utility.
*   **Core Utilities**
    *   `registry/registry.ts` - A generic registry class.

### benchmarks

```sh
deno bench
```

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
