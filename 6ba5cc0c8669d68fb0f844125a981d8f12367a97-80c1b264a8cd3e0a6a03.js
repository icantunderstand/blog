"use strict";(self.webpackChunknoodes_personal_blog=self.webpackChunknoodes_personal_blog||[]).push([[189],{5799:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r=e||"";t&&(r=e.toString().trim().replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g,(function(e,t,o){return t>0&&t+e.length!==o.length&&e.search(n)>-1&&":"!==o.charAt(t-2)&&("-"!==o.charAt(t+e.length)||"-"===o.charAt(t-1))&&o.charAt(t-1).search(/[^\s-]/)<0?e.toLowerCase():e.substr(1).search(/[A-Z]|\../)>-1?e:e.charAt(0).toUpperCase()+e.substr(1)})));a&&(r=function(e){if(function(e){return"string"==typeof e&&-1!==e.indexOf("@")}(e))return console.warn("This arg looks like an email address, redacting."),o;return e}(r));return r};var n=/^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;var o="REDACTED (Potential Email Address)"},6991:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.GA4=void 0;var o=s(n(9127)),a=s(n(5799)),r=["eventCategory","eventAction","eventLabel","eventValue","hitType"],i=["title","location"],c=["page","hitType"],u=["action","category","label","value","nonInteraction","transport"];function s(e){return e&&e.__esModule?e:{default:e}}function l(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}function f(e){return f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},f(e)}function g(e){return function(e){if(Array.isArray(e))return v(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||m(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){b(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function y(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==n)return;var o,a,r=[],i=!0,c=!1;try{for(n=n.call(e);!(i=(o=n.next()).done)&&(r.push(o.value),!t||r.length!==t);i=!0);}catch(u){c=!0,a=u}finally{try{i||null==n.return||n.return()}finally{if(c)throw a}}return r}(e,t)||m(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e,t){if(e){if("string"==typeof e)return v(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?v(e,t):void 0}}function v(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}function _(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function b(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var h=function(){function e(){var t=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),b(this,"reset",(function(){t.isInitialized=!1,t._testMode=!1,t._currentMeasurementId,t._hasLoadedGA=!1,t._isQueuing=!1,t._queueGtag=[]})),b(this,"_gtag",(function(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];t._testMode||t._isQueuing?t._queueGtag.push(n):o.default.apply(void 0,n)})),b(this,"_loadGA",(function(e,n){if("undefined"!=typeof window&&"undefined"!=typeof document&&!t._hasLoadedGA){var o=document.createElement("script");o.async=!0,o.src="https://www.googletagmanager.com/gtag/js?id=".concat(e),n&&o.setAttribute("nonce",n),document.body.appendChild(o),window.dataLayer=window.dataLayer||[],window.gtag=function(){window.dataLayer.push(arguments)},t._hasLoadedGA=!0}})),b(this,"_toGtagOptions",(function(e){if(e){var t={cookieUpdate:"cookie_update",cookieExpires:"cookie_expires",cookieDomain:"cookie_domain",cookieFlags:"cookie_flags",userId:"user_id",clientId:"client_id",anonymizeIp:"anonymize_ip",contentGroup1:"content_group1",contentGroup2:"content_group2",contentGroup3:"content_group3",contentGroup4:"content_group4",contentGroup5:"content_group5",allowAdFeatures:"allow_google_signals",allowAdPersonalizationSignals:"allow_ad_personalization_signals",nonInteraction:"non_interaction",page:"page_path",hitCallback:"event_callback"};return Object.entries(e).reduce((function(e,n){var o=y(n,2),a=o[0],r=o[1];return t[a]?e[t[a]]=r:e[a]=r,e}),{})}})),b(this,"initialize",(function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!e)throw new Error("Require GA_MEASUREMENT_ID");var o="string"==typeof e?[{trackingId:e}]:e;t._currentMeasurementId=o[0].trackingId;var a=n.gaOptions,r=n.gtagOptions,i=n.legacyDimensionMetric,c=void 0===i||i,u=n.nonce,s=n.testMode,l=void 0!==s&&s;if(t._testMode=l,l||t._loadGA(t._currentMeasurementId,u),t.isInitialized||(t._gtag("js",new Date),o.forEach((function(e){var n=t._appendCustomMap(p(p(p({send_page_view:!1},t._toGtagOptions(p(p({},a),e.gaOptions))),r),e.gtagOptions),c);t._gtag("config",e.trackingId,n)}))),t.isInitialized=!0,!l){var f=g(t._queueGtag);for(t._queueGtag=[],t._isQueuing=!1;f.length;){var d=f.shift();t._gtag.apply(t,g(d)),"get"===d[0]&&(t._isQueuing=!0)}}})),b(this,"set",(function(e){e?"object"===f(e)?(0===Object.keys(e).length&&console.warn("empty `fieldsObject` given to .set()"),t._gaCommand("set",e)):console.warn("Expected `fieldsObject` arg to be an Object"):console.warn("`fieldsObject` is required in .set()")})),b(this,"_gaCommandSendEvent",(function(e,n,o,a,r){t._gtag("event",n,p(p({event_category:e,event_label:o,value:a},r&&{non_interaction:r.nonInteraction}),t._toGtagOptions(r)))})),b(this,"_gaCommandSendEventParameters",(function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];if("string"==typeof n[0])t._gaCommandSendEvent.apply(t,g(n.slice(1)));else{var a=n[0],i=a.eventCategory,c=a.eventAction,u=a.eventLabel,s=a.eventValue,f=(a.hitType,l(a,r));t._gaCommandSendEvent(i,c,u,s,f)}})),b(this,"_gaCommandSendTiming",(function(e,n,o,a){t._gtag("event","timing_complete",{name:n,value:o,event_category:e,event_label:a})})),b(this,"_gaCommandSendPageview",(function(e,n){if(n&&Object.keys(n).length){var o=t._toGtagOptions(n),a=o.title,r=o.location,c=l(o,i);t._gtag("event","page_view",p(p(p(p({},e&&{page_path:e}),a&&{page_title:a}),r&&{page_location:r}),c))}else e?t._gtag("event","page_view",{page_path:e}):t._gtag("event","page_view")})),b(this,"_gaCommandSendPageviewParameters",(function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];if("string"==typeof n[0])t._gaCommandSendPageview.apply(t,g(n.slice(1)));else{var a=n[0],r=a.page,i=(a.hitType,l(a,c));t._gaCommandSendPageview(r,i)}})),b(this,"_gaCommandSend",(function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];var a="string"==typeof n[0]?n[0]:n[0].hitType;switch(a){case"event":t._gaCommandSendEventParameters.apply(t,n);break;case"pageview":t._gaCommandSendPageviewParameters.apply(t,n);break;case"timing":t._gaCommandSendTiming.apply(t,g(n.slice(1)));break;case"screenview":case"transaction":case"item":case"social":case"exception":console.warn("Unsupported send command: ".concat(a));break;default:console.warn("Send command doesn't exist: ".concat(a))}})),b(this,"_gaCommandSet",(function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];"string"==typeof n[0]&&(n[0]=b({},n[0],n[1])),t._gtag("set",t._toGtagOptions(n[0]))})),b(this,"_gaCommand",(function(e){for(var n=arguments.length,o=new Array(n>1?n-1:0),a=1;a<n;a++)o[a-1]=arguments[a];switch(e){case"send":t._gaCommandSend.apply(t,o);break;case"set":t._gaCommandSet.apply(t,o);break;default:console.warn("Command doesn't exist: ".concat(e))}})),b(this,"ga",(function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];if("string"==typeof n[0])t._gaCommand.apply(t,n);else{var a=n[0];t._gtag("get",t._currentMeasurementId,"client_id",(function(e){t._isQueuing=!1;var n=t._queueGtag;for(a({get:function(n){return"clientId"===n?e:"trackingId"===n?t._currentMeasurementId:"apiVersion"===n?"1":void 0}});n.length;){var o=n.shift();t._gtag.apply(t,g(o))}})),t._isQueuing=!0}return t.ga})),b(this,"event",(function(e,n){if("string"==typeof e)t._gtag("event",e,t._toGtagOptions(n));else{var o=e.action,r=e.category,i=e.label,c=e.value,s=e.nonInteraction,f=e.transport,g=l(e,u);if(!r||!o)return void console.warn("args.category AND args.action are required in event()");var d={hitType:"event",eventCategory:(0,a.default)(r),eventAction:(0,a.default)(o)};i&&(d.eventLabel=(0,a.default)(i)),void 0!==c&&("number"!=typeof c?console.warn("Expected `args.value` arg to be a Number."):d.eventValue=c),void 0!==s&&("boolean"!=typeof s?console.warn("`args.nonInteraction` must be a boolean."):d.nonInteraction=s),void 0!==f&&("string"!=typeof f?console.warn("`args.transport` must be a string."):(-1===["beacon","xhr","image"].indexOf(f)&&console.warn("`args.transport` must be either one of these values: `beacon`, `xhr` or `image`"),d.transport=f)),Object.keys(g).filter((function(e){return"dimension"===e.substr(0,"dimension".length)})).forEach((function(e){d[e]=g[e]})),Object.keys(g).filter((function(e){return"metric"===e.substr(0,"metric".length)})).forEach((function(e){d[e]=g[e]})),t._gaCommand("send",d)}})),b(this,"send",(function(e){t._gaCommand("send",e)})),b(this,"pageview",(function(e,n,o){var a=null==e?void 0:e.trim();""!==a?t._gaCommand("send","pageview",a,{title:o}):console.warn("path cannot be an empty string in .pageview()")})),this.reset()}var t,n,s;return t=e,n=[{key:"gtag",value:function(){this._gtag.apply(this,arguments)}},{key:"_appendCustomMap",value:function(e){if(arguments.length>1&&void 0!==arguments[1]&&!arguments[1])return e;e.custom_map||(e.custom_map={});for(var t=1;t<=200;t++)e.custom_map["dimension".concat(t)]||(e.custom_map["dimension".concat(t)]="dimension".concat(t)),e.custom_map["metric".concat(t)]||(e.custom_map["metric".concat(t)]="metric".concat(t));return e}},{key:"outboundLink",value:function(e,t){var n=e.label;if("function"==typeof t)if(n){var o={hitType:"event",eventCategory:"Outbound",eventAction:"Click",eventLabel:(0,a.default)(n)},r=!1,i=setTimeout((function(){r=!0,t()}),250);o.hitCallback=function(){clearTimeout(i),r||t()},this._gaCommand("send",o)}else console.warn("args.label is required in outboundLink()");else console.warn("hitCallback function is required")}}],n&&_(t.prototype,n),s&&_(t,s),e}();t.GA4=h;var w=new h;t.default=w},9127:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var o;"undefined"!=typeof window&&(void 0===window.gtag&&(window.dataLayer=window.dataLayer||[],window.gtag=function(){window.dataLayer.push(arguments)}),(o=window).gtag.apply(o,t))};t.default=n},6725:function(e,t,n){function o(e){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o(e)}t.ZP=void 0;var a=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!==o(e)&&"function"!=typeof e)return{default:e};var n=r(t);if(n&&n.has(e))return n.get(e);var a={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var c in e)if("default"!==c&&Object.prototype.hasOwnProperty.call(e,c)){var u=i?Object.getOwnPropertyDescriptor(e,c):null;u&&(u.get||u.set)?Object.defineProperty(a,c,u):a[c]=e[c]}a.default=e,n&&n.set(e,a);return a}(n(6991));function r(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(r=function(e){return e?n:t})(e)}a.GA4;var i=a.default;t.ZP=i},528:function(e,t,n){n.d(t,{H:function(){return i},P:function(){return r}});var o=n(6725),a=!1;o.ZP.initialize("G-Q5Q946VQJF");var r=function(){a||(console.log("发送首页pv"),a=!0,o.ZP.send({hitType:"pageview",path:"home"}))},i=function(){console.log("页面pv");var e=window.location.pathname;o.ZP.send({hitType:"pageview",path:e})}}}]);
//# sourceMappingURL=6ba5cc0c8669d68fb0f844125a981d8f12367a97-80c1b264a8cd3e0a6a03.js.map