import { createInliner, html, registerPage, start } from "@onlyweb/backend";

registerPage("/", {
  requirements: {
    engine: {
      Firefox: "125",
      Safari: "17.0",
    },
  },
  render: async (request) => {
    const inliner = await createInliner(
      request,
      { messagesFolder: "/messages" },
    );

    return html`
      <head>
        ${
      inliner.metadata({
        title: inliner.message("what's my search?"),
        description: inliner.message(
          "a simple page that shows the search query",
        ),
      })
    }
        ${await inliner.elements("/copy-code.js")}
      </head>
      <body>
        <h1>${inliner.message("Your search is:")} ${request.url.search}</h1>

        <copy-code code="${request.url.search}" copy-message="${
      inliner.message(
        "Copied!",
      )
    }"></copy-code>
      </body>
    `;
  },
});

start();
