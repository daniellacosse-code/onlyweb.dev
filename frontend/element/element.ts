import { log } from "@onlyweb/shared";
import { html } from "./html.ts";
import type { AnyPrimitiveShape, ConvertPrimitiveShapeToConstructorShape as $ } from "../types.ts";

export class OWFElement<S extends AnyPrimitiveShape> extends HTMLElement {
  buildAttributes: S;
  buildDefinition: $<S>;
  handleMount?: (buildAttributes: S) => void;
  handleTemplateBuild?: (buildAttributes: S) => HTMLCollection;
  handleDismount?: (buildAttributes: S) => void;

  #eventController = new AbortController();
  #root: ShadowRoot;

  constructor(buildDefinition: $<S>) {
    super();

    this.buildDefinition = buildDefinition;
    this.buildAttributes = new Proxy<S>(
      {} as S,
      {
        deleteProperty: (_, name) => {
          this.removeAttribute(String(name));
          return true;
        },
        get: (_, name) =>
          this.#RESOLVE_ATTRIBUTE(
            name as keyof S,
            this.getAttribute(String(name)) as string,
          ),
        set: (_, name, value) => {
          this.setAttribute(
            String(name),
            String(this.#RESOLVE_ATTRIBUTE(name as keyof S, value)),
          );
          return true;
        },
      },
    );

    this.#root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    log({
      message: `[frontend/element] <${this.tagName}> mounted`,
      level: "debug",
    });

    this.#buildTemplate();
    requestAnimationFrame(() =>
      this.handleMount?.(this.buildAttributes)
    );
  }

  attributeChangedCallback(name: keyof S, oldValue: S[keyof S], newValue: S[keyof S]) {
    log({
      message: `[frontend/element] <${this.tagName}> attributes changed`,
      detail: { name, oldValue, newValue },
      level: "debug",
    });

    this.#buildTemplate();
  }

  disconnectedCallback() {
    log({
      message: `[frontend/element] <${this.tagName}> dismounted`,
      level: "debug",
    });

    this.handleDismount?.(this.buildAttributes);

    this.#eventController.abort();
  }

  override addEventListener(eventType: string, listener: unknown, options?: unknown): void {
    if (!eventType) {
      return;
    }

    if (!listener || typeof listener !== "function") {
      return;
    }

    let resolvedOptions: AddEventListenerOptions = {
      signal: this.#eventController.signal
    };
    if (typeof options === "object") {
      resolvedOptions = { ...options, ...resolvedOptions };
    } else if (typeof options === "boolean") {
      resolvedOptions = { capture: options, ...resolvedOptions };
    }

    log({
      message:
        `[frontend/element] <${this.tagName}> listener added for "${eventType}" event`,
      level: "debug",
    });

    super.addEventListener(
      eventType,
      (event) => {
        event.stopPropagation();
        event.preventDefault();

        // You can't retarget an event, so we have to force it
        Object.defineProperty(event, "target", {
          writable: false,
          value: event
            .composedPath()
            .find(target =>
              (target as HTMLElement).getAttribute?.("id")
            ),
        });

        let message =
          `[frontend/element] <${this.tagName}> listener for "${eventType}"`;

        const element = (event.target as HTMLElement);

        if (event.target) {
          message +=
            ` triggered by internal <${element.tagName.toLocaleLowerCase()}>`;
        }

        log({ message, detail: { event }, level: "debug" });

        return listener(event);
      },
      resolvedOptions,
    );
  }

  override querySelector(selector: string): HTMLElement | null {
    return this.#root.querySelector(selector);
  }

  #buildTemplate() {
    if (!this.#root) {
      log({
        message:
          `[frontend/element#UPDATE_TEMPLATE] <${this.tagName}> template not yet initialized, skipping update`,
        level: "debug",
      });
      return;
    }

    log({
      message:
        `[frontend/element#UPDATE_TEMPLATE] updating template for <${this.tagName}>`,
      level: "debug",
    });

    const templateResult =
      this.handleTemplateBuild?.(this.buildAttributes) ??
      html`<slot></slot>`;
    const templateWrapper = html`<template>
      <style>
        *:not(slot) {
          all: initial;
          box-sizing: border-box;
          /* content-visibility: auto; */
          isolation: isolate;
          touch-action: none;
          user-select: none;
        }
        style,
        script {
          display: none;
        }
      </style>
      ${templateResult}
    </template>`;

    this.#root.replaceChildren(...templateWrapper);

    const newTemplateNode = this.#root.querySelector("template");

    if (!newTemplateNode) {
      log({
        message:
          `[frontend/element#UPDATE_TEMPLATE] <${this.tagName}> template missing <template> tag, cannot update template`,
        level: "warn",
      });
      return;
    }

    this.#root.append(newTemplateNode.content.cloneNode(true));

    log({
      message:
        `[frontend/element#UPDATE_TEMPLATE] <${this.tagName}> template updated`,
      level: "debug",
    });
  }

  #RESOLVE_ATTRIBUTE(name: keyof S, value: string | null | undefined): S[keyof S] | undefined {
    const resolver = this.buildDefinition[name] ?? String;

    if (value === null || value === undefined) return;
    if (resolver === Boolean) return this.#RESOLVE_BOOLEAN_ATTRIBUTE(value) as S[keyof S];

    return resolver(value) as S[keyof S];
  }

  #RESOLVE_BOOLEAN_ATTRIBUTE(value: string): boolean {
    switch (value) {
      case "true":
      case "": // empty string is considered true
        return true;
      case "false":
        return false;
      default:
        return Boolean(value);
    }
  }
}
