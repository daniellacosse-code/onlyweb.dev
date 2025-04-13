import Inliner from "./page/inliner.js";
import Register from "./page/register.js";
import Response from "./page/response.js";

/**
 * A collection of Page utilities.
 * @module Backend
 */
export const Page = {
    Inliner,
    Register,
    Response,
};

export {default as start} from "./start.js";
export * from "./constants.js";
