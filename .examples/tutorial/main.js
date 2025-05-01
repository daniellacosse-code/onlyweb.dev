// @ts-check

/**
 * @fileoverview
 * This file demonstrates a basic example of creating and registering a web page
 * using the OnlyWeb backend framework. It sets up a single route ("/") that
 * displays the current URL's search query and provides a button to copy it.
 *
 * This example showcases several key features:
 * - Registering a page route with specific browser requirements.
 * - Using the `html` tagged template literal for server-side rendering.
 * - Utilizing the `createInliner` utility for managing page metadata,
 *   localized messages, and loading frontend element code.
 * - Accessing request details (like the URL).
 * - Integrating a custom frontend element (`<copy-code>`).
 */

import { createInliner, html, registerPage, start } from "@onlyweb/backend";

import { convertToAbsolutePath } from "./path.js";

/**
 * Registers a handler for a specific route ("/" in this case).
 * When a request matches this route, the provided configuration object
 * determines how the response is generated.
 */
registerPage("/", {
  // Define minimum browser versions needed for this specific page.
  // These are merged with framework-wide defaults.
  requirements: {
    engine: {
      Firefox: 125, // Requires Firefox version 125 or higher
      Safari: 17.0, // Requires Safari version 17.0 or higher
    },
  },
  /**
   * This function is executed when a request hits the "/" route.
   * It builds the HTML response for the page.
   */
  render: async (request) => {
    /**
     * Creates an 'inliner' utility instance for this specific request.
     * The inliner helps manage resources that need to be embedded or referenced
     * within the final HTML page, such as localized text, metadata, and scripts
     * for custom elements.
     */
    const inliner = await createInliner(
      request,
      // Configure the inliner to look for message files (e.g., en.json, es.json)
      // in the "/messages" directory. The specific language file used will
      // depend on the request's detected language (e.g., from Accept-Language header).
      { messagesFolder: convertToAbsolutePath("/messages") },
    );

    // Use the `html` tagged template literal from @onlyweb/backend to construct the HTML response.
    // This function handles proper escaping and formatting for server-side rendering.
    return html`
      <head>
        <!-- Use the inliner to generate standard metadata tags -->
        ${
      inliner.metadata({
        // Fetch the title text using a key ("what's my search?") from the loaded message file.
        title: inliner.message("what's my search?"),
        // Fetch the description text using a key.
        description: inliner.message(
          "a simple page that shows the search query",
        ),
      })
    }
        <!-- Use the inliner to generate the necessary <script> tags -->
        <!-- to load and register the specified frontend custom element. -->
        ${await inliner.elements(convertToAbsolutePath("/copy-code.js"))}
      </head>
      <body>
        <!-- Display a heading, fetching the text from messages -->
        <h1>${inliner.message("Your search is:")} ${request.url.search}</h1>

        <!--
          Include the custom element <copy-code> defined in copy-code.js.
          Pass data to the element using standard HTML attributes.
          - 'code': Set to the search part of the current URL.
          - 'copy-message': Set to a localized message fetched by the inliner.
        -->
        <copy-code code="${request.url.search}" copy-message="${
      inliner.message(
        "Copied!",
      )
    }"></copy-code>
      </body>
    `;
  },
});

/**
 * Starts the OnlyWeb backend server.
 * This function typically reads configuration (like port number) from the
 * environment and begins listening for incoming HTTP requests, routing them
 * to the appropriate registered page handlers.
 */
start();
