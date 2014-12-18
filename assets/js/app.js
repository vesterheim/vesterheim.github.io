window.matchMedia || (window.matchMedia = function() {
    "use strict";
    var styleMedia = window.styleMedia || window.media;
    if (!styleMedia) {
        var style = document.createElement("style"), script = document.getElementsByTagName("script")[0], info = null;
        style.type = "text/css";
        style.id = "matchmediajs-test";
        script.parentNode.insertBefore(style, script);
        info = "getComputedStyle" in window && window.getComputedStyle(style, null) || style.currentStyle;
        styleMedia = {
            matchMedium: function(media) {
                var text = "@media " + media + "{ #matchmediajs-test { width: 1px; } }";
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }
                return info.width === "1px";
            }
        };
    }
    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || "all"),
            media: media || "all"
        };
    };
}());

(function(w, doc) {
    "use strict";
    if (w.HTMLPictureElement) {
        w.picturefill = function() {};
        return;
    }
    doc.createElement("picture");
    var pf = {};
    pf.ns = "picturefill";
    pf.srcsetSupported = "srcset" in doc.createElement("img");
    pf.sizesSupported = w.HTMLImageElement.sizes;
    pf.trim = function(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    };
    pf.endsWith = function(str, suffix) {
        return str.endsWith ? str.endsWith(suffix) : str.indexOf(suffix, str.length - suffix.length) !== -1;
    };
    pf.restrictsMixedContent = function() {
        return w.location.protocol === "https:";
    };
    pf.matchesMedia = function(media) {
        return w.matchMedia && w.matchMedia(media).matches;
    };
    pf.getDpr = function() {
        return w.devicePixelRatio || 1;
    };
    pf.getWidthFromLength = function(length) {
        length = length && length.indexOf("%") > -1 === false && (parseFloat(length) > 0 || length.indexOf("calc(") > -1) ? length : "100vw";
        length = length.replace("vw", "%");
        if (!pf.lengthEl) {
            pf.lengthEl = doc.createElement("div");
            doc.documentElement.insertBefore(pf.lengthEl, doc.documentElement.firstChild);
        }
        pf.lengthEl.style.cssText = "position: absolute; left: 0; width: " + length + ";";
        if (pf.lengthEl.offsetWidth <= 0) {
            pf.lengthEl.style.cssText = "width: 100%;";
        }
        return pf.lengthEl.offsetWidth;
    };
    pf.types = {};
    pf.types["image/jpeg"] = true;
    pf.types["image/gif"] = true;
    pf.types["image/png"] = true;
    pf.types["image/svg+xml"] = doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
    pf.types["image/webp"] = function() {
        var img = new w.Image(), type = "image/webp";
        img.onerror = function() {
            pf.types[type] = false;
            picturefill();
        };
        img.onload = function() {
            pf.types[type] = img.width === 1;
            picturefill();
        };
        img.src = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
    };
    pf.verifyTypeSupport = function(source) {
        var type = source.getAttribute("type");
        if (type === null || type === "") {
            return true;
        } else {
            if (typeof pf.types[type] === "function") {
                pf.types[type]();
                return "pending";
            } else {
                return pf.types[type];
            }
        }
    };
    pf.parseSize = function(sourceSizeStr) {
        var match = /(\([^)]+\))?\s*(.+)/g.exec(sourceSizeStr);
        return {
            media: match && match[1],
            length: match && match[2]
        };
    };
    pf.findWidthFromSourceSize = function(sourceSizeListStr) {
        var sourceSizeList = pf.trim(sourceSizeListStr).split(/\s*,\s*/), winningLength;
        for (var i = 0, len = sourceSizeList.length; i < len; i++) {
            var sourceSize = sourceSizeList[i], parsedSize = pf.parseSize(sourceSize), length = parsedSize.length, media = parsedSize.media;
            if (!length) {
                continue;
            }
            if (!media || pf.matchesMedia(media)) {
                winningLength = length;
                break;
            }
        }
        return pf.getWidthFromLength(winningLength);
    };
    pf.parseSrcset = function(srcset) {
        var candidates = [];
        while (srcset !== "") {
            srcset = srcset.replace(/^\s+/g, "");
            var pos = srcset.search(/\s/g), url, descriptor = null;
            if (pos !== -1) {
                url = srcset.slice(0, pos);
                var last = url[url.length - 1];
                if (last === "," || url === "") {
                    url = url.replace(/,+$/, "");
                    descriptor = "";
                }
                srcset = srcset.slice(pos + 1);
                if (descriptor === null) {
                    var descpos = srcset.indexOf(",");
                    if (descpos !== -1) {
                        descriptor = srcset.slice(0, descpos);
                        srcset = srcset.slice(descpos + 1);
                    } else {
                        descriptor = srcset;
                        srcset = "";
                    }
                }
            } else {
                url = srcset;
                srcset = "";
            }
            if (url || descriptor) {
                candidates.push({
                    url: url,
                    descriptor: descriptor
                });
            }
        }
        return candidates;
    };
    pf.parseDescriptor = function(descriptor, sizesattr) {
        var sizes = sizesattr || "100vw", sizeDescriptor = descriptor && descriptor.replace(/(^\s+|\s+$)/g, ""), widthInCssPixels = pf.findWidthFromSourceSize(sizes), resCandidate;
        if (sizeDescriptor) {
            var splitDescriptor = sizeDescriptor.split(" ");
            for (var i = splitDescriptor.length + 1; i >= 0; i--) {
                if (splitDescriptor[i] !== undefined) {
                    var curr = splitDescriptor[i], lastchar = curr && curr.slice(curr.length - 1);
                    if ((lastchar === "h" || lastchar === "w") && !pf.sizesSupported) {
                        resCandidate = parseFloat(parseInt(curr, 10) / widthInCssPixels);
                    } else if (lastchar === "x") {
                        var res = curr && parseFloat(curr, 10);
                        resCandidate = res && !isNaN(res) ? res : 1;
                    }
                }
            }
        }
        return resCandidate || 1;
    };
    pf.getCandidatesFromSourceSet = function(srcset, sizes) {
        var candidates = pf.parseSrcset(srcset), formattedCandidates = [];
        for (var i = 0, len = candidates.length; i < len; i++) {
            var candidate = candidates[i];
            formattedCandidates.push({
                url: candidate.url,
                resolution: pf.parseDescriptor(candidate.descriptor, sizes)
            });
        }
        return formattedCandidates;
    };
    pf.dodgeSrcset = function(img) {
        if (img.srcset) {
            img[pf.ns].srcset = img.srcset;
            img.removeAttribute("srcset");
        }
    };
    pf.processSourceSet = function(el) {
        var srcset = el.getAttribute("srcset"), sizes = el.getAttribute("sizes"), candidates = [];
        if (el.nodeName.toUpperCase() === "IMG" && el[pf.ns] && el[pf.ns].srcset) {
            srcset = el[pf.ns].srcset;
        }
        if (srcset) {
            candidates = pf.getCandidatesFromSourceSet(srcset, sizes);
        }
        return candidates;
    };
    pf.applyBestCandidate = function(candidates, picImg) {
        var candidate, length, bestCandidate;
        candidates.sort(pf.ascendingSort);
        length = candidates.length;
        bestCandidate = candidates[length - 1];
        for (var i = 0; i < length; i++) {
            candidate = candidates[i];
            if (candidate.resolution >= pf.getDpr()) {
                bestCandidate = candidate;
                break;
            }
        }
        if (bestCandidate && !pf.endsWith(picImg.src, bestCandidate.url)) {
            if (pf.restrictsMixedContent() && bestCandidate.url.substr(0, "http:".length).toLowerCase() === "http:") {
                if (typeof console !== undefined) {
                    console.warn("Blocked mixed content image " + bestCandidate.url);
                }
            } else {
                picImg.src = bestCandidate.url;
                picImg.currentSrc = picImg.src;
            }
        }
    };
    pf.ascendingSort = function(a, b) {
        return a.resolution - b.resolution;
    };
    pf.removeVideoShim = function(picture) {
        var videos = picture.getElementsByTagName("video");
        if (videos.length) {
            var video = videos[0], vsources = video.getElementsByTagName("source");
            while (vsources.length) {
                picture.insertBefore(vsources[0], video);
            }
            video.parentNode.removeChild(video);
        }
    };
    pf.getAllElements = function() {
        var elems = [], imgs = doc.getElementsByTagName("img");
        for (var h = 0, len = imgs.length; h < len; h++) {
            var currImg = imgs[h];
            if (currImg.parentNode.nodeName.toUpperCase() === "PICTURE" || currImg.getAttribute("srcset") !== null || currImg[pf.ns] && currImg[pf.ns].srcset !== null) {
                elems.push(currImg);
            }
        }
        return elems;
    };
    pf.getMatch = function(img, picture) {
        var sources = picture.childNodes, match;
        for (var j = 0, slen = sources.length; j < slen; j++) {
            var source = sources[j];
            if (source.nodeType !== 1) {
                continue;
            }
            if (source === img) {
                return match;
            }
            if (source.nodeName.toUpperCase() !== "SOURCE") {
                continue;
            }
            if (source.getAttribute("src") !== null && typeof console !== undefined) {
                console.warn("The `src` attribute is invalid on `picture` `source` element; instead, use `srcset`.");
            }
            var media = source.getAttribute("media");
            if (!source.getAttribute("srcset")) {
                continue;
            }
            if (!media || pf.matchesMedia(media)) {
                var typeSupported = pf.verifyTypeSupport(source);
                if (typeSupported === true) {
                    match = source;
                    break;
                } else if (typeSupported === "pending") {
                    return false;
                }
            }
        }
        return match;
    };
    function picturefill(opt) {
        var elements, element, parent, firstMatch, candidates, options = opt || {};
        elements = options.elements || pf.getAllElements();
        for (var i = 0, plen = elements.length; i < plen; i++) {
            element = elements[i];
            parent = element.parentNode;
            firstMatch = undefined;
            candidates = undefined;
            if (!element[pf.ns]) {
                element[pf.ns] = {};
            }
            if (!options.reevaluate && element[pf.ns].evaluated) {
                continue;
            }
            if (parent.nodeName.toUpperCase() === "PICTURE") {
                pf.removeVideoShim(parent);
                firstMatch = pf.getMatch(element, parent);
                if (firstMatch === false) {
                    continue;
                }
            } else {
                firstMatch = undefined;
            }
            if (parent.nodeName.toUpperCase() === "PICTURE" || element.srcset && !pf.srcsetSupported || !pf.sizesSupported && (element.srcset && element.srcset.indexOf("w") > -1)) {
                pf.dodgeSrcset(element);
            }
            if (firstMatch) {
                candidates = pf.processSourceSet(firstMatch);
                pf.applyBestCandidate(candidates, element);
            } else {
                candidates = pf.processSourceSet(element);
                if (element.srcset === undefined || element[pf.ns].srcset) {
                    pf.applyBestCandidate(candidates, element);
                }
            }
            element[pf.ns].evaluated = true;
        }
    }
    function runPicturefill() {
        picturefill();
        var intervalId = setInterval(function() {
            picturefill();
            if (/^loaded|^i|^c/.test(doc.readyState)) {
                clearInterval(intervalId);
                return;
            }
        }, 250);
        if (w.addEventListener) {
            var resizeThrottle;
            w.addEventListener("resize", function() {
                if (!w._picturefillWorking) {
                    w._picturefillWorking = true;
                    w.clearTimeout(resizeThrottle);
                    resizeThrottle = w.setTimeout(function() {
                        picturefill({
                            reevaluate: true
                        });
                        w._picturefillWorking = false;
                    }, 60);
                }
            }, false);
        }
    }
    runPicturefill();
    picturefill._ = pf;
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = picturefill;
    } else if (typeof define === "function" && define.amd) {
        define(function() {
            return picturefill;
        });
    } else if (typeof w === "object") {
        w.picturefill = picturefill;
    }
})(this, this.document);

(function(w) {
    "use strict";
    w.breadcrumbs = function() {
        var breadcrumbs = document.getElementById("breadcrumbs");
        var js_breadcrumbs__height;
        var breadcrumbs__height;
        if (breadcrumbs === null) {
            return;
        }
        var breadcrumbs_items = breadcrumbs.getElementsByClassName("breadcrumbs__item");
        if (breadcrumbs_items.length === 0) {
            return;
        }
        var js_breadcrumbs = breadcrumbs.getElementsByClassName("js__breadcrumbs__item").length > 0;
        if (matchMedia("screen and (min-width: 40em)").matches) {
            if (js_breadcrumbs === true) {
                w.removeClassJS(breadcrumbs_items);
            }
            return;
        }
        if (js_breadcrumbs === true) {
            js_breadcrumbs__height = breadcrumbs.offsetHeight;
            w.removeClassJS(breadcrumbs_items);
            js_breadcrumbs = false;
            breadcrumbs__height = breadcrumbs.offsetHeight;
        } else {
            breadcrumbs__height = breadcrumbs.offsetHeight;
            w.addClassJS(breadcrumbs_items);
            js_breadcrumbs = true;
            js_breadcrumbs__height = breadcrumbs.offsetHeight;
        }
        if (js_breadcrumbs__height !== breadcrumbs__height && js_breadcrumbs === true) {
            w.removeClassJS(breadcrumbs_items);
        }
        if (js_breadcrumbs__height === breadcrumbs__height && js_breadcrumbs === false) {
            w.addClassJS(breadcrumbs_items);
        }
    };
    w.removeClassJS = function(els) {
        for (var i = 0, il = els.length; i < il; i++) {
            els[i].className = els[i].className.replace(/\s*\bjs__breadcrumbs__item\b/gi, " ");
        }
    };
    w.addClassJS = function(els) {
        for (var i = 0, il = els.length; i < il; i++) {
            els[i].className += "  js__breadcrumbs__item";
        }
    };
    if (w.addEventListener) {
        w.addEventListener("resize", w.breadcrumbs, false);
        w.addEventListener("DOMContentLoaded", function() {
            w.breadcrumbs();
            w.removeEventListener("load", w.breadcrumbs, false);
        }, false);
        w.addEventListener("load", w.breadcrumbs, false);
    } else if (w.attachEvent) {
        w.attachEvent("onload", w.breadcrumbs);
    }
})(this);

(function(w) {
    "use strict";
    w.tileEqualHeightRows = function() {
        var wrappers = document.getElementsByClassName("tile__wrapper");
        if (wrappers.length === 0) {
            return;
        }
        var titles = document.getElementsByClassName("tile__title");
        if (titles.length === 0) {
            return;
        }
        var js_classes = document.getElementsByClassName("js__tile__wrapper").length > 0;
        if (matchMedia("screen and (max-width: 30em)").matches) {
            if (js_classes === true) {
                w.removeClass(wrappers, "js__tile__wrapper");
            }
            return;
        }
        if (js_classes === false) {
            w.addClass(wrappers, "js__tile__wrapper");
        }
        var currentTallest = 0, currentRowStart = 0, rowTiles = [], rowTileHeights = [], title, currentHeight = 0, topPosition = 0;
        for (var i = 0, il = titles.length; i < il; i++) {
            var currentTile = 0;
            title = titles[i];
            topPosition = title.offsetTop;
            if (title.style.height !== "" && title.style.height !== "auto") {
                title.style.height = "auto";
            }
            currentHeight = w.getHeight(title);
            if (currentRowStart !== topPosition) {
                for (currentTile = 0; currentTile < rowTiles.length; currentTile++) {
                    if (rowTileHeights[currentTile] < currentTallest) {
                        rowTiles[currentTile].style.height = currentTallest + "px";
                    }
                }
                rowTiles.length = 0;
                rowTileHeights.length = 0;
                currentRowStart = topPosition;
                currentTallest = currentHeight;
                rowTiles.push(title);
                rowTileHeights.push(currentHeight);
            } else {
                rowTiles.push(title);
                rowTileHeights.push(currentHeight);
                currentTallest = currentTallest < currentHeight ? currentHeight : currentTallest;
            }
            for (currentTile = 0; currentTile < rowTiles.length; currentTile++) {
                if (rowTileHeights[currentTile] < currentTallest) {
                    rowTiles[currentTile].style.height = currentTallest + "px";
                }
            }
        }
    };
    w.getStyle = function(el, styleProp) {
        if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
        } else if (el.currentStyle) {
            return el.currentStyle[styleProp];
        }
    };
    w.getHeight = function(el) {
        var height = el.offsetHeight;
        var cssProps = new Array("border-top-width", "padding-top", "padding-bottom", "border-bottom-width");
        for (var i = 0, il = cssProps.length; i < il; i++) {
            height -= parseFloat(w.getStyle(el, cssProps[i]));
        }
        return height;
    };
    w.removeClass = function(els, cl) {
        var regex = new RegExp("\\s*\\b" + cl + "\\b", "gi");
        for (var i = 0, il = els.length; i < il; i++) {
            els[i].className = els[i].className.replace(regex, " ");
        }
    };
    w.addClass = function(els, cl) {
        for (var i = 0, il = els.length; i < il; i++) {
            els[i].className += "  " + cl;
        }
    };
    if (w.addEventListener) {
        w.addEventListener("resize", w.tileEqualHeightRows, false);
        w.addEventListener("DOMContentLoaded", function() {
            w.tileEqualHeightRows();
            w.removeEventListener("load", w.tileEqualHeightRows, false);
        }, false);
        w.addEventListener("load", w.tileEqualHeightRows, false);
    } else if (w.attachEvent) {
        w.attachEvent("onload", w.tileEqualHeightRows);
    }
})(this);

(function(w) {
    "use strict";
    w.enhanceSiteSearch = function() {
        var siteSearch = document.getElementById("site-search");
        var siteSearchCX = document.getElementById("site-search__cx");
        var siteSearchNoJS = document.getElementById("site-search__nojs");
        if (siteSearch === null || siteSearchCX === null || siteSearchNoJS === null) {
            return;
        }
        siteSearch.action = "//vesterheim.org/search/";
        siteSearchCX.value = "005748589984410066710:rpuk4fvq7ak";
        siteSearchNoJS.parentNode.removeChild(siteSearchNoJS);
    };
    if (w.addEventListener) {
        w.addEventListener("DOMContentLoaded", function() {
            w.enhanceSiteSearch();
            w.removeEventListener("load", w.enhanceSiteSearch, false);
        }, false);
        w.addEventListener("load", w.enhanceSiteSearch, false);
    } else if (w.attachEvent) {
        w.attachEvent("onload", w.enhanceSiteSearch);
    }
})(this);