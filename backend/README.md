# `@onlyweb/backend`

This package provides the server-side functionalities for the OnlyWeb Framework. It handles incoming requests, routing, response generation, environment variable handling, and integration with frontend components.

## Table of Contents (JSR Docs)

> [!WARNING]
> JSR won't generate documentation links until OWF has a full, stable release.

*   **Core Server**
    *   `server/start.ts` - Functions for starting and managing the HTTP server.
*   **Server Resources**
    *   `resource/types.ts` - Core type definitions for server resources (requests, responses, etc.).
    *   `resource/request/types.ts` - Type definitions specifically for incoming requests (`OWFRequest`).
    *   `resource/response/types.ts` - Type definitions specifically for outgoing responses (`OWFResponse`).
    *   `resource/response/template.ts` - Tagged template literal for creating HTML responses server-side.
    *   `resource/page/create.ts` - Utility for constructing full HTML page responses.
    *   `resource/page/createInliner.ts` - Utility for creating an inliner function to embed resources within HTML pages.
    *   `resource/page/register.ts` - Function for registering page resources or routes.
*   **Environment**
    *   `environment/resolve.ts` - Utilities for resolving environment variables.
