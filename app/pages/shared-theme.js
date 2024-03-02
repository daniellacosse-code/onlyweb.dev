import BackendPage from "/framework/backend-page/module.js";
import * as constants from "/app/constants.js";

export default BackendPage.Response.html`<style>
  :root {
    --color-background: ${constants.THEME_COLOR_BACKGROUND};
    --color-foreground: ${constants.THEME_COLOR_FOREGROUND};
    --color-highlight: ${constants.THEME_COLOR_HIGHLIGHT};

    --color-neutral: ${constants.THEME_COLOR_NEUTRAL};
    --color-neutral-semi-transparent: ${constants.THEME_COLOR_NEUTRAL_SEMITRANSPARENT};
    --color-neutral-transparent: ${constants.THEME_COLOR_NEUTRAL_TRANSPARENT};

    --size-hairline: ${constants.THEME_SIZE_HAIRLINE};
    --size-narrow: ${constants.THEME_SIZE_NARROW};
    --size-default: ${constants.THEME_SIZE_DEFAULT};
    --size-large: ${constants.THEME_SIZE_LARGE};
    --size-huge: ${constants.THEME_SIZE_HUGE};

    --size-text-paragraph: ${constants.THEME_SIZE_DEFAULT};
    --size-text-subtitle: ${constants.THEME_SIZE_LARGE};
    --size-text-title: ${constants.THEME_SIZE_HUGE};

    --size-icon: ${constants.THEME_SIZE_ICON}px;

    --animation-duration: ${constants.THEME_ANIMATION_DURATION};
    --animation-duration-fast: ${constants.THEME_ANIMATION_DURATION_FAST};
    --animation-timing-function: ${constants.THEME_ANIMATION_TIMING_FUNCTION};
  }

  ::selection {
    background: var(--color-highlight);
    color: var(--color-background);
  }

  body {
    all: initial;
    font-family: system-ui;
    touch-events: pan-y;
    background: var(--color-background);
  }
</style>`;
