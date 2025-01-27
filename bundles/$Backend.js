function assertPath(path) {
    if (typeof path !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
    }
}
const CHAR_FORWARD_SLASH = 47;
function isPathSeparator(code) {
    return code === 47 || code === 92;
}
function isWindowsDeviceRoot(code) {
    return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for(let i = 0, len = path.length; i <= len; ++i){
        if (i < len) code = path.charCodeAt(i);
        else if (isPathSeparator(code)) break;
        else code = CHAR_FORWARD_SLASH;
        if (isPathSeparator(code)) {
            if (lastSlash === i - 1 || dots === 1) {} else if (lastSlash !== i - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator);
                        if (lastSlashIndex === -1) {
                            res = "";
                            lastSegmentLength = 0;
                        } else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += `${separator}..`;
                    else res = "..";
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += separator + path.slice(lastSlash + 1, i);
                else res = path.slice(lastSlash + 1, i);
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        } else if (code === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function resolve(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1; i--){
        let path;
        const { Deno: Deno1 } = globalThis;
        if (i >= 0) {
            path = pathSegments[i];
        } else if (!resolvedDevice) {
            if (typeof Deno1?.cwd !== "function") {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path = Deno1.cwd();
        } else {
            if (typeof Deno1?.env?.get !== "function" || typeof Deno1?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno1.cwd();
            if (path === undefined || path.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path = `${resolvedDevice}\\`;
            }
        }
        assertPath(path);
        const len = path.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator(code)) {
                isAbsolute = true;
                if (isPathSeparator(path.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for(; j < len; ++j){
                        if (isPathSeparator(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path.slice(last, j);
                        last = j;
                        for(; j < len; ++j){
                            if (!isPathSeparator(path.charCodeAt(j))) break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for(; j < len; ++j){
                                if (isPathSeparator(path.charCodeAt(j))) break;
                            }
                            if (j === len) {
                                device = `\\\\${firstPart}\\${path.slice(last)}`;
                                rootEnd = j;
                            } else if (j !== last) {
                                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                } else {
                    rootEnd = 1;
                }
            } else if (isWindowsDeviceRoot(code)) {
                if (path.charCodeAt(1) === 58) {
                    device = path.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator(path.charCodeAt(2))) {
                            isAbsolute = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        } else if (isPathSeparator(code)) {
            rootEnd = 1;
            isAbsolute = true;
        }
        if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
            resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
            resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
            resolvedAbsolute = isAbsolute;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function isPosixPathSeparator(code) {
    return code === 47;
}
function resolve1(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--){
        let path;
        if (i >= 0) path = pathSegments[i];
        else {
            const { Deno: Deno1 } = globalThis;
            if (typeof Deno1?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno1.cwd();
        }
        assertPath(path);
        if (path.length === 0) {
            continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = isPosixPathSeparator(path.charCodeAt(0));
    }
    resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
const osType = (()=>{
    const { Deno: Deno1 } = globalThis;
    if (typeof Deno1?.build?.os === "string") {
        return Deno1.build.os;
    }
    const { navigator } = globalThis;
    if (navigator?.appVersion?.includes?.("Win")) {
        return "windows";
    }
    return "linux";
})();
const isWindows = osType === "windows";
function resolve2(...pathSegments) {
    return isWindows ? resolve(...pathSegments) : resolve1(...pathSegments);
}
const osType1 = (()=>{
    const { Deno: Deno1 } = globalThis;
    if (typeof Deno1?.build?.os === "string") {
        return Deno1.build.os;
    }
    const { navigator } = globalThis;
    if (navigator?.appVersion?.includes?.("Win")) {
        return "windows";
    }
    return "linux";
})();
const isWindows1 = osType1 === "windows";
const CHAR_FORWARD_SLASH1 = 47;
function assertPath1(path) {
    if (typeof path !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
    }
}
function isPosixPathSeparator1(code) {
    return code === 47;
}
function isPathSeparator1(code) {
    return isPosixPathSeparator1(code) || code === 92;
}
function isWindowsDeviceRoot1(code) {
    return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function normalizeString1(path, allowAboveRoot, separator, isPathSeparator) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for(let i = 0, len = path.length; i <= len; ++i){
        if (i < len) code = path.charCodeAt(i);
        else if (isPathSeparator(code)) break;
        else code = CHAR_FORWARD_SLASH1;
        if (isPathSeparator(code)) {
            if (lastSlash === i - 1 || dots === 1) {} else if (lastSlash !== i - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator);
                        if (lastSlashIndex === -1) {
                            res = "";
                            lastSegmentLength = 0;
                        } else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += `${separator}..`;
                    else res = "..";
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += separator + path.slice(lastSlash + 1, i);
                else res = path.slice(lastSlash + 1, i);
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        } else if (code === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format(sep, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base;
    if (dir === pathObject.root) return dir + base;
    return dir + sep + base;
}
const WHITESPACE_ENCODINGS = {
    "\u0009": "%09",
    "\u000A": "%0A",
    "\u000B": "%0B",
    "\u000C": "%0C",
    "\u000D": "%0D",
    "\u0020": "%20"
};
function encodeWhitespace(string) {
    return string.replaceAll(/[\s]/g, (c)=>{
        return WHITESPACE_ENCODINGS[c] ?? c;
    });
}
class DenoStdInternalError extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert(expr, msg = "") {
    if (!expr) {
        throw new DenoStdInternalError(msg);
    }
}
const sep = "\\";
const delimiter = ";";
function resolve3(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1; i--){
        let path;
        const { Deno: Deno1 } = globalThis;
        if (i >= 0) {
            path = pathSegments[i];
        } else if (!resolvedDevice) {
            if (typeof Deno1?.cwd !== "function") {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path = Deno1.cwd();
        } else {
            if (typeof Deno1?.env?.get !== "function" || typeof Deno1?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno1.cwd();
            if (path === undefined || path.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path = `${resolvedDevice}\\`;
            }
        }
        assertPath1(path);
        const len = path.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator1(code)) {
                isAbsolute = true;
                if (isPathSeparator1(path.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for(; j < len; ++j){
                        if (isPathSeparator1(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path.slice(last, j);
                        last = j;
                        for(; j < len; ++j){
                            if (!isPathSeparator1(path.charCodeAt(j))) break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for(; j < len; ++j){
                                if (isPathSeparator1(path.charCodeAt(j))) break;
                            }
                            if (j === len) {
                                device = `\\\\${firstPart}\\${path.slice(last)}`;
                                rootEnd = j;
                            } else if (j !== last) {
                                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                } else {
                    rootEnd = 1;
                }
            } else if (isWindowsDeviceRoot1(code)) {
                if (path.charCodeAt(1) === 58) {
                    device = path.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator1(path.charCodeAt(2))) {
                            isAbsolute = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        } else if (isPathSeparator1(code)) {
            rootEnd = 1;
            isAbsolute = true;
        }
        if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
            resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
            resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
            resolvedAbsolute = isAbsolute;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString1(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator1);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize(path) {
    assertPath1(path);
    const len = path.length;
    if (len === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute = false;
    const code = path.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code)) {
            isAbsolute = true;
            if (isPathSeparator1(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    const firstPart = path.slice(last, j);
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return `\\\\${firstPart}\\${path.slice(last)}\\`;
                        } else if (j !== last) {
                            device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                            rootEnd = j;
                        }
                    }
                }
            } else {
                rootEnd = 1;
            }
        } else if (isWindowsDeviceRoot1(code)) {
            if (path.charCodeAt(1) === 58) {
                device = path.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator1(path.charCodeAt(2))) {
                        isAbsolute = true;
                        rootEnd = 3;
                    }
                }
            }
        }
    } else if (isPathSeparator1(code)) {
        return "\\";
    }
    let tail;
    if (rootEnd < len) {
        tail = normalizeString1(path.slice(rootEnd), !isAbsolute, "\\", isPathSeparator1);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute) tail = ".";
    if (tail.length > 0 && isPathSeparator1(path.charCodeAt(len - 1))) {
        tail += "\\";
    }
    if (device === undefined) {
        if (isAbsolute) {
            if (tail.length > 0) return `\\${tail}`;
            else return "\\";
        } else if (tail.length > 0) {
            return tail;
        } else {
            return "";
        }
    } else if (isAbsolute) {
        if (tail.length > 0) return `${device}\\${tail}`;
        else return `${device}\\`;
    } else if (tail.length > 0) {
        return device + tail;
    } else {
        return device;
    }
}
function isAbsolute(path) {
    assertPath1(path);
    const len = path.length;
    if (len === 0) return false;
    const code = path.charCodeAt(0);
    if (isPathSeparator1(code)) {
        return true;
    } else if (isWindowsDeviceRoot1(code)) {
        if (len > 2 && path.charCodeAt(1) === 58) {
            if (isPathSeparator1(path.charCodeAt(2))) return true;
        }
    }
    return false;
}
function join(...paths) {
    const pathsCount = paths.length;
    if (pathsCount === 0) return ".";
    let joined;
    let firstPart = null;
    for(let i = 0; i < pathsCount; ++i){
        const path = paths[i];
        assertPath1(path);
        if (path.length > 0) {
            if (joined === undefined) joined = firstPart = path;
            else joined += `\\${path}`;
        }
    }
    if (joined === undefined) return ".";
    let needsReplace = true;
    let slashCount = 0;
    assert(firstPart != null);
    if (isPathSeparator1(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
            if (isPathSeparator1(firstPart.charCodeAt(1))) {
                ++slashCount;
                if (firstLen > 2) {
                    if (isPathSeparator1(firstPart.charCodeAt(2))) ++slashCount;
                    else {
                        needsReplace = false;
                    }
                }
            }
        }
    }
    if (needsReplace) {
        for(; slashCount < joined.length; ++slashCount){
            if (!isPathSeparator1(joined.charCodeAt(slashCount))) break;
        }
        if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
    }
    return normalize(joined);
}
function relative(from, to) {
    assertPath1(from);
    assertPath1(to);
    if (from === to) return "";
    const fromOrig = resolve3(from);
    const toOrig = resolve3(to);
    if (fromOrig === toOrig) return "";
    from = fromOrig.toLowerCase();
    to = toOrig.toLowerCase();
    if (from === to) return "";
    let fromStart = 0;
    let fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 92) break;
    }
    for(; fromEnd - 1 > fromStart; --fromEnd){
        if (from.charCodeAt(fromEnd - 1) !== 92) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 0;
    let toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 92) break;
    }
    for(; toEnd - 1 > toStart; --toEnd){
        if (to.charCodeAt(toEnd - 1) !== 92) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 92) {
                    return toOrig.slice(toStart + i + 1);
                } else if (i === 2) {
                    return toOrig.slice(toStart + i);
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 92) {
                    lastCommonSep = i;
                } else if (i === 2) {
                    lastCommonSep = 3;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;
        else if (fromCode === 92) lastCommonSep = i;
    }
    if (i !== length && lastCommonSep === -1) {
        return toOrig;
    }
    let out = "";
    if (lastCommonSep === -1) lastCommonSep = 0;
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || from.charCodeAt(i) === 92) {
            if (out.length === 0) out += "..";
            else out += "\\..";
        }
    }
    if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
    } else {
        toStart += lastCommonSep;
        if (toOrig.charCodeAt(toStart) === 92) ++toStart;
        return toOrig.slice(toStart, toEnd);
    }
}
function toNamespacedPath(path) {
    if (typeof path !== "string") return path;
    if (path.length === 0) return "";
    const resolvedPath = resolve3(path);
    if (resolvedPath.length >= 3) {
        if (resolvedPath.charCodeAt(0) === 92) {
            if (resolvedPath.charCodeAt(1) === 92) {
                const code = resolvedPath.charCodeAt(2);
                if (code !== 63 && code !== 46) {
                    return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                }
            }
        } else if (isWindowsDeviceRoot1(resolvedPath.charCodeAt(0))) {
            if (resolvedPath.charCodeAt(1) === 58 && resolvedPath.charCodeAt(2) === 92) {
                return `\\\\?\\${resolvedPath}`;
            }
        }
    }
    return path;
}
function dirname(path) {
    assertPath1(path);
    const len = path.length;
    if (len === 0) return ".";
    let rootEnd = -1;
    let end = -1;
    let matchedSlash = true;
    let offset = 0;
    const code = path.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code)) {
            rootEnd = offset = 1;
            if (isPathSeparator1(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return path;
                        }
                        if (j !== last) {
                            rootEnd = offset = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot1(code)) {
            if (path.charCodeAt(1) === 58) {
                rootEnd = offset = 2;
                if (len > 2) {
                    if (isPathSeparator1(path.charCodeAt(2))) rootEnd = offset = 3;
                }
            }
        }
    } else if (isPathSeparator1(code)) {
        return path;
    }
    for(let i = len - 1; i >= offset; --i){
        if (isPathSeparator1(path.charCodeAt(i))) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) {
        if (rootEnd === -1) return ".";
        else end = rootEnd;
    }
    return path.slice(0, end);
}
function basename(path, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath1(path);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (isWindowsDeviceRoot1(drive)) {
            if (path.charCodeAt(1) === 58) start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path.length - 1; i >= start; --i){
            const code = path.charCodeAt(i);
            if (isPathSeparator1(code)) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path.length;
        return path.slice(start, end);
    } else {
        for(i = path.length - 1; i >= start; --i){
            if (isPathSeparator1(path.charCodeAt(i))) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1) return "";
        return path.slice(start, end);
    }
}
function extname(path) {
    assertPath1(path);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path.length >= 2 && path.charCodeAt(1) === 58 && isWindowsDeviceRoot1(path.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i = path.length - 1; i >= start; --i){
        const code = path.charCodeAt(i);
        if (isPathSeparator1(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path.slice(startDot, end);
}
function format(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format("\\", pathObject);
}
function parse(path) {
    assertPath1(path);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    const len = path.length;
    if (len === 0) return ret;
    let rootEnd = 0;
    let code = path.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code)) {
            rootEnd = 1;
            if (isPathSeparator1(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            rootEnd = j;
                        } else if (j !== last) {
                            rootEnd = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot1(code)) {
            if (path.charCodeAt(1) === 58) {
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator1(path.charCodeAt(2))) {
                        if (len === 3) {
                            ret.root = ret.dir = path;
                            return ret;
                        }
                        rootEnd = 3;
                    }
                } else {
                    ret.root = ret.dir = path;
                    return ret;
                }
            }
        }
    } else if (isPathSeparator1(code)) {
        ret.root = ret.dir = path;
        return ret;
    }
    if (rootEnd > 0) ret.root = path.slice(0, rootEnd);
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for(; i >= rootEnd; --i){
        code = path.charCodeAt(i);
        if (isPathSeparator1(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            ret.base = ret.name = path.slice(startPart, end);
        }
    } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
        ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path.slice(0, startPart - 1);
    } else ret.dir = ret.root;
    return ret;
}
function fromFileUrl(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    let path = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
    if (url.hostname != "") {
        path = `\\\\${url.hostname}${path}`;
    }
    return path;
}
function toFileUrl(path) {
    if (!isAbsolute(path)) {
        throw new TypeError("Must be an absolute path.");
    }
    const [, hostname, pathname] = path.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
    const url = new URL("file:///");
    url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
    if (hostname != null && hostname != "localhost") {
        url.hostname = hostname;
        if (!url.hostname) {
            throw new TypeError("Invalid hostname.");
        }
    }
    return url;
}
const mod = {
    sep: sep,
    delimiter: delimiter,
    resolve: resolve3,
    normalize: normalize,
    isAbsolute: isAbsolute,
    join: join,
    relative: relative,
    toNamespacedPath: toNamespacedPath,
    dirname: dirname,
    basename: basename,
    extname: extname,
    format: format,
    parse: parse,
    fromFileUrl: fromFileUrl,
    toFileUrl: toFileUrl
};
const sep1 = "/";
const delimiter1 = ":";
function resolve4(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--){
        let path;
        if (i >= 0) path = pathSegments[i];
        else {
            const { Deno: Deno1 } = globalThis;
            if (typeof Deno1?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno1.cwd();
        }
        assertPath1(path);
        if (path.length === 0) {
            continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH1;
    }
    resolvedPath = normalizeString1(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator1);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize1(path) {
    assertPath1(path);
    if (path.length === 0) return ".";
    const isAbsolute = path.charCodeAt(0) === 47;
    const trailingSeparator = path.charCodeAt(path.length - 1) === 47;
    path = normalizeString1(path, !isAbsolute, "/", isPosixPathSeparator1);
    if (path.length === 0 && !isAbsolute) path = ".";
    if (path.length > 0 && trailingSeparator) path += "/";
    if (isAbsolute) return `/${path}`;
    return path;
}
function isAbsolute1(path) {
    assertPath1(path);
    return path.length > 0 && path.charCodeAt(0) === 47;
}
function join1(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i = 0, len = paths.length; i < len; ++i){
        const path = paths[i];
        assertPath1(path);
        if (path.length > 0) {
            if (!joined) joined = path;
            else joined += `/${path}`;
        }
    }
    if (!joined) return ".";
    return normalize1(joined);
}
function relative1(from, to) {
    assertPath1(from);
    assertPath1(to);
    if (from === to) return "";
    from = resolve4(from);
    to = resolve4(to);
    if (from === to) return "";
    let fromStart = 1;
    const fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 47) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    const toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 47) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47) {
                    return to.slice(toStart + i + 1);
                } else if (i === 0) {
                    return to.slice(toStart + i);
                }
            } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47) {
                    lastCommonSep = i;
                } else if (i === 0) {
                    lastCommonSep = 0;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;
        else if (fromCode === 47) lastCommonSep = i;
    }
    let out = "";
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || from.charCodeAt(i) === 47) {
            if (out.length === 0) out += "..";
            else out += "/..";
        }
    }
    if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
    else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === 47) ++toStart;
        return to.slice(toStart);
    }
}
function toNamespacedPath1(path) {
    return path;
}
function dirname1(path) {
    assertPath1(path);
    if (path.length === 0) return ".";
    const hasRoot = path.charCodeAt(0) === 47;
    let end = -1;
    let matchedSlash = true;
    for(let i = path.length - 1; i >= 1; --i){
        if (path.charCodeAt(i) === 47) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path.slice(0, end);
}
function basename1(path, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath1(path);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path.length - 1; i >= 0; --i){
            const code = path.charCodeAt(i);
            if (code === 47) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path.length;
        return path.slice(start, end);
    } else {
        for(i = path.length - 1; i >= 0; --i){
            if (path.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1) return "";
        return path.slice(start, end);
    }
}
function extname1(path) {
    assertPath1(path);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i = path.length - 1; i >= 0; --i){
        const code = path.charCodeAt(i);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path.slice(startDot, end);
}
function format1(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format("/", pathObject);
}
function parse1(path) {
    assertPath1(path);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path.length === 0) return ret;
    const isAbsolute = path.charCodeAt(0) === 47;
    let start;
    if (isAbsolute) {
        ret.root = "/";
        start = 1;
    } else {
        start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for(; i >= start; --i){
        const code = path.charCodeAt(i);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute) {
                ret.base = ret.name = path.slice(1, end);
            } else {
                ret.base = ret.name = path.slice(startPart, end);
            }
        }
    } else {
        if (startPart === 0 && isAbsolute) {
            ret.name = path.slice(1, startDot);
            ret.base = path.slice(1, end);
        } else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute) ret.dir = "/";
    return ret;
}
function fromFileUrl1(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function toFileUrl1(path) {
    if (!isAbsolute1(path)) {
        throw new TypeError("Must be an absolute path.");
    }
    const url = new URL("file:///");
    url.pathname = encodeWhitespace(path.replace(/%/g, "%25").replace(/\\/g, "%5C"));
    return url;
}
const mod1 = {
    sep: sep1,
    delimiter: delimiter1,
    resolve: resolve4,
    normalize: normalize1,
    isAbsolute: isAbsolute1,
    join: join1,
    relative: relative1,
    toNamespacedPath: toNamespacedPath1,
    dirname: dirname1,
    basename: basename1,
    extname: extname1,
    format: format1,
    parse: parse1,
    fromFileUrl: fromFileUrl1,
    toFileUrl: toFileUrl1
};
const path = isWindows1 ? mod : mod1;
const { join: join2, normalize: normalize2 } = path;
const path1 = isWindows1 ? mod : mod1;
const posix = mod1;
const { basename: basename2, delimiter: delimiter2, dirname: dirname2, extname: extname2, format: format2, fromFileUrl: fromFileUrl2, isAbsolute: isAbsolute2, join: join3, normalize: normalize3, parse: parse2, relative: relative2, resolve: resolve5, sep: sep2, toFileUrl: toFileUrl2, toNamespacedPath: toNamespacedPath2 } = path1;
const hexTable = new TextEncoder().encode("0123456789abcdef");
function encode(src) {
    const dst = new Uint8Array(src.length * 2);
    for(let i = 0; i < dst.length; i++){
        const v = src[i];
        dst[i * 2] = hexTable[v >> 4];
        dst[i * 2 + 1] = hexTable[v & 0x0f];
    }
    return dst;
}
function deferred() {
    let methods;
    let state = "pending";
    const promise = new Promise((resolve, reject)=>{
        methods = {
            async resolve (value) {
                await value;
                state = "fulfilled";
                resolve(value);
            },
            reject (reason) {
                state = "rejected";
                reject(reason);
            }
        };
    });
    Object.defineProperty(promise, "state", {
        get: ()=>state
    });
    return Object.assign(promise, methods);
}
function delay(ms, options = {}) {
    const { signal } = options;
    if (signal?.aborted) {
        return Promise.reject(new DOMException("Delay was aborted.", "AbortError"));
    }
    return new Promise((resolve, reject)=>{
        const abort = ()=>{
            clearTimeout(i);
            reject(new DOMException("Delay was aborted.", "AbortError"));
        };
        const done = ()=>{
            signal?.removeEventListener("abort", abort);
            resolve();
        };
        const i = setTimeout(done, ms);
        signal?.addEventListener("abort", abort, {
            once: true
        });
    });
}
var _computedKey;
_computedKey = Symbol.asyncIterator;
class MuxAsyncIterator {
    iteratorCount = 0;
    yields = [];
    throws = [];
    signal = deferred();
    add(iterable) {
        ++this.iteratorCount;
        this.callIteratorNext(iterable[Symbol.asyncIterator]());
    }
    async callIteratorNext(iterator) {
        try {
            const { value, done } = await iterator.next();
            if (done) {
                --this.iteratorCount;
            } else {
                this.yields.push({
                    iterator,
                    value
                });
            }
        } catch (e) {
            this.throws.push(e);
        }
        this.signal.resolve();
    }
    async *iterate() {
        while(this.iteratorCount > 0){
            await this.signal;
            for(let i = 0; i < this.yields.length; i++){
                const { iterator, value } = this.yields[i];
                yield value;
                this.callIteratorNext(iterator);
            }
            if (this.throws.length) {
                for (const e of this.throws){
                    throw e;
                }
                this.throws.length = 0;
            }
            this.yields.length = 0;
            this.signal = deferred();
        }
    }
    [_computedKey]() {
        return this.iterate();
    }
}
const ERROR_SERVER_CLOSED = "Server closed";
const INITIAL_ACCEPT_BACKOFF_DELAY = 5;
const MAX_ACCEPT_BACKOFF_DELAY = 1000;
class Server {
    #port;
    #host;
    #handler;
    #closed = false;
    #listeners = new Set();
    #httpConnections = new Set();
    #onError;
    constructor(serverInit){
        this.#port = serverInit.port;
        this.#host = serverInit.hostname;
        this.#handler = serverInit.handler;
        this.#onError = serverInit.onError ?? function(error) {
            console.error(error);
            return new Response("Internal Server Error", {
                status: 500
            });
        };
    }
    async serve(listener) {
        if (this.#closed) {
            throw new Deno.errors.Http(ERROR_SERVER_CLOSED);
        }
        this.#trackListener(listener);
        try {
            return await this.#accept(listener);
        } finally{
            this.#untrackListener(listener);
            try {
                listener.close();
            } catch  {}
        }
    }
    async listenAndServe() {
        if (this.#closed) {
            throw new Deno.errors.Http(ERROR_SERVER_CLOSED);
        }
        const listener = Deno.listen({
            port: this.#port ?? 80,
            hostname: this.#host ?? "0.0.0.0",
            transport: "tcp"
        });
        return await this.serve(listener);
    }
    async listenAndServeTls(certFile, keyFile) {
        if (this.#closed) {
            throw new Deno.errors.Http(ERROR_SERVER_CLOSED);
        }
        const listener = Deno.listenTls({
            port: this.#port ?? 443,
            hostname: this.#host ?? "0.0.0.0",
            certFile,
            keyFile,
            transport: "tcp"
        });
        return await this.serve(listener);
    }
    close() {
        if (this.#closed) {
            throw new Deno.errors.Http(ERROR_SERVER_CLOSED);
        }
        this.#closed = true;
        for (const listener of this.#listeners){
            try {
                listener.close();
            } catch  {}
        }
        this.#listeners.clear();
        for (const httpConn of this.#httpConnections){
            this.#closeHttpConn(httpConn);
        }
        this.#httpConnections.clear();
    }
    get closed() {
        return this.#closed;
    }
    get addrs() {
        return Array.from(this.#listeners).map((listener)=>listener.addr);
    }
    async #respond(requestEvent, httpConn, connInfo) {
        let response;
        try {
            response = await this.#handler(requestEvent.request, connInfo);
        } catch (error) {
            response = await this.#onError(error);
        }
        try {
            await requestEvent.respondWith(response);
        } catch  {
            return this.#closeHttpConn(httpConn);
        }
    }
    async #serveHttp(httpConn, connInfo) {
        while(!this.#closed){
            let requestEvent;
            try {
                requestEvent = await httpConn.nextRequest();
            } catch  {
                break;
            }
            if (requestEvent === null) {
                break;
            }
            this.#respond(requestEvent, httpConn, connInfo);
        }
        this.#closeHttpConn(httpConn);
    }
    async #accept(listener) {
        let acceptBackoffDelay;
        while(!this.#closed){
            let conn;
            try {
                conn = await listener.accept();
            } catch (error) {
                if (error instanceof Deno.errors.BadResource || error instanceof Deno.errors.InvalidData || error instanceof Deno.errors.UnexpectedEof || error instanceof Deno.errors.ConnectionReset || error instanceof Deno.errors.NotConnected) {
                    if (!acceptBackoffDelay) {
                        acceptBackoffDelay = INITIAL_ACCEPT_BACKOFF_DELAY;
                    } else {
                        acceptBackoffDelay *= 2;
                    }
                    if (acceptBackoffDelay >= 1000) {
                        acceptBackoffDelay = MAX_ACCEPT_BACKOFF_DELAY;
                    }
                    await delay(acceptBackoffDelay);
                    continue;
                }
                throw error;
            }
            acceptBackoffDelay = undefined;
            let httpConn;
            try {
                httpConn = Deno.serveHttp(conn);
            } catch  {
                continue;
            }
            this.#trackHttpConnection(httpConn);
            const connInfo = {
                localAddr: conn.localAddr,
                remoteAddr: conn.remoteAddr
            };
            this.#serveHttp(httpConn, connInfo);
        }
    }
    #closeHttpConn(httpConn) {
        this.#untrackHttpConnection(httpConn);
        try {
            httpConn.close();
        } catch  {}
    }
    #trackListener(listener) {
        this.#listeners.add(listener);
    }
    #untrackListener(listener) {
        this.#listeners.delete(listener);
    }
    #trackHttpConnection(httpConn) {
        this.#httpConnections.add(httpConn);
    }
    #untrackHttpConnection(httpConn) {
        this.#httpConnections.delete(httpConn);
    }
}
function hostnameForDisplay(hostname) {
    return hostname === "0.0.0.0" ? "localhost" : hostname;
}
async function serve(handler, options = {}) {
    const port = options.port ?? 8000;
    const hostname = options.hostname ?? "0.0.0.0";
    const server = new Server({
        port,
        hostname,
        handler,
        onError: options.onError
    });
    options?.signal?.addEventListener("abort", ()=>server.close(), {
        once: true
    });
    const s = server.listenAndServe();
    if ("onListen" in options) {
        options.onListen?.({
            port,
            hostname
        });
    } else {
        console.log(`Listening on http://${hostnameForDisplay(hostname)}:${port}/`);
    }
    return await s;
}
async function serveTls(handler, options) {
    if (!options.keyFile) {
        throw new Error("TLS config is given, but 'keyFile' is missing.");
    }
    if (!options.certFile) {
        throw new Error("TLS config is given, but 'certFile' is missing.");
    }
    const port = options.port ?? 8443;
    const hostname = options.hostname ?? "0.0.0.0";
    const server = new Server({
        port,
        hostname,
        handler,
        onError: options.onError
    });
    options?.signal?.addEventListener("abort", ()=>server.close(), {
        once: true
    });
    const s = server.listenAndServeTls(options.certFile, options.keyFile);
    if ("onListen" in options) {
        options.onListen?.({
            port,
            hostname
        });
    } else {
        console.log(`Listening on https://${hostnameForDisplay(hostname)}:${port}/`);
    }
    return await s;
}
var Status;
(function(Status) {
    Status[Status["Continue"] = 100] = "Continue";
    Status[Status["SwitchingProtocols"] = 101] = "SwitchingProtocols";
    Status[Status["Processing"] = 102] = "Processing";
    Status[Status["EarlyHints"] = 103] = "EarlyHints";
    Status[Status["OK"] = 200] = "OK";
    Status[Status["Created"] = 201] = "Created";
    Status[Status["Accepted"] = 202] = "Accepted";
    Status[Status["NonAuthoritativeInfo"] = 203] = "NonAuthoritativeInfo";
    Status[Status["NoContent"] = 204] = "NoContent";
    Status[Status["ResetContent"] = 205] = "ResetContent";
    Status[Status["PartialContent"] = 206] = "PartialContent";
    Status[Status["MultiStatus"] = 207] = "MultiStatus";
    Status[Status["AlreadyReported"] = 208] = "AlreadyReported";
    Status[Status["IMUsed"] = 226] = "IMUsed";
    Status[Status["MultipleChoices"] = 300] = "MultipleChoices";
    Status[Status["MovedPermanently"] = 301] = "MovedPermanently";
    Status[Status["Found"] = 302] = "Found";
    Status[Status["SeeOther"] = 303] = "SeeOther";
    Status[Status["NotModified"] = 304] = "NotModified";
    Status[Status["UseProxy"] = 305] = "UseProxy";
    Status[Status["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    Status[Status["PermanentRedirect"] = 308] = "PermanentRedirect";
    Status[Status["BadRequest"] = 400] = "BadRequest";
    Status[Status["Unauthorized"] = 401] = "Unauthorized";
    Status[Status["PaymentRequired"] = 402] = "PaymentRequired";
    Status[Status["Forbidden"] = 403] = "Forbidden";
    Status[Status["NotFound"] = 404] = "NotFound";
    Status[Status["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    Status[Status["NotAcceptable"] = 406] = "NotAcceptable";
    Status[Status["ProxyAuthRequired"] = 407] = "ProxyAuthRequired";
    Status[Status["RequestTimeout"] = 408] = "RequestTimeout";
    Status[Status["Conflict"] = 409] = "Conflict";
    Status[Status["Gone"] = 410] = "Gone";
    Status[Status["LengthRequired"] = 411] = "LengthRequired";
    Status[Status["PreconditionFailed"] = 412] = "PreconditionFailed";
    Status[Status["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
    Status[Status["RequestURITooLong"] = 414] = "RequestURITooLong";
    Status[Status["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
    Status[Status["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
    Status[Status["ExpectationFailed"] = 417] = "ExpectationFailed";
    Status[Status["Teapot"] = 418] = "Teapot";
    Status[Status["MisdirectedRequest"] = 421] = "MisdirectedRequest";
    Status[Status["UnprocessableEntity"] = 422] = "UnprocessableEntity";
    Status[Status["Locked"] = 423] = "Locked";
    Status[Status["FailedDependency"] = 424] = "FailedDependency";
    Status[Status["TooEarly"] = 425] = "TooEarly";
    Status[Status["UpgradeRequired"] = 426] = "UpgradeRequired";
    Status[Status["PreconditionRequired"] = 428] = "PreconditionRequired";
    Status[Status["TooManyRequests"] = 429] = "TooManyRequests";
    Status[Status["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
    Status[Status["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
    Status[Status["InternalServerError"] = 500] = "InternalServerError";
    Status[Status["NotImplemented"] = 501] = "NotImplemented";
    Status[Status["BadGateway"] = 502] = "BadGateway";
    Status[Status["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    Status[Status["GatewayTimeout"] = 504] = "GatewayTimeout";
    Status[Status["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
    Status[Status["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
    Status[Status["InsufficientStorage"] = 507] = "InsufficientStorage";
    Status[Status["LoopDetected"] = 508] = "LoopDetected";
    Status[Status["NotExtended"] = 510] = "NotExtended";
    Status[Status["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
})(Status || (Status = {}));
const STATUS_TEXT = new Map([
    [
        Status.Continue,
        "Continue"
    ],
    [
        Status.SwitchingProtocols,
        "Switching Protocols"
    ],
    [
        Status.Processing,
        "Processing"
    ],
    [
        Status.EarlyHints,
        "Early Hints"
    ],
    [
        Status.OK,
        "OK"
    ],
    [
        Status.Created,
        "Created"
    ],
    [
        Status.Accepted,
        "Accepted"
    ],
    [
        Status.NonAuthoritativeInfo,
        "Non-Authoritative Information"
    ],
    [
        Status.NoContent,
        "No Content"
    ],
    [
        Status.ResetContent,
        "Reset Content"
    ],
    [
        Status.PartialContent,
        "Partial Content"
    ],
    [
        Status.MultiStatus,
        "Multi-Status"
    ],
    [
        Status.AlreadyReported,
        "Already Reported"
    ],
    [
        Status.IMUsed,
        "IM Used"
    ],
    [
        Status.MultipleChoices,
        "Multiple Choices"
    ],
    [
        Status.MovedPermanently,
        "Moved Permanently"
    ],
    [
        Status.Found,
        "Found"
    ],
    [
        Status.SeeOther,
        "See Other"
    ],
    [
        Status.NotModified,
        "Not Modified"
    ],
    [
        Status.UseProxy,
        "Use Proxy"
    ],
    [
        Status.TemporaryRedirect,
        "Temporary Redirect"
    ],
    [
        Status.PermanentRedirect,
        "Permanent Redirect"
    ],
    [
        Status.BadRequest,
        "Bad Request"
    ],
    [
        Status.Unauthorized,
        "Unauthorized"
    ],
    [
        Status.PaymentRequired,
        "Payment Required"
    ],
    [
        Status.Forbidden,
        "Forbidden"
    ],
    [
        Status.NotFound,
        "Not Found"
    ],
    [
        Status.MethodNotAllowed,
        "Method Not Allowed"
    ],
    [
        Status.NotAcceptable,
        "Not Acceptable"
    ],
    [
        Status.ProxyAuthRequired,
        "Proxy Authentication Required"
    ],
    [
        Status.RequestTimeout,
        "Request Timeout"
    ],
    [
        Status.Conflict,
        "Conflict"
    ],
    [
        Status.Gone,
        "Gone"
    ],
    [
        Status.LengthRequired,
        "Length Required"
    ],
    [
        Status.PreconditionFailed,
        "Precondition Failed"
    ],
    [
        Status.RequestEntityTooLarge,
        "Request Entity Too Large"
    ],
    [
        Status.RequestURITooLong,
        "Request URI Too Long"
    ],
    [
        Status.UnsupportedMediaType,
        "Unsupported Media Type"
    ],
    [
        Status.RequestedRangeNotSatisfiable,
        "Requested Range Not Satisfiable"
    ],
    [
        Status.ExpectationFailed,
        "Expectation Failed"
    ],
    [
        Status.Teapot,
        "I'm a teapot"
    ],
    [
        Status.MisdirectedRequest,
        "Misdirected Request"
    ],
    [
        Status.UnprocessableEntity,
        "Unprocessable Entity"
    ],
    [
        Status.Locked,
        "Locked"
    ],
    [
        Status.FailedDependency,
        "Failed Dependency"
    ],
    [
        Status.TooEarly,
        "Too Early"
    ],
    [
        Status.UpgradeRequired,
        "Upgrade Required"
    ],
    [
        Status.PreconditionRequired,
        "Precondition Required"
    ],
    [
        Status.TooManyRequests,
        "Too Many Requests"
    ],
    [
        Status.RequestHeaderFieldsTooLarge,
        "Request Header Fields Too Large"
    ],
    [
        Status.UnavailableForLegalReasons,
        "Unavailable For Legal Reasons"
    ],
    [
        Status.InternalServerError,
        "Internal Server Error"
    ],
    [
        Status.NotImplemented,
        "Not Implemented"
    ],
    [
        Status.BadGateway,
        "Bad Gateway"
    ],
    [
        Status.ServiceUnavailable,
        "Service Unavailable"
    ],
    [
        Status.GatewayTimeout,
        "Gateway Timeout"
    ],
    [
        Status.HTTPVersionNotSupported,
        "HTTP Version Not Supported"
    ],
    [
        Status.VariantAlsoNegotiates,
        "Variant Also Negotiates"
    ],
    [
        Status.InsufficientStorage,
        "Insufficient Storage"
    ],
    [
        Status.LoopDetected,
        "Loop Detected"
    ],
    [
        Status.NotExtended,
        "Not Extended"
    ],
    [
        Status.NetworkAuthenticationRequired,
        "Network Authentication Required"
    ]
]);
const { hasOwn } = Object;
function get(obj, key) {
    if (hasOwn(obj, key)) {
        return obj[key];
    }
}
function getForce(obj, key) {
    const v = get(obj, key);
    assert(v != null);
    return v;
}
function isNumber(x) {
    if (typeof x === "number") return true;
    if (/^0x[0-9a-f]+$/i.test(String(x))) return true;
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(String(x));
}
function hasKey(obj, keys) {
    let o = obj;
    keys.slice(0, -1).forEach((key)=>{
        o = get(o, key) ?? {};
    });
    const key = keys[keys.length - 1];
    return key in o;
}
function parse3(args, { "--": doubleDash = false, alias = {}, boolean: __boolean = false, default: defaults = {}, stopEarly = false, string = [], unknown = (i)=>i } = {}) {
    const flags = {
        bools: {},
        strings: {},
        unknownFn: unknown,
        allBools: false
    };
    if (__boolean !== undefined) {
        if (typeof __boolean === "boolean") {
            flags.allBools = !!__boolean;
        } else {
            const booleanArgs = typeof __boolean === "string" ? [
                __boolean
            ] : __boolean;
            for (const key of booleanArgs.filter(Boolean)){
                flags.bools[key] = true;
            }
        }
    }
    const aliases = {};
    if (alias !== undefined) {
        for(const key in alias){
            const val = getForce(alias, key);
            if (typeof val === "string") {
                aliases[key] = [
                    val
                ];
            } else {
                aliases[key] = val;
            }
            for (const alias of getForce(aliases, key)){
                aliases[alias] = [
                    key
                ].concat(aliases[key].filter((y)=>alias !== y));
            }
        }
    }
    if (string !== undefined) {
        const stringArgs = typeof string === "string" ? [
            string
        ] : string;
        for (const key of stringArgs.filter(Boolean)){
            flags.strings[key] = true;
            const alias = get(aliases, key);
            if (alias) {
                for (const al of alias){
                    flags.strings[al] = true;
                }
            }
        }
    }
    const argv = {
        _: []
    };
    function argDefined(key, arg) {
        return flags.allBools && /^--[^=]+$/.test(arg) || get(flags.bools, key) || !!get(flags.strings, key) || !!get(aliases, key);
    }
    function setKey(obj, keys, value) {
        let o = obj;
        keys.slice(0, -1).forEach(function(key) {
            if (get(o, key) === undefined) {
                o[key] = {};
            }
            o = get(o, key);
        });
        const key = keys[keys.length - 1];
        if (get(o, key) === undefined || get(flags.bools, key) || typeof get(o, key) === "boolean") {
            o[key] = value;
        } else if (Array.isArray(get(o, key))) {
            o[key].push(value);
        } else {
            o[key] = [
                get(o, key),
                value
            ];
        }
    }
    function setArg(key, val, arg = undefined) {
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
            if (flags.unknownFn(arg, key, val) === false) return;
        }
        const value = !get(flags.strings, key) && isNumber(val) ? Number(val) : val;
        setKey(argv, key.split("."), value);
        const alias = get(aliases, key);
        if (alias) {
            for (const x of alias){
                setKey(argv, x.split("."), value);
            }
        }
    }
    function aliasIsBoolean(key) {
        return getForce(aliases, key).some((x)=>typeof get(flags.bools, x) === "boolean");
    }
    for (const key of Object.keys(flags.bools)){
        setArg(key, defaults[key] === undefined ? false : defaults[key]);
    }
    let notFlags = [];
    if (args.includes("--")) {
        notFlags = args.slice(args.indexOf("--") + 1);
        args = args.slice(0, args.indexOf("--"));
    }
    for(let i = 0; i < args.length; i++){
        const arg = args[i];
        if (/^--.+=/.test(arg)) {
            const m = arg.match(/^--([^=]+)=(.*)$/s);
            assert(m != null);
            const [, key, value] = m;
            if (flags.bools[key]) {
                const booleanValue = value !== "false";
                setArg(key, booleanValue, arg);
            } else {
                setArg(key, value, arg);
            }
        } else if (/^--no-.+/.test(arg)) {
            const m = arg.match(/^--no-(.+)/);
            assert(m != null);
            setArg(m[1], false, arg);
        } else if (/^--.+/.test(arg)) {
            const m = arg.match(/^--(.+)/);
            assert(m != null);
            const [, key] = m;
            const next = args[i + 1];
            if (next !== undefined && !/^-/.test(next) && !get(flags.bools, key) && !flags.allBools && (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                setArg(key, next, arg);
                i++;
            } else if (/^(true|false)$/.test(next)) {
                setArg(key, next === "true", arg);
                i++;
            } else {
                setArg(key, get(flags.strings, key) ? "" : true, arg);
            }
        } else if (/^-[^-]+/.test(arg)) {
            const letters = arg.slice(1, -1).split("");
            let broken = false;
            for(let j = 0; j < letters.length; j++){
                const next = arg.slice(j + 2);
                if (next === "-") {
                    setArg(letters[j], next, arg);
                    continue;
                }
                if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                    setArg(letters[j], next.split(/=(.+)/)[1], arg);
                    broken = true;
                    break;
                }
                if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j], next, arg);
                    broken = true;
                    break;
                }
                if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                    setArg(letters[j], arg.slice(j + 2), arg);
                    broken = true;
                    break;
                } else {
                    setArg(letters[j], get(flags.strings, letters[j]) ? "" : true, arg);
                }
            }
            const [key] = arg.slice(-1);
            if (!broken && key !== "-") {
                if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1]) && !get(flags.bools, key) && (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                    setArg(key, args[i + 1], arg);
                    i++;
                } else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
                    setArg(key, args[i + 1] === "true", arg);
                    i++;
                } else {
                    setArg(key, get(flags.strings, key) ? "" : true, arg);
                }
            }
        } else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                argv._.push(flags.strings["_"] ?? !isNumber(arg) ? arg : Number(arg));
            }
            if (stopEarly) {
                argv._.push(...args.slice(i + 1));
                break;
            }
        }
    }
    for (const key of Object.keys(defaults)){
        if (!hasKey(argv, key.split("."))) {
            setKey(argv, key.split("."), defaults[key]);
            if (aliases[key]) {
                for (const x of aliases[key]){
                    setKey(argv, x.split("."), defaults[key]);
                }
            }
        }
    }
    if (doubleDash) {
        argv["--"] = [];
        for (const key of notFlags){
            argv["--"].push(key);
        }
    } else {
        for (const key of notFlags){
            argv._.push(key);
        }
    }
    return argv;
}
const { Deno: Deno1 } = globalThis;
const noColor = typeof Deno1?.noColor === "boolean" ? Deno1.noColor : true;
let enabled = !noColor;
function code(open, close) {
    return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g")
    };
}
function run(str, code) {
    return enabled ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}` : str;
}
function red(str) {
    return run(str, code([
        31
    ], 39));
}
new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"
].join("|"), "g");
const importMeta = {
    url: "https://deno.land/std@0.140.0/http/file_server.ts",
    main: false
};
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const MEDIA_TYPES = {
    ".md": "text/markdown",
    ".html": "text/html",
    ".htm": "text/html",
    ".json": "application/json",
    ".map": "application/json",
    ".txt": "text/plain",
    ".ts": "text/typescript",
    ".tsx": "text/tsx",
    ".js": "application/javascript",
    ".jsx": "text/jsx",
    ".gz": "application/gzip",
    ".css": "text/css",
    ".wasm": "application/wasm",
    ".mjs": "application/javascript",
    ".otf": "font/otf",
    ".ttf": "font/ttf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".conf": "text/plain",
    ".list": "text/plain",
    ".log": "text/plain",
    ".ini": "text/plain",
    ".vtt": "text/vtt",
    ".yaml": "text/yaml",
    ".yml": "text/yaml",
    ".mid": "audio/midi",
    ".midi": "audio/midi",
    ".mp3": "audio/mp3",
    ".mp4a": "audio/mp4",
    ".m4a": "audio/mp4",
    ".ogg": "audio/ogg",
    ".spx": "audio/ogg",
    ".opus": "audio/ogg",
    ".wav": "audio/wav",
    ".webm": "audio/webm",
    ".aac": "audio/x-aac",
    ".flac": "audio/x-flac",
    ".mp4": "video/mp4",
    ".mp4v": "video/mp4",
    ".mkv": "video/x-matroska",
    ".mov": "video/quicktime",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
    ".bmp": "image/bmp",
    ".gif": "image/gif",
    ".heic": "image/heic",
    ".heif": "image/heif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".tiff": "image/tiff",
    ".psd": "image/vnd.adobe.photoshop",
    ".ico": "image/vnd.microsoft.icon",
    ".webp": "image/webp",
    ".es": "application/ecmascript",
    ".epub": "application/epub+zip",
    ".jar": "application/java-archive",
    ".war": "application/java-archive",
    ".webmanifest": "application/manifest+json",
    ".doc": "application/msword",
    ".dot": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".dotx": "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
    ".cjs": "application/node",
    ".bin": "application/octet-stream",
    ".pkg": "application/octet-stream",
    ".dump": "application/octet-stream",
    ".exe": "application/octet-stream",
    ".deploy": "application/octet-stream",
    ".img": "application/octet-stream",
    ".msi": "application/octet-stream",
    ".pdf": "application/pdf",
    ".pgp": "application/pgp-encrypted",
    ".asc": "application/pgp-signature",
    ".sig": "application/pgp-signature",
    ".ai": "application/postscript",
    ".eps": "application/postscript",
    ".ps": "application/postscript",
    ".rdf": "application/rdf+xml",
    ".rss": "application/rss+xml",
    ".rtf": "application/rtf",
    ".apk": "application/vnd.android.package-archive",
    ".key": "application/vnd.apple.keynote",
    ".numbers": "application/vnd.apple.keynote",
    ".pages": "application/vnd.apple.pages",
    ".geo": "application/vnd.dynageo",
    ".gdoc": "application/vnd.google-apps.document",
    ".gslides": "application/vnd.google-apps.presentation",
    ".gsheet": "application/vnd.google-apps.spreadsheet",
    ".kml": "application/vnd.google-earth.kml+xml",
    ".mkz": "application/vnd.google-earth.kmz",
    ".icc": "application/vnd.iccprofile",
    ".icm": "application/vnd.iccprofile",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xlm": "application/vnd.ms-excel",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pot": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".potx": "application/vnd.openxmlformats-officedocument.presentationml.template",
    ".xps": "application/vnd.ms-xpsdocument",
    ".odc": "application/vnd.oasis.opendocument.chart",
    ".odb": "application/vnd.oasis.opendocument.database",
    ".odf": "application/vnd.oasis.opendocument.formula",
    ".odg": "application/vnd.oasis.opendocument.graphics",
    ".odp": "application/vnd.oasis.opendocument.presentation",
    ".ods": "application/vnd.oasis.opendocument.spreadsheet",
    ".odt": "application/vnd.oasis.opendocument.text",
    ".rar": "application/vnd.rar",
    ".unityweb": "application/vnd.unity",
    ".dmg": "application/x-apple-diskimage",
    ".bz": "application/x-bzip",
    ".crx": "application/x-chrome-extension",
    ".deb": "application/x-debian-package",
    ".php": "application/x-httpd-php",
    ".iso": "application/x-iso9660-image",
    ".sh": "application/x-sh",
    ".sql": "application/x-sql",
    ".srt": "application/x-subrip",
    ".xml": "application/xml",
    ".zip": "application/zip"
};
function contentType(path) {
    return MEDIA_TYPES[extname2(path)];
}
function fnv1a(buf) {
    let hash = 2166136261;
    for(let i = 0; i < buf.length; i++){
        hash ^= buf.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16);
}
async function createEtagHash(message, algorithm = "fnv1a") {
    if (algorithm === "fnv1a") {
        return fnv1a(message);
    }
    const msgUint8 = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
    return decoder.decode(encode(new Uint8Array(hashBuffer)));
}
function modeToString(isDir, maybeMode) {
    const modeMap = [
        "---",
        "--x",
        "-w-",
        "-wx",
        "r--",
        "r-x",
        "rw-",
        "rwx"
    ];
    if (maybeMode === null) {
        return "(unknown mode)";
    }
    const mode = maybeMode.toString(8);
    if (mode.length < 3) {
        return "(unknown mode)";
    }
    let output = "";
    mode.split("").reverse().slice(0, 3).forEach((v)=>{
        output = `${modeMap[+v]} ${output}`;
    });
    output = `${isDir ? "d" : "-"} ${output}`;
    return output;
}
function fileLenToString(len) {
    const multiplier = 1024;
    let base = 1;
    const suffix = [
        "B",
        "K",
        "M",
        "G",
        "T"
    ];
    let suffixIndex = 0;
    while(base * 1024 < len){
        if (suffixIndex >= suffix.length - 1) {
            break;
        }
        base *= multiplier;
        suffixIndex++;
    }
    return `${(len / base).toFixed(2)}${suffix[suffixIndex]}`;
}
async function serveFile(req, filePath, { etagAlgorithm, fileInfo } = {}) {
    let file;
    if (fileInfo === undefined) {
        [file, fileInfo] = await Promise.all([
            Deno.open(filePath),
            Deno.stat(filePath)
        ]);
    } else {
        file = await Deno.open(filePath);
    }
    const headers = setBaseHeaders();
    const contentTypeValue = contentType(filePath);
    if (contentTypeValue) {
        headers.set("content-type", contentTypeValue);
    }
    if (fileInfo.atime instanceof Date) {
        const date = new Date(fileInfo.atime);
        headers.set("date", date.toUTCString());
    }
    if (fileInfo.mtime instanceof Date) {
        const lastModified = new Date(fileInfo.mtime);
        headers.set("last-modified", lastModified.toUTCString());
        const simpleEtag = await createEtagHash(`${lastModified.toJSON()}${fileInfo.size}`, etagAlgorithm || "fnv1a");
        headers.set("etag", simpleEtag);
        const ifNoneMatch = req.headers.get("if-none-match");
        const ifModifiedSince = req.headers.get("if-modified-since");
        if (ifNoneMatch && (ifNoneMatch === simpleEtag || "W/" + ifNoneMatch === simpleEtag || ifNoneMatch === "W/" + simpleEtag) || ifNoneMatch === null && ifModifiedSince && fileInfo.mtime.getTime() < new Date(ifModifiedSince).getTime() + 1000) {
            const status = Status.NotModified;
            const statusText = STATUS_TEXT.get(status);
            file.close();
            return new Response(null, {
                status,
                statusText,
                headers
            });
        }
    }
    const range = req.headers.get("range");
    const rangeRe = /bytes=(\d+)-(\d+)?/;
    const parsed = rangeRe.exec(range);
    const start = parsed && parsed[1] ? +parsed[1] : 0;
    const end = parsed && parsed[2] ? +parsed[2] : fileInfo.size - 1;
    if (range && parsed) {
        headers.set("content-range", `bytes ${start}-${end}/${fileInfo.size}`);
    }
    const maxRange = fileInfo.size - 1;
    if (range && (!parsed || typeof start !== "number" || start > end || start > maxRange || end > maxRange)) {
        const status = Status.RequestedRangeNotSatisfiable;
        const statusText = STATUS_TEXT.get(status);
        file.close();
        return new Response(statusText, {
            status,
            statusText,
            headers
        });
    }
    const contentLength = end - start + 1;
    headers.set("content-length", `${contentLength}`);
    if (range && parsed) {
        let bytesSent = 0;
        const body = new ReadableStream({
            async start () {
                if (start > 0) {
                    await file.seek(start, Deno.SeekMode.Start);
                }
            },
            async pull (controller) {
                const bytes = new Uint8Array(16_640);
                const bytesRead = await file.read(bytes);
                if (bytesRead === null) {
                    file.close();
                    controller.close();
                    return;
                }
                controller.enqueue(bytes.slice(0, Math.min(bytesRead, contentLength - bytesSent)));
                bytesSent += bytesRead;
                if (bytesSent > contentLength) {
                    file.close();
                    controller.close();
                }
            }
        });
        return new Response(body, {
            status: 206,
            statusText: "Partial Content",
            headers
        });
    }
    return new Response(file.readable, {
        status: 200,
        statusText: "OK",
        headers
    });
}
async function serveDirIndex(req, dirPath, options) {
    const showDotfiles = options.dotfiles;
    const dirUrl = `/${mod1.relative(options.target, dirPath)}`;
    const listEntry = [];
    if (dirUrl !== "/") {
        const prevPath = mod1.join(dirPath, "..");
        const fileInfo = await Deno.stat(prevPath);
        listEntry.push({
            mode: modeToString(true, fileInfo.mode),
            size: "",
            name: "../",
            url: mod1.join(dirUrl, "..")
        });
    }
    for await (const entry of Deno.readDir(dirPath)){
        if (!showDotfiles && entry.name[0] === ".") {
            continue;
        }
        const filePath = mod1.join(dirPath, entry.name);
        const fileUrl = encodeURI(mod1.join(dirUrl, entry.name));
        const fileInfo = await Deno.stat(filePath);
        if (entry.name === "index.html" && entry.isFile) {
            return serveFile(req, filePath, {
                etagAlgorithm: options.etagAlgorithm,
                fileInfo
            });
        }
        listEntry.push({
            mode: modeToString(entry.isDirectory, fileInfo.mode),
            size: entry.isFile ? fileLenToString(fileInfo.size ?? 0) : "",
            name: `${entry.name}${entry.isDirectory ? "/" : ""}`,
            url: `${fileUrl}${entry.isDirectory ? "/" : ""}`
        });
    }
    listEntry.sort((a, b)=>a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    const formattedDirUrl = `${dirUrl.replace(/\/$/, "")}/`;
    const page = encoder.encode(dirViewerTemplate(formattedDirUrl, listEntry));
    const headers = setBaseHeaders();
    headers.set("content-type", "text/html");
    return new Response(page, {
        status: Status.OK,
        headers
    });
}
function serveFallback(_req, e) {
    if (e instanceof URIError) {
        return Promise.resolve(new Response(STATUS_TEXT.get(Status.BadRequest), {
            status: Status.BadRequest
        }));
    } else if (e instanceof Deno.errors.NotFound) {
        return Promise.resolve(new Response(STATUS_TEXT.get(Status.NotFound), {
            status: Status.NotFound
        }));
    }
    return Promise.resolve(new Response(STATUS_TEXT.get(Status.InternalServerError), {
        status: Status.InternalServerError
    }));
}
function serverLog(req, status) {
    const d = new Date().toISOString();
    const dateFmt = `[${d.slice(0, 10)} ${d.slice(11, 19)}]`;
    const normalizedUrl = normalizeURL(req.url);
    const s = `${dateFmt} [${req.method}] ${normalizedUrl} ${status}`;
    console.debug(s);
}
function setBaseHeaders() {
    const headers = new Headers();
    headers.set("server", "deno");
    headers.set("accept-ranges", "bytes");
    headers.set("date", new Date().toUTCString());
    return headers;
}
function dirViewerTemplate(dirname, entries) {
    const paths = dirname.split("/");
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Deno File Server</title>
        <style>
          :root {
            --background-color: #fafafa;
            --color: rgba(0, 0, 0, 0.87);
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --background-color: #292929;
              --color: #fff;
            }
            thead {
              color: #7f7f7f;
            }
          }
          @media (min-width: 960px) {
            main {
              max-width: 960px;
            }
            body {
              padding-left: 32px;
              padding-right: 32px;
            }
          }
          @media (min-width: 600px) {
            main {
              padding-left: 24px;
              padding-right: 24px;
            }
          }
          body {
            background: var(--background-color);
            color: var(--color);
            font-family: "Roboto", "Helvetica", "Arial", sans-serif;
            font-weight: 400;
            line-height: 1.43;
            font-size: 0.875rem;
          }
          a {
            color: #2196f3;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          thead {
            text-align: left;
          }
          thead th {
            padding-bottom: 12px;
          }
          table td {
            padding: 6px 36px 6px 0px;
          }
          .size {
            text-align: right;
            padding: 6px 12px 6px 24px;
          }
          .mode {
            font-family: monospace, monospace;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Index of
          <a href="/">home</a>${paths.map((path, index, array)=>{
        if (path === "") return "";
        const link = array.slice(0, index + 1).join("/");
        return `<a href="${link}">${path}</a>`;
    }).join("/")}
          </h1>
          <table>
            <thead>
              <tr>
                <th>Mode</th>
                <th>Size</th>
                <th>Name</th>
              </tr>
            </thead>
            ${entries.map((entry)=>`
                  <tr>
                    <td class="mode">
                      ${entry.mode}
                    </td>
                    <td class="size">
                      ${entry.size}
                    </td>
                    <td>
                      <a href="${entry.url}">${entry.name}</a>
                    </td>
                  </tr>
                `).join("")}
          </table>
        </main>
      </body>
    </html>
  `;
}
async function serveDir(req, opts = {}) {
    let response;
    const target = opts.fsRoot || ".";
    const urlRoot = opts.urlRoot;
    try {
        let normalizedPath = normalizeURL(req.url);
        if (urlRoot) {
            if (normalizedPath.startsWith("/" + urlRoot)) {
                normalizedPath = normalizedPath.replace(urlRoot, "");
            } else {
                throw new Deno.errors.NotFound();
            }
        }
        const fsPath = mod1.join(target, normalizedPath);
        const fileInfo = await Deno.stat(fsPath);
        if (fileInfo.isDirectory) {
            if (opts.showDirListing) {
                response = await serveDirIndex(req, fsPath, {
                    dotfiles: opts.showDotfiles || false,
                    target
                });
            } else {
                throw new Deno.errors.NotFound();
            }
        } else {
            response = await serveFile(req, fsPath, {
                etagAlgorithm: opts.etagAlgorithm,
                fileInfo
            });
        }
    } catch (e) {
        const err = e instanceof Error ? e : new Error("[non-error thrown]");
        console.error(red(err.message));
        response = await serveFallback(req, err);
    }
    if (opts.enableCors) {
        assert(response);
        response.headers.append("access-control-allow-origin", "*");
        response.headers.append("access-control-allow-headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    }
    if (!opts.quiet) serverLog(req, response.status);
    return response;
}
function normalizeURL(url) {
    let normalizedUrl = url;
    try {
        const absoluteURI = new URL(normalizedUrl);
        normalizedUrl = absoluteURI.pathname;
    } catch (e) {
        if (!(e instanceof TypeError)) {
            throw e;
        }
    }
    try {
        normalizedUrl = decodeURI(normalizedUrl);
    } catch (e) {
        if (!(e instanceof URIError)) {
            throw e;
        }
    }
    if (normalizedUrl[0] !== "/") {
        throw new URIError("The request URI is malformed.");
    }
    normalizedUrl = posix.normalize(normalizedUrl);
    const startOfParams = normalizedUrl.indexOf("?");
    return startOfParams > -1 ? normalizedUrl.slice(0, startOfParams) : normalizedUrl;
}
function main() {
    const serverArgs = parse3(Deno.args, {
        string: [
            "port",
            "host",
            "cert",
            "key"
        ],
        boolean: [
            "help",
            "dir-listing",
            "dotfiles",
            "cors",
            "verbose"
        ],
        default: {
            "dir-listing": true,
            dotfiles: true,
            cors: true,
            verbose: false,
            host: "0.0.0.0",
            port: "4507",
            cert: "",
            key: ""
        },
        alias: {
            p: "port",
            c: "cert",
            k: "key",
            h: "help",
            v: "verbose"
        }
    });
    const port = serverArgs.port;
    const host = serverArgs.host;
    const certFile = serverArgs.cert;
    const keyFile = serverArgs.key;
    if (serverArgs.help) {
        printUsage();
        Deno.exit();
    }
    if (keyFile || certFile) {
        if (keyFile === "" || certFile === "") {
            console.log("--key and --cert are required for TLS");
            printUsage();
            Deno.exit(1);
        }
    }
    const wild = serverArgs._;
    const target = mod1.resolve(wild[0] ?? "");
    const handler = (req)=>{
        return serveDir(req, {
            fsRoot: target,
            showDirListing: serverArgs["dir-listing"],
            showDotfiles: serverArgs.dotfiles,
            enableCors: serverArgs.cors,
            quiet: !serverArgs.verbose
        });
    };
    const useTls = Boolean(keyFile || certFile);
    if (useTls) {
        serveTls(handler, {
            port: Number(port),
            hostname: host,
            certFile,
            keyFile
        });
    } else {
        serve(handler, {
            port: Number(port),
            hostname: host
        });
    }
}
function printUsage() {
    console.log(`Deno File Server
  Serves a local directory in HTTP.

INSTALL:
  deno install --allow-net --allow-read https://deno.land/std/http/file_server.ts

USAGE:
  file_server [path] [options]

OPTIONS:
  -h, --help          Prints help information
  -p, --port <PORT>   Set port
  --cors              Enable CORS via the "Access-Control-Allow-Origin" header
  --host     <HOST>   Hostname (default is 0.0.0.0)
  -c, --cert <FILE>   TLS certificate file (enables TLS)
  -k, --key  <FILE>   TLS key file (enables TLS)
  --no-dir-listing    Disable directory listing
  --no-dotfiles       Do not show dotfiles
  -v, --verbose       Print request level logs

  All TLS options are required when one is provided.`);
}
if (importMeta.main) {
    main();
}
const ONLY_WEB_SOURCE = "https://raw.githubusercontent.com/daniellacosse-code/onlyweb.dev";
const ONLY_WEB_SOURCE_BRANCH = "main";
const mod2 = function() {
    return {
        ONLY_WEB_SOURCE: ONLY_WEB_SOURCE,
        ONLY_WEB_SOURCE_BRANCH: ONLY_WEB_SOURCE_BRANCH,
        ONLY_WEB_SERVER_PORT: 8000
    };
}();
const resolveConfiguration = (configName)=>Deno.env.get(configName) ?? mod2[configName];
const __default = ({ port = resolveConfiguration("ONLY_WEB_SERVER_PORT") } = {})=>Deno.serve({
        hostname: "localhost",
        port
    }, async (request)=>{
        const requestURL = new URL(request.url);
        const requestPath = requestURL.pathname.startsWith("/") ? requestURL.pathname : `/${requestURL.pathname}`;
        for (const route of globalThis.customPages.keys()){
            if (requestPath === route) {
                return globalThis.customPages.get(route)(request);
            }
        }
        try {
            return serveFile(request, resolve2(Deno.cwd(), `.${requestPath}`));
        } catch  {
            return new Response("Not Found", {
                status: 404
            });
        }
    });
const encoder1 = new TextEncoder();
function getTypeName(value) {
    const type = typeof value;
    if (type !== "object") {
        return type;
    } else if (value === null) {
        return "null";
    } else {
        return value?.constructor?.name ?? "object";
    }
}
function validateBinaryLike(source) {
    if (typeof source === "string") {
        return encoder1.encode(source);
    } else if (source instanceof Uint8Array) {
        return source;
    } else if (source instanceof ArrayBuffer) {
        return new Uint8Array(source);
    }
    throw new TypeError(`The input must be a Uint8Array, a string, or an ArrayBuffer. Received a value of the type ${getTypeName(source)}.`);
}
const base64abc = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/"
];
function encodeBase64(data) {
    const uint8 = validateBinaryLike(data);
    let result = "";
    let i;
    const l = uint8.length;
    for(i = 2; i < l; i += 3){
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 0x03) << 4 | uint8[i - 1] >> 4];
        result += base64abc[(uint8[i - 1] & 0x0f) << 2 | uint8[i] >> 6];
        result += base64abc[uint8[i] & 0x3f];
    }
    if (i === l + 1) {
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 0x03) << 4];
        result += "==";
    }
    if (i === l) {
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 0x03) << 4 | uint8[i - 1] >> 4];
        result += base64abc[(uint8[i - 1] & 0x0f) << 2];
        result += "=";
    }
    return result;
}
function assertPath2(path) {
    if (typeof path !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
    }
}
const CHAR_FORWARD_SLASH2 = 47;
function isPathSeparator2(code) {
    return code === 47 || code === 92;
}
function isWindowsDeviceRoot2(code) {
    return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
class AssertionError extends Error {
    constructor(message){
        super(message);
        this.name = "AssertionError";
    }
}
function assert1(expr, msg = "") {
    if (!expr) {
        throw new AssertionError(msg);
    }
}
function assertArg(path) {
    assertPath2(path);
    if (path.length === 0) return ".";
}
function normalizeString2(path, allowAboveRoot, separator, isPathSeparator) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for(let i = 0; i <= path.length; ++i){
        if (i < path.length) code = path.charCodeAt(i);
        else if (isPathSeparator(code)) break;
        else code = CHAR_FORWARD_SLASH2;
        if (isPathSeparator(code)) {
            if (lastSlash === i - 1 || dots === 1) {} else if (lastSlash !== i - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator);
                        if (lastSlashIndex === -1) {
                            res = "";
                            lastSegmentLength = 0;
                        } else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += `${separator}..`;
                    else res = "..";
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += separator + path.slice(lastSlash + 1, i);
                else res = path.slice(lastSlash + 1, i);
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        } else if (code === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function normalize4(path) {
    assertArg(path);
    const len = path.length;
    let rootEnd = 0;
    let device;
    let isAbsolute = false;
    const code = path.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator2(code)) {
            isAbsolute = true;
            if (isPathSeparator2(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator2(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    const firstPart = path.slice(last, j);
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator2(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator2(path.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return `\\\\${firstPart}\\${path.slice(last)}\\`;
                        } else if (j !== last) {
                            device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                            rootEnd = j;
                        }
                    }
                }
            } else {
                rootEnd = 1;
            }
        } else if (isWindowsDeviceRoot2(code)) {
            if (path.charCodeAt(1) === 58) {
                device = path.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator2(path.charCodeAt(2))) {
                        isAbsolute = true;
                        rootEnd = 3;
                    }
                }
            }
        }
    } else if (isPathSeparator2(code)) {
        return "\\";
    }
    let tail;
    if (rootEnd < len) {
        tail = normalizeString2(path.slice(rootEnd), !isAbsolute, "\\", isPathSeparator2);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute) tail = ".";
    if (tail.length > 0 && isPathSeparator2(path.charCodeAt(len - 1))) {
        tail += "\\";
    }
    if (device === undefined) {
        if (isAbsolute) {
            if (tail.length > 0) return `\\${tail}`;
            else return "\\";
        } else if (tail.length > 0) {
            return tail;
        } else {
            return "";
        }
    } else if (isAbsolute) {
        if (tail.length > 0) return `${device}\\${tail}`;
        else return `${device}\\`;
    } else if (tail.length > 0) {
        return device + tail;
    } else {
        return device;
    }
}
function join4(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    let firstPart = null;
    for(let i = 0; i < paths.length; ++i){
        const path = paths[i];
        assertPath2(path);
        if (path.length > 0) {
            if (joined === undefined) joined = firstPart = path;
            else joined += `\\${path}`;
        }
    }
    if (joined === undefined) return ".";
    let needsReplace = true;
    let slashCount = 0;
    assert1(firstPart !== null);
    if (isPathSeparator2(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
            if (isPathSeparator2(firstPart.charCodeAt(1))) {
                ++slashCount;
                if (firstLen > 2) {
                    if (isPathSeparator2(firstPart.charCodeAt(2))) ++slashCount;
                    else {
                        needsReplace = false;
                    }
                }
            }
        }
    }
    if (needsReplace) {
        for(; slashCount < joined.length; ++slashCount){
            if (!isPathSeparator2(joined.charCodeAt(slashCount))) break;
        }
        if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
    }
    return normalize4(joined);
}
function isPosixPathSeparator2(code) {
    return code === 47;
}
function normalize5(path) {
    assertArg(path);
    const isAbsolute = isPosixPathSeparator2(path.charCodeAt(0));
    const trailingSeparator = isPosixPathSeparator2(path.charCodeAt(path.length - 1));
    path = normalizeString2(path, !isAbsolute, "/", isPosixPathSeparator2);
    if (path.length === 0 && !isAbsolute) path = ".";
    if (path.length > 0 && trailingSeparator) path += "/";
    if (isAbsolute) return `/${path}`;
    return path;
}
function join5(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i = 0; i < paths.length; ++i){
        const path = paths[i];
        assertPath2(path);
        if (path.length > 0) {
            if (!joined) joined = path;
            else joined += `/${path}`;
        }
    }
    if (!joined) return ".";
    return normalize5(joined);
}
const osType2 = (()=>{
    const { Deno: Deno1 } = globalThis;
    if (typeof Deno1?.build?.os === "string") {
        return Deno1.build.os;
    }
    const { navigator } = globalThis;
    if (navigator?.appVersion?.includes?.("Win")) {
        return "windows";
    }
    return "linux";
})();
const isWindows2 = osType2 === "windows";
function join6(...paths) {
    return isWindows2 ? join4(...paths) : join5(...paths);
}
const __default1 = ({ template, insertions, handleInsertion })=>insertions.reduce((result, insertion, index)=>{
        let handledInsertion = "";
        if (Array.isArray(insertion)) {
            insertion.forEach((subInsertion)=>{
                handledInsertion += handleInsertion(subInsertion);
            });
        } else {
            handledInsertion = handleInsertion(insertion);
        }
        return result + (template.at(index) ?? "") + handledInsertion;
    }, "") + (template.at(-1) ?? "");
const escapedCharacters = new Map([
    [
        "&",
        "&amp;"
    ],
    [
        "<",
        "&lt;"
    ],
    [
        ">",
        "&gt;"
    ],
    [
        "'",
        "&#39;"
    ],
    [
        '"',
        "&quot;"
    ]
]);
const __default2 = (html)=>{
    let result = "";
    for (const __char of String(html)){
        result += escapedCharacters.get(__char) ?? __char;
    }
    return result;
};
const __default3 = (text)=>{
    return text.replaceAll(/[^\:\\]\/\/.*/g, "").replaceAll(/\s+/g, " ").replaceAll(/<\!--.*?-->|\/\*.*?\*\//g, "").trim();
};
const ENGINE_CHECKERS = {
    Firefox: /Firefox\/(?<version>\S+)/,
    Seamonkey: /Seamonkey\/(?<version>\S+)/,
    Chrome: /Chrome\/(?<version>\S+)/,
    Chromium: /Chromium\/(?<version>\S+)/,
    Edge: /Edg.*\/(?<version>\S+)/,
    Safari: /Safari\/(?<version>\S+)/,
    OperaLegacy: /Opera\/(?<version>\S+)/,
    Opera: /OPR\/(?<version>\S+)/
};
const RENDERER_CHECKERS = {
    Gecko: /Gecko\/(?<version>\S+)/,
    WebKit: /WebKit\/(?<version>\S+)/,
    Blink: /Blink\/(?<version>\S+)/,
    Presto: /Presto\/(?<version>\S+)/,
    EdgeHTML: /Edge\/(?<version>\S+)/
};
const __default4 = (userAgent)=>{
    const platform = {};
    for(const untypedRendererName in RENDERER_CHECKERS){
        const rendererName = untypedRendererName;
        const result = userAgent.match(RENDERER_CHECKERS[rendererName]);
        if (result?.groups?.version) {
            platform.renderer = {
                name: rendererName,
                version: parseFloat(result.groups.version)
            };
            break;
        }
    }
    const engines = {};
    for(const untypedEngineName in ENGINE_CHECKERS){
        const engineName = untypedEngineName;
        const result = userAgent.match(ENGINE_CHECKERS[engineName]);
        if (result?.groups?.version) {
            engines[engineName] = {
                name: engineName,
                version: parseFloat(result.groups.version)
            };
        }
    }
    if (engines.Firefox && !engines.Seamonkey) platform.engine = engines.Firefox;
    if (engines.Seamonkey) platform.engine = engines.Seamonkey;
    if (engines.Chrome && !engines.Chromium && !engines.Edge) platform.engine = engines.Chrome;
    if (engines.Chromium) platform.engine = engines.Chromium;
    if (engines.Safari && !engines.Chrome && !engines.Chromium) platform.engine = engines.Safari;
    if (engines.OperaLegacy) platform.engine = engines.OperaLegacy;
    if (engines.Opera) platform.engine = engines.Opera;
    return Object.freeze(platform);
};
const __default5 = ({ engine, renderer }, requirements)=>{
    let result = true;
    if (requirements.engine) {
        result &&= (engine.version ?? 0) >= (requirements.engine[engine.name] ?? 0);
    }
    if (requirements.renderer) {
        result &&= (renderer.version ?? 0) >= (requirements.renderer[renderer.name] ?? 0);
    }
    return result;
};
const __default6 = (...requirements)=>{
    const result = requirements[0];
    for (const requirement of requirements){
        if (!requirement) continue;
        if (requirement.engine) {
            result.engine ??= {};
            for(const untypedEngineName in requirement.engine){
                const engineName = untypedEngineName;
                result.engine[engineName] = Math.max(result.engine[engineName] ?? 0, requirement.engine[engineName] ?? 0);
            }
        }
        if (requirement.renderer) {
            result.renderer ??= {};
            for(const untypedRendererName in requirement.renderer){
                const rendererName = untypedRendererName;
                result.renderer[rendererName] = Math.max(result.renderer[rendererName] ?? 0, requirement.renderer[rendererName] ?? 0);
            }
        }
    }
    return result;
};
const MAX_DETAIL_LENGTH = 256;
const LOG_LEVELS = {
    debug: 0,
    info: 1,
    data: 2,
    warn: 3,
    error: 4,
    critical: 5
};
const Log = ({ message, detail, level = "info", _console = console })=>{
    const logObject = {
        o: new Date().toISOString(),
        l: LOG_LEVELS[level],
        m: message.trim().slice(0, 128)
    };
    if (logObject.m.length === 128) {
        logObject.m += "…";
    }
    if (detail) {
        logObject.d = __default3(JSON.stringify(detail)).slice(0, MAX_DETAIL_LENGTH);
        if (logObject.d.length === 256) {
            logObject.d += "…";
        }
    }
    _console[level](JSON.stringify(logObject));
};
const LogError = (error)=>Log({
        message: error.message,
        detail: error,
        level: "error"
    });
const __default7 = {
    UserAgent: {
        parse: __default4,
        check: __default5,
        merge: __default6
    },
    HTML: {
        escape: __default2,
        minify: __default3
    },
    Log,
    LogError,
    handleTemplate: __default1
};
const _Response = (mimetype = "text/html")=>{
    class MimetypeResponse extends Response {
        constructor(body, init = undefined){
            super(body, init);
            __default7.Log({
                message: `[framework/backend/response] Constructed a response with mimetype "${mimetype}"`,
                detail: {
                    body
                },
                level: "debug"
            });
            this.#content = body;
            this.#mimetype = mimetype;
            this.headers.set("content-type", `${mimetype}; charset=UTF-8`);
        }
        #content = "";
        get content() {
            return this.#content;
        }
        #mimetype = "";
        get mimetype() {
            return this.#mimetype;
        }
    }
    return (template, ...insertions)=>new MimetypeResponse(__default7.handleTemplate({
            template,
            insertions,
            handleInsertion: (insertion)=>{
                if (insertion instanceof MimetypeResponse) {
                    return __default7.HTML.minify(insertion.content);
                }
                const subinsertions = Array.isArray(insertion) ? insertion.reverse() : [
                    insertion
                ];
                const result = [];
                while(subinsertions.length){
                    const subinsertion = subinsertions.pop();
                    if (Array.isArray(subinsertion)) {
                        subinsertions.unshift(...subinsertion);
                    } else if (typeof subinsertion === "function") {
                        result.push(subinsertion.toString());
                    } else if (String(subinsertion) === "[object Object]") {
                        result.push(JSON.stringify(subinsertion));
                    } else if (typeof subinsertion === "string") {
                        result.push(__default7.HTML.escape(String(subinsertion)));
                    } else if (typeof subinsertion === "number") {
                        result.push(subinsertion);
                    }
                }
                return result.join("");
            }
        }));
};
_Response.html = _Response("text/html");
_Response.js = _Response("text/javascript");
_Response.text = _Response("text/plain");
async function Inliner(request, { messagesFolder, frameworkBranch = "main" }) {
    const origin = request.url.origin;
    let messages = {};
    if (messagesFolder) {
        try {
            const filePath = join6(Deno.cwd(), messagesFolder, `${request.language}.json`);
            __default7.Log({
                message: `[framework/backend/inliner] Loading messages for language "${request.language}"`,
                level: "debug",
                detail: {
                    filePath
                }
            });
            const decoder = new TextDecoder("utf-8");
            const file = await Deno.readFile(filePath);
            const fileContents = decoder.decode(file);
            __default7.Log({
                message: `[framework/backend/inliner] Loaded messages for language "${request.language}"`,
                level: "debug",
                detail: {
                    fileContents
                }
            });
            messages = JSON.parse(fileContents);
            __default7.Log({
                message: `[framework/backend/inliner] Parsed messages for language "${request.language}"`,
                level: "debug",
                detail: {
                    messages
                }
            });
        } catch (error) {
            __default7.Log({
                message: `[framework/backend/inliner] Failed to load messages for language "${request.language}"`,
                level: "warn",
                detail: {
                    error: error.message
                }
            });
        }
    }
    return {
        elements (...elementFunctionsOrFilePaths) {
            const result = [];
            __default7.Log({
                message: `[framework/backend/inliner#elements] inlining elements "${elementFunctionsOrFilePaths.join(", ")}"`,
                level: "debug"
            });
            for (const functionOrFilePath of elementFunctionsOrFilePaths){
                let fileContents;
                if (typeof functionOrFilePath === "function") {
                    fileContents = `(${functionOrFilePath.toString()})();`;
                } else {
                    fileContents = Deno.readTextFileSync(`.${functionOrFilePath}`);
                }
                __default7.Log({
                    message: `[framework/backend/inliner#elements] loaded element "${functionOrFilePath}"`,
                    level: "debug"
                });
                const sanitizedScript = __default7.HTML.minify(fileContents).replaceAll(' from "/', ` from "${origin}/`).replaceAll('import "/', `import "${origin}/`);
                result.push(_Response.html`<script
          type="module"
          src="data:application/javascript;base64,${encodeBase64(sanitizedScript)}"></script>`);
                __default7.Log({
                    message: `[framework/backend/inliner#elements] inlined element "${functionOrFilePath}"`,
                    level: "debug"
                });
            }
            __default7.Log({
                message: `[framework/backend/inliner#elements] completed for "${elementFunctionsOrFilePaths.join(", ")}"`,
                level: "debug"
            });
            return _Response.html`${result}`;
        },
        message (key) {
            const message = messages[key];
            if (!message) {
                __default7.Log({
                    message: `[framework/backend/inliner#message] No message found for key "${key}"`,
                    detail: {
                        language: request.language
                    },
                    level: "warn"
                });
                return key;
            }
            return message;
        },
        metadata ({ title, description, previewImagePath, splashImagePath, iconImagePath, canonicalUrl = request.url.toString() }) {
            const tags = [
                _Response.html`<link rel="canonical" href="${canonicalUrl}" />`,
                _Response.html`<meta name="og:url" content="${canonicalUrl}" />`
            ];
            __default7.Log({
                message: `[framework/backend/inliner#metadata] constructing page metadata.`,
                detail: {
                    title,
                    description,
                    previewImagePath,
                    splashImagePath,
                    iconImagePath,
                    canonicalUrl
                },
                level: "debug"
            });
            if (title) {
                __default7.Log({
                    message: `[framework/backend/inliner#metadata] using title "${title}"`,
                    level: "debug"
                });
                tags.push(_Response.html`<title>${title}</title>
            <meta name="og:title" content="${title}" />`);
            }
            if (description) {
                __default7.Log({
                    message: `[framework/backend/inliner#metadata] using description "${description}"`,
                    level: "debug"
                });
                tags.push(_Response.html`<meta name="description" content="${description}" />
            <meta name="og:description" content="${description}" />`);
            }
            if (iconImagePath) {
                __default7.Log({
                    message: `[framework/backend/inliner#metadata] using icon image "${iconImagePath}"`,
                    level: "debug"
                });
                tags.push(_Response.html`<link rel="icon" href="${iconImagePath}" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <link rel="apple-touch-icon" href="${iconImagePath}" />`, _Response.html`<meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />`);
            }
            if (splashImagePath) {
                __default7.Log({
                    message: `[framework/backend/inliner#metadata] using splash image "${splashImagePath}"`,
                    level: "debug"
                });
                tags.push(_Response.html`<link
            rel="apple-touch-startup-image"
            href="${splashImagePath}"
          />`);
            }
            if (previewImagePath) {
                __default7.Log({
                    message: `[framework/backend/inliner#metadata] using preview image "${previewImagePath}"`,
                    level: "debug"
                });
                tags.push(_Response.html`<meta name="og:image" content="${previewImagePath}" />`);
            }
            __default7.Log({
                message: `[framework/backend/inliner#metadata] page metadata constructed.`,
                level: "debug"
            });
            return _Response.html`${tags}`;
        },
        async frameworkBundles (...bundleNames) {
            __default7.Log({
                message: `[framework/backend/inliner#frameworkBundles] inlining sources "${bundleNames.join(", ")}"`,
                level: "debug"
            });
            const result = [];
            for (const bundleName of bundleNames){
                const code = await (await fetch(`https://raw.githubusercontent.com/daniellacosse-code/onlyweb.dev/refs/heads/${frameworkBranch}/bundles/${encodeURIComponent(bundleName)}.js`)).text();
                result.push(_Response.html`<script
            type="module"
            src="data:application/javascript;base64,${encodeBase64(encodeURIComponent(code).replace(/%([0-9A-F]{2})/g, (_, codepoint)=>String.fromCharCode(Number(`0x${codepoint}`))))}"
          ></script>`);
                __default7.Log({
                    message: `[framework/backend/inliner#frameworkBundles] inlined bundle "${code}"`,
                    level: "debug"
                });
            }
            __default7.Log({
                message: `[framework/backend/inliner#frameworkBundles] completed for "${bundleNames.join(", ")}"`,
                level: "debug"
            });
            return _Response.html`${result}`;
        }
    };
}
const __default8 = (route, options)=>{
    const typedGlobalThis = globalThis;
    typedGlobalThis.customPages ??= new Map();
    if (route.startsWith("/framework")) {
        __default7.Log({
            message: `[framework/backend/register] Page "${route}" cannot be registered: it is a framework route.`,
            level: "error"
        });
        return;
    }
    if (typedGlobalThis.customPages.has(route)) __default7.Log({
        message: `[framework/backend/register] Page "${route}" already registered.`,
        level: "warn"
    });
    if (typeof options === "function") {
        options = {
            handleRequest: options
        };
    }
    const { requirements = {}, handleRequest, handleServiceWorker = ()=>{} } = options;
    typedGlobalThis.customPages.set(route, async (request)=>{
        Object.defineProperty(request, "url", {
            writable: true,
            value: new URL(request.url)
        });
        request.language = request.url.searchParams.get("lang") ?? request.headers.get("accept-language")?.split(",")[0] ?? "en-US";
        __default7.Log({
            message: `[framework/backend/register] Begun handling request @ "${route}".`,
            detail: request
        });
        if (request.url.searchParams.has("sw")) {
            try {
                __default7.Log({
                    message: `[framework/backend/register] Constructing service worker response @ "${route}".`
                });
                const serviceWorker = await handleServiceWorker(request);
                if (!serviceWorker) {
                    __default7.Log({
                        message: `[framework/backend/register] No service worker found @ "${route}".`,
                        level: "warn"
                    });
                    return new Response("Not Found", {
                        status: 404
                    });
                }
                __default7.Log({
                    message: `[framework/backend/register] Serving service worker @ "${route}".`,
                    detail: serviceWorker
                });
                return serviceWorker;
            } catch (error) {
                __default7.LogError(error);
                return new Response("Internal Server Error", {
                    status: 500
                });
            }
        }
        __default7.Log({
            message: `[framework/backend/register] Detected page request @ "${route}".`,
            detail: request
        });
        const response = await handleRequest(request);
        if (response.mimetype !== "text/html") {
            __default7.Log({
                message: `Serving non-HTML response @ "${route}".`,
                detail: response
            });
            return response;
        }
        try {
            __default7.Log({
                message: `[framework/backend/register] Constructing HTML page @ "${route}".`,
                detail: response
            });
            const inliner = await Inliner(request, {
                messagesFolder: "",
                frameworkBranch: options.frameworkBranch
            });
            const pageResponse = _Response.html`
          <!DOCTYPE html>
          <html lang="${request.language}">
            ${await inliner.frameworkBundles("$Shared", "$Frontend")}
            ${response}
            <script type="module">
              (function () {
                // check browser requirements
                if (
                  !(
                    navigator.userAgent &&
                    $Shared.UserAgent.check(
                      $Shared.UserAgent.parse(navigator.userAgent),
                      $Shared.UserAgent.merge(
                        ${requirements},
                        $Frontend.requirements.userAgent
                      )                        
                    )
                  )
                ) {
                  alert(
                    "Your browser is not currently supported: certain things may not work as expected. Please consider updating your browser to the latest version."
                  );
                }

                // launch devtools
                if (globalThis.location.href.match(/localhost/)) {
                  try {
                    const reloadSocket = new WebSocket(
                      "ws://localhost:${35729}"
                    );

                    reloadSocket.onopen = () =>
                      console.log("LiveReload connected~");
                    reloadSocket.onmessage = ({ data }) =>
                      data === "reload" && location.reload();
                  } catch (error) {
                    // nevermind
                    console.log("LiveReload failed to connect.");
                  }
                }

                // register service worker
                if ("serviceWorker" in navigator) {
                  try {
                    navigator.serviceWorker.register("${route}?sw", {
                      scope: "${route}"
                    });
                  } catch (error) {
                    // nevermind
                    console.log("Service worker failed to register.");
                  }
                }
              })();
            </script>
          </html>
        `;
            __default7.Log({
                message: `[framework/backend/register] Serving HTML page @ "${route}".`,
                detail: pageResponse
            });
            return pageResponse;
        } catch (error) {
            __default7.LogError(error);
            return new Response("Internal Server Error", {
                status: 500
            });
        }
    });
    __default7.Log({
        message: `[framework/backend/register] Registered page @ "${route}".`
    });
};
const __default9 = {
    ...mod2,
    start: __default,
    Page: {
        Inliner,
        Register: __default8,
        Response: _Response
    }
};
globalThis.$Backend = __default9;
