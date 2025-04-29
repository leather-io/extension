// This file is a copy of the `parse-cdn.js` file in the
// `@segment/analytics-next` package Since this package tries to fetch remote
// scripts, we have to override it to prevent chrome store rejections.
// Issue opened in their repo https://github.com/segmentio/analytics-next/issues/1283
import { embeddedWriteKey } from './embedded-write-key';
import { getGlobalAnalytics } from './global-analytics-helper';

var analyticsScriptRegex = /(https:\/\/.*)\/analytics\.js\/v1\/(?:.*?)\/(?:platform|analytics.*)?/;
var getCDNUrlFromScriptTag = function () {
  var cdn;
  var scripts = Array.prototype.slice.call(document.querySelectorAll('script'));
  scripts.forEach(function (s) {
    var _a;
    var src = (_a = s.getAttribute('src')) !== null && _a !== void 0 ? _a : '';
    var result = analyticsScriptRegex.exec(src);
    if (result && result[1]) {
      cdn = result[1];
    }
  });
  return cdn;
};
var _globalCDN; // set globalCDN as in-memory singleton
var getGlobalCDNUrl = function () {
  var _a;
  var result =
    _globalCDN !== null && _globalCDN !== void 0
      ? _globalCDN
      : (_a = getGlobalAnalytics()) === null || _a === void 0
        ? void 0
        : _a._cdn;
  return result;
};
export var setGlobalCDNUrl = function (cdn) {
  var globalAnalytics = getGlobalAnalytics();
  if (globalAnalytics) {
    globalAnalytics._cdn = cdn;
  }
  _globalCDN = cdn;
};
export var getCDN = function () {
  var globalCdnUrl = getGlobalCDNUrl();
  if (globalCdnUrl) return globalCdnUrl;
  var cdnFromScriptTag = getCDNUrlFromScriptTag();
  if (cdnFromScriptTag) {
    return cdnFromScriptTag;
  } else {
    // it's possible that the CDN is not found in the page because:
    // - the script is loaded through a proxy
    // - the script is removed after execution
    // in this case, we fall back to the default Segment CDN
    return 'https://cdn.segment.com';
  }
};
export var getNextIntegrationsURL = function () {
  var cdn = getCDN();
  return ''.concat(cdn, '/next-integrations');
};
/**
 * Replaces the CDN URL in the script tag with the one from Analytics.js 1.0
 *
 * @returns the path to Analytics JS 1.0
 **/
export function getLegacyAJSPath() {
  return '';
  // var _a, _b, _c;
  // var writeKey =
  //   (_a = embeddedWriteKey()) !== null && _a !== void 0
  //     ? _a
  //     : (_b = getGlobalAnalytics()) === null || _b === void 0
  //       ? void 0
  //       : _b._writeKey;
  // var scripts = Array.prototype.slice.call(document.querySelectorAll('script'));
  // var path = undefined;
  // for (var _i = 0, scripts_1 = scripts; _i < scripts_1.length; _i++) {
  //   var s = scripts_1[_i];
  //   var src = (_c = s.getAttribute('src')) !== null && _c !== void 0 ? _c : '';
  //   var result = analyticsScriptRegex.exec(src);
  //   if (result && result[1]) {
  //     path = src;
  //     break;
  //   }
  // }
  // if (path) {
  //   return path.replace('analytics.min.js', 'analytics.classic.js');
  // }
  // return 'https://cdn.segment.com/analytics.js/v1/'.concat(writeKey, '/analytics.classic.js');
}
//# sourceMappingURL=parse-cdn.js.map
