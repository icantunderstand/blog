/*! For license information please see component---src-templates-post-js-7e1cdbb42c2597e38cb0.js.LICENSE.txt */(self.webpackChunknoodes_personal_blog=self.webpackChunknoodes_personal_blog||[]).push([[851],{9591:function(t,e,r){var n=r(8).default;function o(){"use strict";t.exports=o=function(){return e},t.exports.__esModule=!0,t.exports.default=t.exports;var e={},r=Object.prototype,i=r.hasOwnProperty,a="function"==typeof Symbol?Symbol:{},c=a.iterator||"@@iterator",u=a.asyncIterator||"@@asyncIterator",s=a.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var o,i,a=Object.create((e&&e.prototype instanceof d?e:d).prototype),c=new k(n||[]);return a._invoke=(o=c,i="suspendedStart",function(e,n){if("executing"===i)throw Error("Generator is already running");if("completed"===i){if("throw"===e)throw n;return S()}for(o.method=e,o.arg=n;;){var a=o.delegate;if(a){var c=function t(e,r){var n=e.iterator[r.method];if(void 0===n){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=void 0,t(e,r),"throw"===r.method))return h;r.method="throw",r.arg=TypeError("The iterator does not provide a 'throw' method")}return h}var o=p(n,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,h;var i=o.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=void 0),r.delegate=null,h):i:(r.method="throw",r.arg=TypeError("iterator result is not an object"),r.delegate=null,h)}(a,o);if(c){if(c===h)continue;return c}}if("next"===o.method)o.sent=o._sent=o.arg;else if("throw"===o.method){if("suspendedStart"===i)throw i="completed",o.arg;o.dispatchException(o.arg)}else"return"===o.method&&o.abrupt("return",o.arg);i="executing";var u=p(t,r,o);if("normal"===u.type){if(i=o.done?"completed":"suspendedYield",u.arg===h)continue;return{value:u.arg,done:o.done}}"throw"===u.type&&(i="completed",o.method="throw",o.arg=u.arg)}}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var h={};function d(){}function m(){}function y(){}var v={};l(v,c,function(){return this});var g=Object.getPrototypeOf,b=g&&g(g(j([])));b&&b!==r&&i.call(b,c)&&(v=b);var w=y.prototype=d.prototype=Object.create(v);function x(t){["next","throw","return"].forEach(function(e){l(t,e,function(t){return this._invoke(e,t)})})}function E(t,e){var r;this._invoke=function(o,a){function c(){return new e(function(r,c){!function r(o,a,c,u){var s=p(t[o],t,a);if("throw"!==s.type){var l=s.arg,f=l.value;return f&&"object"==n(f)&&i.call(f,"__await")?e.resolve(f.__await).then(function(t){r("next",t,c,u)},function(t){r("throw",t,c,u)}):e.resolve(f).then(function(t){l.value=t,c(l)},function(t){return r("throw",t,c,u)})}u(s.arg)}(o,a,r,c)})}return r=r?r.then(c,c):c()}}function _(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function L(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function k(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(_,this),this.reset(!0)}function j(t){if(t){var e=t[c];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,n=function e(){for(;++r<t.length;)if(i.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return n.next=n}}return{next:S}}function S(){return{value:void 0,done:!0}}return m.prototype=y,l(w,"constructor",y),l(y,"constructor",m),m.displayName=l(y,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===m||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,l(t,s,"GeneratorFunction")),t.prototype=Object.create(w),t},e.awrap=function(t){return{__await:t}},x(E.prototype),l(E.prototype,u,function(){return this}),e.AsyncIterator=E,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new E(f(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then(function(t){return t.done?t.value:a.next()})},x(w),l(w,s,"Generator"),l(w,c,function(){return this}),l(w,"toString",function(){return"[object Generator]"}),e.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=j,k.prototype={constructor:k,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(L),!t)for(var e in this)"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,n){return a.type="throw",a.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n],a=o.completion;if("root"===o.tryLoc)return r("end");if(o.tryLoc<=this.prev){var c=i.call(o,"catchLoc"),u=i.call(o,"finallyLoc");if(c&&u){if(this.prev<o.catchLoc)return r(o.catchLoc,!0);if(this.prev<o.finallyLoc)return r(o.finallyLoc)}else if(c){if(this.prev<o.catchLoc)return r(o.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return r(o.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,h):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),L(r),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;L(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:j(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),h}},e}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports},8:function(t){function e(r){return t.exports=e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t.exports.__esModule=!0,t.exports.default=t.exports,e(r)}t.exports=e,t.exports.__esModule=!0,t.exports.default=t.exports},7757:function(t,e,r){var n=r(9591)();t.exports=n;try{regeneratorRuntime=n}catch(t){"object"==typeof globalThis?globalThis.regeneratorRuntime=n:Function("r","regeneratorRuntime = r")(n)}},6003:function(t,e,r){"use strict";var n=r(7294);e.Z=function(){return n.createElement("script",{async:!0,src:"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8259624032507561",crossorigin:"anonymous"})}},6340:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return v}});var n=r(7294),o=r(6125),i=r(6780),a=r(7566),c=r(5861),u=r(1721),s=r(7757),l=r.n(s),f={width:700,margin:"0 auto"},p=function(t){function e(e){var r;return(r=t.call(this,e)||this)._commentRef=n.createRef(),r}(0,u.Z)(e,t);var o,i=e.prototype;return i.componentDidMount=(o=(0,c.Z)(l().mark(function t(){var e;return l().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if("undefined"!=typeof window){t.next=2;break}return t.abrupt("return");case 2:if(this._commentRef.current){t.next=4;break}return t.abrupt("return");case 4:return t.next=6,Promise.all([r.e(137),r.e(4)]).then(r.t.bind(r,771,23));case 6:return t.next=8,t.sent.default;case 8:e=t.sent,this._valine=new e({el:this._commentRef.current,appId:"5UvRKnJtRpFNVsjwkIYxayN9-gzGzoHsz",appKey:"07PG3nQyrsrJCDmjzEUgy2R9",path:window.location.pathname});case 10:case"end":return t.stop()}},t,this)})),function(){return o.apply(this,arguments)}),i.render=function(){return n.createElement("div",{style:f,id:"vcomment",ref:this._commentRef})},e}(n.PureComponent),h=r(6003),d=r(2753),m=r(528),y=(0,i.k)(function(t){return{content:{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"center",paddingBottom:70}}});function v(t){var e=t.data,i=t.pageContext,c=(void 0===i?{}:i).readingTime,u=e.markdownRemark,s=u.frontmatter,l=u.html,f=y().classes;return(0,n.useEffect)(function(){(0,m.H)()},[]),n.createElement(a.V,{padding:"md",header:n.createElement(d.Z,{isDetailPage:!0}),styles:function(t){return{root:{backgroundColor:"dark"===t.colorScheme?t.colors.dark[8]:t.colors.gray[0]},main:{paddingTop:20}}}},n.createElement("div",{className:f.content},n.createElement("div",{className:"blog-post"},n.createElement("h1",{className:"blog-post-content"},s.title),c&&n.createElement("div",{className:"blog-post-content"},c),n.createElement("div",{className:"blog-post-content",dangerouslySetInnerHTML:{__html:l}}),n.createElement("div",{className:"blog-footer"},n.createElement(o.S,{src:"../post/images/qrcode.jpg",alt:"",__imageData:r(9032)}),n.createElement("div",null,"欢迎大家关注我的公众号-前端小板凳 一起学习进步！")),n.createElement(p,null),n.createElement(h.Z,null))))}},5861:function(t,e,r){"use strict";function n(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function o(t){return function(){var e=this,r=arguments;return new Promise(function(o,i){var a=t.apply(e,r);function c(t){n(a,o,i,c,u,"next",t)}function u(t){n(a,o,i,c,u,"throw",t)}c(void 0)})}}r.d(e,{Z:function(){return o}})},9032:function(t){"use strict";t.exports=JSON.parse('{"layout":"constrained","backgroundColor":"#f8f8f8","images":{"fallback":{"src":"/static/fea72b8bb6c1352a510a256c539d4702/6ee52/qrcode.jpg","srcSet":"/static/fea72b8bb6c1352a510a256c539d4702/8025c/qrcode.jpg 86w,\\n/static/fea72b8bb6c1352a510a256c539d4702/15bb5/qrcode.jpg 172w,\\n/static/fea72b8bb6c1352a510a256c539d4702/6ee52/qrcode.jpg 344w","sizes":"(min-width: 344px) 344px, 100vw"},"sources":[{"srcSet":"/static/fea72b8bb6c1352a510a256c539d4702/ff4dd/qrcode.webp 86w,\\n/static/fea72b8bb6c1352a510a256c539d4702/d6c07/qrcode.webp 172w,\\n/static/fea72b8bb6c1352a510a256c539d4702/0f0fa/qrcode.webp 344w","type":"image/webp","sizes":"(min-width: 344px) 344px, 100vw"}]},"width":344,"height":344}')}}]);