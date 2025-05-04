import { createTemplate, escapeHtml, minifyHtml } from "@onlyweb/shared";
import type { OWFResponse } from "./types.ts";
import { isOWFResponse } from "./wrap.ts";
import { resolveEnvironment } from "../../main.ts";

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
  const handleInsertion = (insertion: SupportedTemplateInsertion) => {
    if (isOWFResponse(insertion)) {
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
      ) => {
        const content = createTemplate({
          template,
          insertions,
          handleInsertion,
        });

        return {
          mimetype,
          content,
          nativeResponse: new Response(
            content,
            {
              status: statusOrTemplate,
              headers: {
                "content-type": `${mimetype}; charset=UTF-8`,
                "content-security-policy": (() => {
                  const cdnSource = resolveEnvironment("OWF_SOURCE_CDN");
                  const allowedDomains = resolveEnvironment(
                    "OWF_ALLOW_DOMAINS",
                  );
                  // TODO: calculate CSP hashes for each script in the payload
                  let policy = `default-src 'unsafe-inline' 'self' data: ${
                    new URL(cdnSource).hostname
                  }`;
                  if (allowedDomains) policy += ` ${allowedDomains}`;
                  return policy;
                })(),
                "x-robots-tag": resolveEnvironment("OWF_ALLOW_ROBOTS")
                  ? "all"
                  : "none",
              },
            },
          ),
        };
      };
    }

    const content = createTemplate({
      template: statusOrTemplate,
      insertions,
      handleInsertion,
    });

    return {
      mimetype,
      content,
      nativeResponse: new Response(
        content,
        {
          headers: {
            "content-type": `${mimetype}; charset=UTF-8`,
          },
        },
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
