import { createTemplate, escapeHtml, log, minifyHtml } from "@onlyweb/shared";
import type { OWFResponse } from "./types.ts";

type SupportedMimetype = "text/html" | "text/javascript" | "text/plain";

type DirectlyHandledInsertion =
  | string
  | number
  | ((...args: unknown[]) => unknown)
  | OWFResponse
  | Record<string, unknown>;

interface SupportedTemplateInsertionArray
  extends Array<SupportedTemplateInsertion> {}

type SupportedTemplateInsertion =
  | DirectlyHandledInsertion
  | SupportedTemplateInsertionArray;

type _OWFResponseTemplate = (
  templateArray: TemplateStringsArray,
  ...insertions: SupportedTemplateInsertion[]
) => OWFResponse;

/**
 * A template literal for generating an OWFResponse.
 */
export interface OWFResponseTemplate extends _OWFResponseTemplate {
  (statusCode: number): _OWFResponseTemplate;
}

/**
 * A utility for creating a templateable response with a specific mimetype.
 * It also supports passing a status code.
 * @param mimetype The mimetype
 * @returns The response templater
 */
const createResponseTemplate = (
  mimetype: SupportedMimetype,
): OWFResponseTemplate => {
  class _OWFResponse extends Response {
    constructor(body: string, init?: ResponseInit) {
      super(body, init);
      log({
        message:
          `[backend/response] Constructed a response with mimetype "${mimetype}"`,
        detail: { body },
        level: "debug",
      });

      this.#content = body;
      this.#mimetype = mimetype;
      this.headers.set("content-type", `${mimetype}; charset=UTF-8`);
    }

    // NO TOUCHY
    #content = "";
    get content() {
      return this.#content;
    }

    #mimetype = "";
    get mimetype() {
      return this.#mimetype;
    }
  }

  const handleInsertion = (insertion: SupportedTemplateInsertion) => {
    if (insertion instanceof _OWFResponse) {
      return minifyHtml(insertion.content);
    }

    const subinsertions = Array.isArray(insertion)
      ? insertion.reverse()
      : [insertion];
    const result = [];

    while (subinsertions.length) {
      const subinsertion = subinsertions.pop();

      // handle array
      if (Array.isArray(subinsertion)) {
        subinsertions.unshift(...subinsertion);

        // handle function
      } else if (typeof subinsertion === "function") {
        result.push(subinsertion.toString());

        // handle vanilla object
      } else if (String(subinsertion) === "[object Object]") {
        result.push(JSON.stringify(subinsertion));

        // handle string, number
      } else if (typeof subinsertion === "string") {
        result.push(escapeHtml(String(subinsertion)));
      } else if (typeof subinsertion === "number") {
        result.push(subinsertion);
      }
    }

    return result.join("");
  };

  const responseTemplate = (
    statusOrTemplate: number | TemplateStringsArray,
    ...insertions: SupportedTemplateInsertion[]
  ) => {
    if (typeof statusOrTemplate === "number") {
      return (
        template: TemplateStringsArray,
        ...insertions: SupportedTemplateInsertion[]
      ) => ({
        mimetype,
        nativeResponse: new _OWFResponse(
          createTemplate({
            template,
            insertions,
            handleInsertion,
          }),
          {
            status: statusOrTemplate,
          },
        ),
      });
    }

    return {
      mimetype,
      nativeResponse: new _OWFResponse(
        createTemplate({
          template: statusOrTemplate,
          insertions,
          handleInsertion,
        }),
      ),
    };
  };

  return responseTemplate as OWFResponseTemplate;
};

/** Template literal for generating an html response. */
export const html: OWFResponseTemplate = createResponseTemplate("text/html");

/** Template literal for fenerating a javascript response. */
export const js: OWFResponseTemplate = createResponseTemplate(
  "text/javascript",
);

/** Template literal for generating a json response. */
export const text: OWFResponseTemplate = createResponseTemplate("text/plain");
