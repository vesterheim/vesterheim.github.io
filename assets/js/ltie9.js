(function(window, document) {
    var version = "3.7.2";
    var options = window.html5 || {};
    var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
    var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
    var supportsHtml5Styles;
    var expando = "_html5shiv";
    var expanID = 0;
    var expandoData = {};
    var supportsUnknownElements;
    (function() {
        try {
            var a = document.createElement("a");
            a.innerHTML = "<xyz></xyz>";
            supportsHtml5Styles = "hidden" in a;
            supportsUnknownElements = a.childNodes.length == 1 || function() {
                document.createElement("a");
                var frag = document.createDocumentFragment();
                return typeof frag.cloneNode == "undefined" || typeof frag.createDocumentFragment == "undefined" || typeof frag.createElement == "undefined";
            }();
        } catch (e) {
            supportsHtml5Styles = true;
            supportsUnknownElements = true;
        }
    })();
    function addStyleSheet(ownerDocument, cssText) {
        var p = ownerDocument.createElement("p"), parent = ownerDocument.getElementsByTagName("head")[0] || ownerDocument.documentElement;
        p.innerHTML = "x<style>" + cssText + "</style>";
        return parent.insertBefore(p.lastChild, parent.firstChild);
    }
    function getElements() {
        var elements = html5.elements;
        return typeof elements == "string" ? elements.split(" ") : elements;
    }
    function addElements(newElements, ownerDocument) {
        var elements = html5.elements;
        if (typeof elements != "string") {
            elements = elements.join(" ");
        }
        if (typeof newElements != "string") {
            newElements = newElements.join(" ");
        }
        html5.elements = elements + " " + newElements;
        shivDocument(ownerDocument);
    }
    function getExpandoData(ownerDocument) {
        var data = expandoData[ownerDocument[expando]];
        if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
        }
        return data;
    }
    function createElement(nodeName, ownerDocument, data) {
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if (supportsUnknownElements) {
            return ownerDocument.createElement(nodeName);
        }
        if (!data) {
            data = getExpandoData(ownerDocument);
        }
        var node;
        if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
        } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
        } else {
            node = data.createElem(nodeName);
        }
        return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
    }
    function createDocumentFragment(ownerDocument, data) {
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if (supportsUnknownElements) {
            return ownerDocument.createDocumentFragment();
        }
        data = data || getExpandoData(ownerDocument);
        var clone = data.frag.cloneNode(), i = 0, elems = getElements(), l = elems.length;
        for (;i < l; i++) {
            clone.createElement(elems[i]);
        }
        return clone;
    }
    function shivMethods(ownerDocument, data) {
        if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
        }
        ownerDocument.createElement = function(nodeName) {
            if (!html5.shivMethods) {
                return data.createElem(nodeName);
            }
            return createElement(nodeName, ownerDocument, data);
        };
        ownerDocument.createDocumentFragment = Function("h,f", "return function(){" + "var n=f.cloneNode(),c=n.createElement;" + "h.shivMethods&&(" + getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
            data.createElem(nodeName);
            data.frag.createElement(nodeName);
            return 'c("' + nodeName + '")';
        }) + ");return n}")(html5, data.frag);
    }
    function shivDocument(ownerDocument) {
        if (!ownerDocument) {
            ownerDocument = document;
        }
        var data = getExpandoData(ownerDocument);
        if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
            data.hasCSS = !!addStyleSheet(ownerDocument, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}" + "mark{background:#FF0;color:#000}" + "template{display:none}");
        }
        if (!supportsUnknownElements) {
            shivMethods(ownerDocument, data);
        }
        return ownerDocument;
    }
    var html5 = {
        elements: options.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",
        version: version,
        shivCSS: options.shivCSS !== false,
        supportsUnknownElements: supportsUnknownElements,
        shivMethods: options.shivMethods !== false,
        type: "default",
        shivDocument: shivDocument,
        createElement: createElement,
        createDocumentFragment: createDocumentFragment,
        addElements: addElements
    };
    window.html5 = html5;
    shivDocument(document);
})(this, document);

(function(win) {
    var ieUserAgent = navigator.userAgent.match(/MSIE (\d+)/);
    if (!ieUserAgent) {
        return false;
    }
    var doc = document;
    var root = doc.documentElement;
    var xhr = getXHRObject();
    var ieVersion = ieUserAgent[1];
    if (doc.compatMode != "CSS1Compat" || ieVersion < 6 || ieVersion > 8 || !xhr) {
        return;
    }
    var selectorEngines = {
        NW: "*.Dom.select",
        MooTools: "$$",
        DOMAssistant: "*.$",
        Prototype: "$$",
        YAHOO: "*.util.Selector.query",
        Sizzle: "*",
        jQuery: "*",
        dojo: "*.query"
    };
    var selectorMethod;
    var enabledWatchers = [];
    var domPatches = [];
    var ie6PatchID = 0;
    var patchIE6MultipleClasses = true;
    var namespace = "slvzr";
    var RE_COMMENT = /(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)\s*?/g;
    var RE_IMPORT = /@import\s*(?:(?:(?:url\(\s*(['"]?)(.*)\1)\s*\))|(?:(['"])(.*)\3))\s*([^;]*);/g;
    var RE_ASSET_URL = /(behavior\s*?:\s*)?\burl\(\s*(["']?)(?!data:)([^"')]+)\2\s*\)/g;
    var RE_PSEUDO_STRUCTURAL = /^:(empty|(first|last|only|nth(-last)?)-(child|of-type))$/;
    var RE_PSEUDO_ELEMENTS = /:(:first-(?:line|letter))/g;
    var RE_SELECTOR_GROUP = /((?:^|(?:\s*})+)(?:\s*@media[^{]+{)?)\s*([^\{]*?[\[:][^{]+)/g;
    var RE_SELECTOR_PARSE = /([ +~>])|(:[a-z-]+(?:\(.*?\)+)?)|(\[.*?\])/g;
    var RE_LIBRARY_INCOMPATIBLE_PSEUDOS = /(:not\()?:(hover|enabled|disabled|focus|checked|target|active|visited|first-line|first-letter)\)?/g;
    var RE_PATCH_CLASS_NAME_REPLACE = /[^\w-]/g;
    var RE_INPUT_ELEMENTS = /^(INPUT|SELECT|TEXTAREA|BUTTON)$/;
    var RE_INPUT_CHECKABLE_TYPES = /^(checkbox|radio)$/;
    var BROKEN_ATTR_IMPLEMENTATIONS = ieVersion > 6 ? /[\$\^*]=(['"])\1/ : null;
    var RE_TIDY_TRAILING_WHITESPACE = /([(\[+~])\s+/g;
    var RE_TIDY_LEADING_WHITESPACE = /\s+([)\]+~])/g;
    var RE_TIDY_CONSECUTIVE_WHITESPACE = /\s+/g;
    var RE_TIDY_TRIM_WHITESPACE = /^\s*((?:[\S\s]*\S)?)\s*$/;
    var EMPTY_STRING = "";
    var SPACE_STRING = " ";
    var PLACEHOLDER_STRING = "$1";
    function patchStyleSheet(cssText) {
        return cssText.replace(RE_PSEUDO_ELEMENTS, PLACEHOLDER_STRING).replace(RE_SELECTOR_GROUP, function(m, prefix, selectorText) {
            var selectorGroups = selectorText.split(",");
            for (var c = 0, cs = selectorGroups.length; c < cs; c++) {
                var selector = normalizeSelectorWhitespace(selectorGroups[c]) + SPACE_STRING;
                var patches = [];
                selectorGroups[c] = selector.replace(RE_SELECTOR_PARSE, function(match, combinator, pseudo, attribute, index) {
                    if (combinator) {
                        if (patches.length > 0) {
                            domPatches.push({
                                selector: selector.substring(0, index),
                                patches: patches
                            });
                            patches = [];
                        }
                        return combinator;
                    } else {
                        var patch = pseudo ? patchPseudoClass(pseudo) : patchAttribute(attribute);
                        if (patch) {
                            patches.push(patch);
                            return "." + patch.className;
                        }
                        return match;
                    }
                });
            }
            return prefix + selectorGroups.join(",");
        });
    }
    function patchAttribute(attr) {
        return !BROKEN_ATTR_IMPLEMENTATIONS || BROKEN_ATTR_IMPLEMENTATIONS.test(attr) ? {
            className: createClassName(attr),
            applyClass: true
        } : null;
    }
    function patchPseudoClass(pseudo) {
        var applyClass = true;
        var className = createClassName(pseudo.slice(1));
        var isNegated = pseudo.substring(0, 5) == ":not(";
        var activateEventName;
        var deactivateEventName;
        if (isNegated) {
            pseudo = pseudo.slice(5, -1);
        }
        var bracketIndex = pseudo.indexOf("(");
        if (bracketIndex > -1) {
            pseudo = pseudo.substring(0, bracketIndex);
        }
        if (pseudo.charAt(0) == ":") {
            switch (pseudo.slice(1)) {
              case "root":
                applyClass = function(e) {
                    return isNegated ? e != root : e == root;
                };
                break;

              case "target":
                if (ieVersion == 8) {
                    applyClass = function(e) {
                        var handler = function() {
                            var hash = location.hash;
                            var hashID = hash.slice(1);
                            return isNegated ? hash == EMPTY_STRING || e.id != hashID : hash != EMPTY_STRING && e.id == hashID;
                        };
                        addEvent(win, "hashchange", function() {
                            toggleElementClass(e, className, handler());
                        });
                        return handler();
                    };
                    break;
                }
                return false;

              case "checked":
                applyClass = function(e) {
                    if (RE_INPUT_CHECKABLE_TYPES.test(e.type)) {
                        addEvent(e, "propertychange", function() {
                            if (event.propertyName == "checked") {
                                toggleElementClass(e, className, e.checked !== isNegated);
                            }
                        });
                    }
                    return e.checked !== isNegated;
                };
                break;

              case "disabled":
                isNegated = !isNegated;

              case "enabled":
                applyClass = function(e) {
                    if (RE_INPUT_ELEMENTS.test(e.tagName)) {
                        addEvent(e, "propertychange", function() {
                            if (event.propertyName == "$disabled") {
                                toggleElementClass(e, className, e.$disabled === isNegated);
                            }
                        });
                        enabledWatchers.push(e);
                        e.$disabled = e.disabled;
                        return e.disabled === isNegated;
                    }
                    return pseudo == ":enabled" ? isNegated : !isNegated;
                };
                break;

              case "focus":
                activateEventName = "focus";
                deactivateEventName = "blur";

              case "hover":
                if (!activateEventName) {
                    activateEventName = "mouseenter";
                    deactivateEventName = "mouseleave";
                }
                applyClass = function(e) {
                    addEvent(e, isNegated ? deactivateEventName : activateEventName, function() {
                        toggleElementClass(e, className, true);
                    });
                    addEvent(e, isNegated ? activateEventName : deactivateEventName, function() {
                        toggleElementClass(e, className, false);
                    });
                    return isNegated;
                };
                break;

              default:
                if (!RE_PSEUDO_STRUCTURAL.test(pseudo)) {
                    return false;
                }
                break;
            }
        }
        return {
            className: className,
            applyClass: applyClass
        };
    }
    function applyPatches() {
        var elms, selectorText, patches, domSelectorText;
        for (var c = 0; c < domPatches.length; c++) {
            selectorText = domPatches[c].selector;
            patches = domPatches[c].patches;
            domSelectorText = selectorText.replace(RE_LIBRARY_INCOMPATIBLE_PSEUDOS, EMPTY_STRING);
            if (domSelectorText == EMPTY_STRING || domSelectorText.charAt(domSelectorText.length - 1) == SPACE_STRING) {
                domSelectorText += "*";
            }
            try {
                elms = selectorMethod(domSelectorText);
            } catch (ex) {
                log("Selector '" + selectorText + "' threw exception '" + ex + "'");
            }
            if (elms) {
                for (var d = 0, dl = elms.length; d < dl; d++) {
                    var elm = elms[d];
                    var cssClasses = elm.className;
                    for (var f = 0, fl = patches.length; f < fl; f++) {
                        var patch = patches[f];
                        if (!hasPatch(elm, patch)) {
                            if (patch.applyClass && (patch.applyClass === true || patch.applyClass(elm) === true)) {
                                cssClasses = toggleClass(cssClasses, patch.className, true);
                            }
                        }
                    }
                    elm.className = cssClasses;
                }
            }
        }
    }
    function hasPatch(elm, patch) {
        return new RegExp("(^|\\s)" + patch.className + "(\\s|$)").test(elm.className);
    }
    function createClassName(className) {
        return namespace + "-" + (ieVersion == 6 && patchIE6MultipleClasses ? ie6PatchID++ : className.replace(RE_PATCH_CLASS_NAME_REPLACE, function(a) {
            return a.charCodeAt(0);
        }));
    }
    function log(message) {
        if (win.console) {
            win.console.log(message);
        }
    }
    function trim(text) {
        return text.replace(RE_TIDY_TRIM_WHITESPACE, PLACEHOLDER_STRING);
    }
    function normalizeWhitespace(text) {
        return trim(text).replace(RE_TIDY_CONSECUTIVE_WHITESPACE, SPACE_STRING);
    }
    function normalizeSelectorWhitespace(selectorText) {
        return normalizeWhitespace(selectorText.replace(RE_TIDY_TRAILING_WHITESPACE, PLACEHOLDER_STRING).replace(RE_TIDY_LEADING_WHITESPACE, PLACEHOLDER_STRING));
    }
    function toggleElementClass(elm, className, on) {
        var oldClassName = elm.className;
        var newClassName = toggleClass(oldClassName, className, on);
        if (newClassName != oldClassName) {
            elm.className = newClassName;
            elm.parentNode.className += EMPTY_STRING;
        }
    }
    function toggleClass(classList, className, on) {
        var re = RegExp("(^|\\s)" + className + "(\\s|$)");
        var classExists = re.test(classList);
        if (on) {
            return classExists ? classList : classList + SPACE_STRING + className;
        } else {
            return classExists ? trim(classList.replace(re, PLACEHOLDER_STRING)) : classList;
        }
    }
    function addEvent(elm, eventName, eventHandler) {
        elm.attachEvent("on" + eventName, eventHandler);
    }
    function getXHRObject() {
        if (win.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
            return null;
        }
    }
    function loadStyleSheet(url) {
        xhr.open("GET", url, false);
        xhr.send();
        return xhr.status == 200 ? xhr.responseText : EMPTY_STRING;
    }
    function resolveUrl(url, contextUrl, ignoreSameOriginPolicy) {
        function getProtocol(url) {
            return url.substring(0, url.indexOf("//"));
        }
        function getProtocolAndHost(url) {
            return url.substring(0, url.indexOf("/", 8));
        }
        if (!contextUrl) {
            contextUrl = baseUrl;
        }
        if (url.substring(0, 2) == "//") {
            url = getProtocol(contextUrl) + url;
        }
        if (/^https?:\/\//i.test(url)) {
            return !ignoreSameOriginPolicy && getProtocolAndHost(contextUrl) != getProtocolAndHost(url) ? null : url;
        }
        if (url.charAt(0) == "/") {
            return getProtocolAndHost(contextUrl) + url;
        }
        var contextUrlPath = contextUrl.split(/[?#]/)[0];
        if (url.charAt(0) != "?" && contextUrlPath.charAt(contextUrlPath.length - 1) != "/") {
            contextUrlPath = contextUrlPath.substring(0, contextUrlPath.lastIndexOf("/") + 1);
        }
        return contextUrlPath + url;
    }
    function parseStyleSheet(url) {
        if (url) {
            return loadStyleSheet(url).replace(RE_COMMENT, EMPTY_STRING).replace(RE_IMPORT, function(match, quoteChar, importUrl, quoteChar2, importUrl2, media) {
                var cssText = parseStyleSheet(resolveUrl(importUrl || importUrl2, url));
                return media ? "@media " + media + " {" + cssText + "}" : cssText;
            }).replace(RE_ASSET_URL, function(match, isBehavior, quoteChar, assetUrl) {
                quoteChar = quoteChar || EMPTY_STRING;
                return isBehavior ? match : " url(" + quoteChar + resolveUrl(assetUrl, url, true) + quoteChar + ") ";
            });
        }
        return EMPTY_STRING;
    }
    function getStyleSheets() {
        var url, stylesheet;
        for (var c = 0; c < doc.styleSheets.length; c++) {
            stylesheet = doc.styleSheets[c];
            if (stylesheet.href != EMPTY_STRING) {
                url = resolveUrl(stylesheet.href);
                if (url) {
                    stylesheet.cssText = stylesheet["rawCssText"] = patchStyleSheet(parseStyleSheet(url));
                }
            }
        }
    }
    function init() {
        applyPatches();
        if (enabledWatchers.length > 0) {
            setInterval(function() {
                for (var c = 0, cl = enabledWatchers.length; c < cl; c++) {
                    var e = enabledWatchers[c];
                    if (e.disabled !== e.$disabled) {
                        if (e.disabled) {
                            e.disabled = false;
                            e.$disabled = true;
                            e.disabled = true;
                        } else {
                            e.$disabled = e.disabled;
                        }
                    }
                }
            }, 250);
        }
    }
    var baseTags = doc.getElementsByTagName("BASE");
    var baseUrl = baseTags.length > 0 ? baseTags[0].href : doc.location.href;
    getStyleSheets();
    ContentLoaded(win, function() {
        for (var engine in selectorEngines) {
            var members, member, context = win;
            if (win[engine]) {
                members = selectorEngines[engine].replace("*", engine).split(".");
                while ((member = members.shift()) && (context = context[member])) {}
                if (typeof context == "function") {
                    selectorMethod = context;
                    init();
                    return;
                }
            }
        }
    });
    function ContentLoaded(win, fn) {
        var done = false, top = true, init = function(e) {
            if (e.type == "readystatechange" && doc.readyState != "complete") return;
            (e.type == "load" ? win : doc).detachEvent("on" + e.type, init, false);
            if (!done && (done = true)) fn.call(win, e.type || e);
        }, poll = function() {
            try {
                root.doScroll("left");
            } catch (e) {
                setTimeout(poll, 50);
                return;
            }
            init("poll");
        };
        if (doc.readyState == "complete") fn.call(win, EMPTY_STRING); else {
            if (doc.createEventObject && root.doScroll) {
                try {
                    top = !win.frameElement;
                } catch (e) {}
                if (top) poll();
            }
            addEvent(doc, "readystatechange", init);
            addEvent(win, "load", init);
        }
    }
})(this);

(function(w) {
    "use strict";
    w.matchMedia = w.matchMedia || function(doc, undefined) {
        var bool, docElem = doc.documentElement, refNode = docElem.firstElementChild || docElem.firstChild, fakeBody = doc.createElement("body"), div = doc.createElement("div");
        div.id = "mq-test-1";
        div.style.cssText = "position:absolute;top:-100em";
        fakeBody.style.background = "none";
        fakeBody.appendChild(div);
        return function(q) {
            div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width: 42px; }</style>';
            docElem.insertBefore(fakeBody, refNode);
            bool = div.offsetWidth === 42;
            docElem.removeChild(fakeBody);
            return {
                matches: bool,
                media: q
            };
        };
    }(w.document);
})(this);

(function(w) {
    "use strict";
    var respond = {};
    w.respond = respond;
    respond.update = function() {};
    var requestQueue = [], xmlHttp = function() {
        var xmlhttpmethod = false;
        try {
            xmlhttpmethod = new w.XMLHttpRequest();
        } catch (e) {
            xmlhttpmethod = new w.ActiveXObject("Microsoft.XMLHTTP");
        }
        return function() {
            return xmlhttpmethod;
        };
    }(), ajax = function(url, callback) {
        var req = xmlHttp();
        if (!req) {
            return;
        }
        req.open("GET", url, true);
        req.onreadystatechange = function() {
            if (req.readyState !== 4 || req.status !== 200 && req.status !== 304) {
                return;
            }
            callback(req.responseText);
        };
        if (req.readyState === 4) {
            return;
        }
        req.send(null);
    }, isUnsupportedMediaQuery = function(query) {
        return query.replace(respond.regex.minmaxwh, "").match(respond.regex.other);
    };
    respond.ajax = ajax;
    respond.queue = requestQueue;
    respond.unsupportedmq = isUnsupportedMediaQuery;
    respond.regex = {
        media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
        keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
        comments: /\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,
        urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
        findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
        only: /(only\s+)?([a-zA-Z]+)\s?/,
        minw: /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
        maxw: /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
        minmaxwh: /\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,
        other: /\([^\)]*\)/g
    };
    respond.mediaQueriesSupported = w.matchMedia && w.matchMedia("only all") !== null && w.matchMedia("only all").matches;
    if (respond.mediaQueriesSupported) {
        return;
    }
    var doc = w.document, docElem = doc.documentElement, mediastyles = [], rules = [], appendedEls = [], parsedSheets = {}, resizeThrottle = 30, head = doc.getElementsByTagName("head")[0] || docElem, base = doc.getElementsByTagName("base")[0], links = head.getElementsByTagName("link"), lastCall, resizeDefer, eminpx, getEmValue = function() {
        var ret, div = doc.createElement("div"), body = doc.body, originalHTMLFontSize = docElem.style.fontSize, originalBodyFontSize = body && body.style.fontSize, fakeUsed = false;
        div.style.cssText = "position:absolute;font-size:1em;width:1em";
        if (!body) {
            body = fakeUsed = doc.createElement("body");
            body.style.background = "none";
        }
        docElem.style.fontSize = "100%";
        body.style.fontSize = "100%";
        body.appendChild(div);
        if (fakeUsed) {
            docElem.insertBefore(body, docElem.firstChild);
        }
        ret = div.offsetWidth;
        if (fakeUsed) {
            docElem.removeChild(body);
        } else {
            body.removeChild(div);
        }
        docElem.style.fontSize = originalHTMLFontSize;
        if (originalBodyFontSize) {
            body.style.fontSize = originalBodyFontSize;
        }
        ret = eminpx = parseFloat(ret);
        return ret;
    }, applyMedia = function(fromResize) {
        var name = "clientWidth", docElemProp = docElem[name], currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[name] || docElemProp, styleBlocks = {}, lastLink = links[links.length - 1], now = new Date().getTime();
        if (fromResize && lastCall && now - lastCall < resizeThrottle) {
            w.clearTimeout(resizeDefer);
            resizeDefer = w.setTimeout(applyMedia, resizeThrottle);
            return;
        } else {
            lastCall = now;
        }
        for (var i in mediastyles) {
            if (mediastyles.hasOwnProperty(i)) {
                var thisstyle = mediastyles[i], min = thisstyle.minw, max = thisstyle.maxw, minnull = min === null, maxnull = max === null, em = "em";
                if (!!min) {
                    min = parseFloat(min) * (min.indexOf(em) > -1 ? eminpx || getEmValue() : 1);
                }
                if (!!max) {
                    max = parseFloat(max) * (max.indexOf(em) > -1 ? eminpx || getEmValue() : 1);
                }
                if (!thisstyle.hasquery || (!minnull || !maxnull) && (minnull || currWidth >= min) && (maxnull || currWidth <= max)) {
                    if (!styleBlocks[thisstyle.media]) {
                        styleBlocks[thisstyle.media] = [];
                    }
                    styleBlocks[thisstyle.media].push(rules[thisstyle.rules]);
                }
            }
        }
        for (var j in appendedEls) {
            if (appendedEls.hasOwnProperty(j)) {
                if (appendedEls[j] && appendedEls[j].parentNode === head) {
                    head.removeChild(appendedEls[j]);
                }
            }
        }
        appendedEls.length = 0;
        for (var k in styleBlocks) {
            if (styleBlocks.hasOwnProperty(k)) {
                var ss = doc.createElement("style"), css = styleBlocks[k].join("\n");
                ss.type = "text/css";
                ss.media = k;
                head.insertBefore(ss, lastLink.nextSibling);
                if (ss.styleSheet) {
                    ss.styleSheet.cssText = css;
                } else {
                    ss.appendChild(doc.createTextNode(css));
                }
                appendedEls.push(ss);
            }
        }
    }, translate = function(styles, href, media) {
        var qs = styles.replace(respond.regex.comments, "").replace(respond.regex.keyframes, "").match(respond.regex.media), ql = qs && qs.length || 0;
        href = href.substring(0, href.lastIndexOf("/"));
        var repUrls = function(css) {
            return css.replace(respond.regex.urls, "$1" + href + "$2$3");
        }, useMedia = !ql && media;
        if (href.length) {
            href += "/";
        }
        if (useMedia) {
            ql = 1;
        }
        for (var i = 0; i < ql; i++) {
            var fullq, thisq, eachq, eql;
            if (useMedia) {
                fullq = media;
                rules.push(repUrls(styles));
            } else {
                fullq = qs[i].match(respond.regex.findStyles) && RegExp.$1;
                rules.push(RegExp.$2 && repUrls(RegExp.$2));
            }
            eachq = fullq.split(",");
            eql = eachq.length;
            for (var j = 0; j < eql; j++) {
                thisq = eachq[j];
                if (isUnsupportedMediaQuery(thisq)) {
                    continue;
                }
                mediastyles.push({
                    media: thisq.split("(")[0].match(respond.regex.only) && RegExp.$2 || "all",
                    rules: rules.length - 1,
                    hasquery: thisq.indexOf("(") > -1,
                    minw: thisq.match(respond.regex.minw) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
                    maxw: thisq.match(respond.regex.maxw) && parseFloat(RegExp.$1) + (RegExp.$2 || "")
                });
            }
        }
        applyMedia();
    }, makeRequests = function() {
        if (requestQueue.length) {
            var thisRequest = requestQueue.shift();
            ajax(thisRequest.href, function(styles) {
                translate(styles, thisRequest.href, thisRequest.media);
                parsedSheets[thisRequest.href] = true;
                w.setTimeout(function() {
                    makeRequests();
                }, 0);
            });
        }
    }, ripCSS = function() {
        for (var i = 0; i < links.length; i++) {
            var sheet = links[i], href = sheet.href, media = sheet.media, isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";
            if (!!href && isCSS && !parsedSheets[href]) {
                if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
                    translate(sheet.styleSheet.rawCssText, href, media);
                    parsedSheets[href] = true;
                } else {
                    if (!/^([a-zA-Z:]*\/\/)/.test(href) && !base || href.replace(RegExp.$1, "").split("/")[0] === w.location.host) {
                        if (href.substring(0, 2) === "//") {
                            href = w.location.protocol + href;
                        }
                        requestQueue.push({
                            href: href,
                            media: media
                        });
                    }
                }
            }
        }
        makeRequests();
    };
    ripCSS();
    respond.update = ripCSS;
    respond.getEmValue = getEmValue;
    function callMedia() {
        applyMedia(true);
    }
    if (w.addEventListener) {
        w.addEventListener("resize", callMedia, false);
    } else if (w.attachEvent) {
        w.attachEvent("onresize", callMedia);
    }
})(this);