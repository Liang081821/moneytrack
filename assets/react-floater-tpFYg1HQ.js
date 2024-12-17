import{e as m}from"./react-DrNrPb_Q.js";import{P as u}from"./prop-types-DKB6m3M1.js";import{P as K}from"./popper.js-CCzXKaxK.js";import{d as V}from"./deepmerge-DkpI02Ha.js";import{R as $}from"./react-dom-DnkMH0ii.js";var be=["innerHTML","ownerDocument","style","attributes","nodeValue"],we=["Array","ArrayBuffer","AsyncFunction","AsyncGenerator","AsyncGeneratorFunction","Date","Error","Function","Generator","GeneratorFunction","HTMLElement","Map","Object","Promise","RegExp","Set","WeakMap","WeakSet"],Oe=["bigint","boolean","null","number","string","symbol","undefined"];function z(e){var t=Object.prototype.toString.call(e).slice(8,-1);if(/HTML\w+Element/.test(t))return"HTMLElement";if(Ee(t))return t}function _(e){return function(t){return z(t)===e}}function Ee(e){return we.includes(e)}function A(e){return function(t){return typeof t===e}}function Re(e){return Oe.includes(e)}function a(e){if(e===null)return"null";switch(typeof e){case"bigint":return"bigint";case"boolean":return"boolean";case"number":return"number";case"string":return"string";case"symbol":return"symbol";case"undefined":return"undefined"}if(a.array(e))return"Array";if(a.plainFunction(e))return"Function";var t=z(e);return t||"Object"}a.array=Array.isArray;a.arrayOf=function(e,t){return!a.array(e)&&!a.function(t)?!1:e.every(function(n){return t(n)})};a.asyncGeneratorFunction=function(e){return z(e)==="AsyncGeneratorFunction"};a.asyncFunction=_("AsyncFunction");a.bigint=A("bigint");a.boolean=function(e){return e===!0||e===!1};a.date=_("Date");a.defined=function(e){return!a.undefined(e)};a.domElement=function(e){return a.object(e)&&!a.plainObject(e)&&e.nodeType===1&&a.string(e.nodeName)&&be.every(function(t){return t in e})};a.empty=function(e){return a.string(e)&&e.length===0||a.array(e)&&e.length===0||a.object(e)&&!a.map(e)&&!a.set(e)&&Object.keys(e).length===0||a.set(e)&&e.size===0||a.map(e)&&e.size===0};a.error=_("Error");a.function=A("function");a.generator=function(e){return a.iterable(e)&&a.function(e.next)&&a.function(e.throw)};a.generatorFunction=_("GeneratorFunction");a.instanceOf=function(e,t){return!e||!t?!1:Object.getPrototypeOf(e)===t.prototype};a.iterable=function(e){return!a.nullOrUndefined(e)&&a.function(e[Symbol.iterator])};a.map=_("Map");a.nan=function(e){return Number.isNaN(e)};a.null=function(e){return e===null};a.nullOrUndefined=function(e){return a.null(e)||a.undefined(e)};a.number=function(e){return A("number")(e)&&!a.nan(e)};a.numericString=function(e){return a.string(e)&&e.length>0&&!Number.isNaN(Number(e))};a.object=function(e){return!a.nullOrUndefined(e)&&(a.function(e)||typeof e=="object")};a.oneOf=function(e,t){return a.array(e)?e.indexOf(t)>-1:!1};a.plainFunction=_("Function");a.plainObject=function(e){if(z(e)!=="Object")return!1;var t=Object.getPrototypeOf(e);return t===null||t===Object.getPrototypeOf({})};a.primitive=function(e){return a.null(e)||Re(typeof e)};a.promise=_("Promise");a.propertyOf=function(e,t,n){if(!a.object(e)||!t)return!1;var i=e[t];return a.function(n)?n(i):a.defined(i)};a.regexp=_("RegExp");a.set=_("Set");a.string=A("string");a.symbol=A("symbol");a.undefined=A("undefined");a.weakMap=_("WeakMap");a.weakSet=_("WeakSet");function le(e){return function(t){return typeof t===e}}var Pe=le("function"),Ce=function(e){return e===null},Q=function(e){return Object.prototype.toString.call(e).slice(8,-1)==="RegExp"},X=function(e){return!je(e)&&!Ce(e)&&(Pe(e)||typeof e=="object")},je=le("undefined"),Y=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,n=t&&e[t],i=0;if(n)return n.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&i>=e.length&&(e=void 0),{value:e&&e[i++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};function _e(e,t){var n=e.length;if(n!==t.length)return!1;for(var i=n;i--!==0;)if(!j(e[i],t[i]))return!1;return!0}function ke(e,t){if(e.byteLength!==t.byteLength)return!1;for(var n=new DataView(e.buffer),i=new DataView(t.buffer),r=e.byteLength;r--;)if(n.getUint8(r)!==i.getUint8(r))return!1;return!0}function Te(e,t){var n,i,r,o;if(e.size!==t.size)return!1;try{for(var l=Y(e.entries()),f=l.next();!f.done;f=l.next()){var s=f.value;if(!t.has(s[0]))return!1}}catch(p){n={error:p}}finally{try{f&&!f.done&&(i=l.return)&&i.call(l)}finally{if(n)throw n.error}}try{for(var c=Y(e.entries()),h=c.next();!h.done;h=c.next()){var s=h.value;if(!j(s[1],t.get(s[0])))return!1}}catch(p){r={error:p}}finally{try{h&&!h.done&&(o=c.return)&&o.call(c)}finally{if(r)throw r.error}}return!0}function Se(e,t){var n,i;if(e.size!==t.size)return!1;try{for(var r=Y(e.entries()),o=r.next();!o.done;o=r.next()){var l=o.value;if(!t.has(l[0]))return!1}}catch(f){n={error:f}}finally{try{o&&!o.done&&(i=r.return)&&i.call(r)}finally{if(n)throw n.error}}return!0}function j(e,t){if(e===t)return!0;if(e&&X(e)&&t&&X(t)){if(e.constructor!==t.constructor)return!1;if(Array.isArray(e)&&Array.isArray(t))return _e(e,t);if(e instanceof Map&&t instanceof Map)return Te(e,t);if(e instanceof Set&&t instanceof Set)return Se(e,t);if(ArrayBuffer.isView(e)&&ArrayBuffer.isView(t))return ke(e,t);if(Q(e)&&Q(t))return e.source===t.source&&e.flags===t.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===t.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===t.toString();var n=Object.keys(e),i=Object.keys(t);if(n.length!==i.length)return!1;for(var r=n.length;r--!==0;)if(!Object.prototype.hasOwnProperty.call(t,n[r]))return!1;for(var r=n.length;r--!==0;){var o=n[r];if(!(o==="_owner"&&e.$$typeof)&&!j(e[o],t[o]))return!1}return!0}return Number.isNaN(e)&&Number.isNaN(t)?!0:e===t}function Ae(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return e.every(function(n){return a.string(n)||a.array(n)||a.plainObject(n)})}function xe(e,t,n){return ue(e,t)?[e,t].every(a.array)?!e.some(oe(n))&&t.some(oe(n)):[e,t].every(a.plainObject)?!Object.entries(e).some(ne(n))&&Object.entries(t).some(ne(n)):t===n:!1}function ee(e,t,n){var i=n.actual,r=n.key,o=n.previous,l=n.type,f=T(e,r),s=T(t,r),c=[f,s].every(a.number)&&(l==="increased"?f<s:f>s);return a.undefined(i)||(c=c&&s===i),a.undefined(o)||(c=c&&f===o),c}function te(e,t,n){var i=n.key,r=n.type,o=n.value,l=T(e,i),f=T(t,i),s=r==="added"?l:f,c=r==="added"?f:l;if(!a.nullOrUndefined(o)){if(a.defined(s)){if(a.array(s)||a.plainObject(s))return xe(s,c,o)}else return j(c,o);return!1}return[l,f].every(a.array)?!c.every(J(s)):[l,f].every(a.plainObject)?We(Object.keys(s),Object.keys(c)):![l,f].every(function(h){return a.primitive(h)&&a.defined(h)})&&(r==="added"?!a.defined(l)&&a.defined(f):a.defined(l)&&!a.defined(f))}function re(e,t,n){var i=n===void 0?{}:n,r=i.key,o=T(e,r),l=T(t,r);if(!ue(o,l))throw new TypeError("Inputs have different types");if(!Ae(o,l))throw new TypeError("Inputs don't have length");return[o,l].every(a.plainObject)&&(o=Object.keys(o),l=Object.keys(l)),[o,l]}function ne(e){return function(t){var n=t[0],i=t[1];return a.array(e)?j(e,i)||e.some(function(r){return j(r,i)||a.array(i)&&J(i)(r)}):a.plainObject(e)&&e[n]?!!e[n]&&j(e[n],i):j(e,i)}}function We(e,t){return t.some(function(n){return!e.includes(n)})}function oe(e){return function(t){return a.array(e)?e.some(function(n){return j(n,t)||a.array(t)&&J(t)(n)}):j(e,t)}}function N(e,t){return a.array(e)?e.some(function(n){return j(n,t)}):j(e,t)}function J(e){return function(t){return e.some(function(n){return j(n,t)})}}function ue(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return e.every(a.array)||e.every(a.number)||e.every(a.plainObject)||e.every(a.string)}function T(e,t){if(a.plainObject(e)||a.array(e)){if(a.string(t)){var n=t.split(".");return n.reduce(function(i,r){return i&&i[r]},e)}return a.number(t)?e[t]:e}return e}function Ie(e,t){if([e,t].some(a.nullOrUndefined))throw new Error("Missing required parameters");if(![e,t].every(function(p){return a.plainObject(p)||a.array(p)}))throw new Error("Expected plain objects or array");var n=function(p,d){try{return te(e,t,{key:p,type:"added",value:d})}catch{return!1}},i=function(p,d,y){try{var w=T(e,p),g=T(t,p),P=a.defined(d),E=a.defined(y);if(P||E){var b=E?N(y,w):!N(d,w),x=N(d,g);return b&&x}return[w,g].every(a.array)||[w,g].every(a.plainObject)?!j(w,g):w!==g}catch{return!1}},r=function(p,d,y){if(!a.defined(p))return!1;try{var w=T(e,p),g=T(t,p),P=a.defined(y);return N(d,w)&&(P?N(y,g):!P)}catch{return!1}},o=function(p,d){return a.defined(p)?i(p,d):!1},l=function(p,d,y){if(!a.defined(p))return!1;try{return ee(e,t,{key:p,actual:d,previous:y,type:"decreased"})}catch{return!1}},f=function(p){try{var d=re(e,t,{key:p}),y=d[0],w=d[1];return!!y.length&&!w.length}catch{return!1}},s=function(p){try{var d=re(e,t,{key:p}),y=d[0],w=d[1];return!y.length&&!!w.length}catch{return!1}},c=function(p,d,y){if(!a.defined(p))return!1;try{return ee(e,t,{key:p,actual:d,previous:y,type:"increased"})}catch{return!1}},h=function(p,d){try{return te(e,t,{key:p,type:"removed",value:d})}catch{return!1}};return{added:n,changed:i,changedFrom:r,changedTo:o,decreased:l,emptied:f,filled:s,increased:c,removed:h}}function ie(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),n.push.apply(n,i)}return n}function O(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?ie(Object(n),!0).forEach(function(i){C(e,i,n[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ie(Object(n)).forEach(function(i){Object.defineProperty(e,i,Object.getOwnPropertyDescriptor(n,i))})}return e}function L(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function Ne(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,pe(i.key),i)}}function F(e,t,n){return t&&Ne(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function C(e,t,n){return t=pe(t),t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function q(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&Z(e,t)}function U(e){return U=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(n){return n.__proto__||Object.getPrototypeOf(n)},U(e)}function Z(e,t){return Z=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(i,r){return i.__proto__=r,i},Z(e,t)}function Me(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function Le(e,t){if(e==null)return{};var n={},i=Object.keys(e),r,o;for(o=0;o<i.length;o++)r=i[o],!(t.indexOf(r)>=0)&&(n[r]=e[r]);return n}function fe(e,t){if(e==null)return{};var n=Le(e,t),i,r;if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)i=o[r],!(t.indexOf(i)>=0)&&Object.prototype.propertyIsEnumerable.call(e,i)&&(n[i]=e[i])}return n}function S(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Fe(e,t){if(t&&(typeof t=="object"||typeof t=="function"))return t;if(t!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return S(e)}function D(e){var t=Me();return function(){var i=U(e),r;if(t){var o=U(this).constructor;r=Reflect.construct(i,arguments,o)}else r=i.apply(this,arguments);return Fe(this,r)}}function qe(e,t){if(typeof e!="object"||e===null)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var i=n.call(e,t||"default");if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function pe(e){var t=qe(e,"string");return typeof t=="symbol"?t:String(t)}var De={flip:{padding:20},preventOverflow:{padding:10}},Be="The typeValidator argument must be a function with the signature function(props, propName, componentName).",Ge="The error message is optional, but must be a string if provided.";function $e(e,t,n,i){return typeof e=="boolean"?e:typeof e=="function"?e(t,n,i):e?!!e:!1}function Ue(e,t){return Object.hasOwnProperty.call(e,t)}function ze(e,t,n,i){return new Error("Required ".concat(e[t]," `").concat(t,"` was not specified in `").concat(n,"`."))}function He(e,t){if(typeof e!="function")throw new TypeError(Be);if(t&&typeof t!="string")throw new TypeError(Ge)}function ae(e,t,n){return He(e,n),function(i,r,o){for(var l=arguments.length,f=new Array(l>3?l-3:0),s=3;s<l;s++)f[s-3]=arguments[s];return $e(t,i,r,o)?Ue(i,r)?e.apply(void 0,[i,r,o].concat(f)):ze(i,r,o):e.apply(void 0,[i,r,o].concat(f))}}var v={INIT:"init",IDLE:"idle",OPENING:"opening",OPEN:"open",CLOSING:"closing",ERROR:"error"},M=$.createPortal!==void 0;function k(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}function H(){return"ontouchstart"in window&&/Mobi/.test(navigator.userAgent)}function G(e){var t=e.title,n=e.data,i=e.warn,r=i===void 0?!1:i,o=e.debug,l=o===void 0?!1:o,f=r?console.warn||console.error:console.log;l&&t&&n&&(console.groupCollapsed("%creact-floater: ".concat(t),"color: #9b00ff; font-weight: bold; font-size: 12px;"),Array.isArray(n)?n.forEach(function(s){a.plainObject(s)&&s.key?f.apply(console,[s.key,s.value]):f.apply(console,[s])}):f.apply(console,[n]),console.groupEnd())}function Ve(e,t,n){var i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1;e.addEventListener(t,n,i)}function Ye(e,t,n){var i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1;e.removeEventListener(t,n,i)}function Ze(e,t,n){var i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1,r;r=function(l){n(l),Ye(e,t,r)},Ve(e,t,r,i)}function se(){}var ce=function(e){q(n,e);var t=D(n);function n(){return L(this,n),t.apply(this,arguments)}return F(n,[{key:"componentDidMount",value:function(){k()&&(this.node||this.appendNode(),M||this.renderPortal())}},{key:"componentDidUpdate",value:function(){k()&&(M||this.renderPortal())}},{key:"componentWillUnmount",value:function(){!k()||!this.node||(M||$.unmountComponentAtNode(this.node),this.node&&this.node.parentNode===document.body&&(document.body.removeChild(this.node),this.node=void 0))}},{key:"appendNode",value:function(){var r=this.props,o=r.id,l=r.zIndex;this.node||(this.node=document.createElement("div"),o&&(this.node.id=o),l&&(this.node.style.zIndex=l),document.body.appendChild(this.node))}},{key:"renderPortal",value:function(){if(!k())return null;var r=this.props,o=r.children,l=r.setRef;if(this.node||this.appendNode(),M)return $.createPortal(o,this.node);var f=$.unstable_renderSubtreeIntoContainer(this,o.length>1?m.createElement("div",null,o):o[0],this.node);return l(f),null}},{key:"renderReact16",value:function(){var r=this.props,o=r.hasChildren,l=r.placement,f=r.target;return o?this.renderPortal():f||l==="center"?this.renderPortal():null}},{key:"render",value:function(){return M?this.renderReact16():null}}]),n}(m.Component);C(ce,"propTypes",{children:u.oneOfType([u.element,u.array]),hasChildren:u.bool,id:u.oneOfType([u.string,u.number]),placement:u.string,setRef:u.func.isRequired,target:u.oneOfType([u.object,u.string]),zIndex:u.number});var de=function(e){q(n,e);var t=D(n);function n(){return L(this,n),t.apply(this,arguments)}return F(n,[{key:"parentStyle",get:function(){var r=this.props,o=r.placement,l=r.styles,f=l.arrow.length,s={pointerEvents:"none",position:"absolute",width:"100%"};return o.startsWith("top")?(s.bottom=0,s.left=0,s.right=0,s.height=f):o.startsWith("bottom")?(s.left=0,s.right=0,s.top=0,s.height=f):o.startsWith("left")?(s.right=0,s.top=0,s.bottom=0):o.startsWith("right")&&(s.left=0,s.top=0),s}},{key:"render",value:function(){var r=this.props,o=r.placement,l=r.setArrowRef,f=r.styles,s=f.arrow,c=s.color,h=s.display,p=s.length,d=s.margin,y=s.position,w=s.spread,g={display:h,position:y},P,E=w,b=p;return o.startsWith("top")?(P="0,0 ".concat(E/2,",").concat(b," ").concat(E,",0"),g.bottom=0,g.marginLeft=d,g.marginRight=d):o.startsWith("bottom")?(P="".concat(E,",").concat(b," ").concat(E/2,",0 0,").concat(b),g.top=0,g.marginLeft=d,g.marginRight=d):o.startsWith("left")?(b=w,E=p,P="0,0 ".concat(E,",").concat(b/2," 0,").concat(b),g.right=0,g.marginTop=d,g.marginBottom=d):o.startsWith("right")&&(b=w,E=p,P="".concat(E,",").concat(b," ").concat(E,",0 0,").concat(b/2),g.left=0,g.marginTop=d,g.marginBottom=d),m.createElement("div",{className:"__floater__arrow",style:this.parentStyle},m.createElement("span",{ref:l,style:g},m.createElement("svg",{width:E,height:b,version:"1.1",xmlns:"http://www.w3.org/2000/svg"},m.createElement("polygon",{points:P,fill:c}))))}}]),n}(m.Component);C(de,"propTypes",{placement:u.string.isRequired,setArrowRef:u.func.isRequired,styles:u.object.isRequired});var Je=["color","height","width"];function he(e){var t=e.handleClick,n=e.styles,i=n.color,r=n.height,o=n.width,l=fe(n,Je);return m.createElement("button",{"aria-label":"close",onClick:t,style:l,type:"button"},m.createElement("svg",{width:"".concat(o,"px"),height:"".concat(r,"px"),viewBox:"0 0 18 18",version:"1.1",xmlns:"http://www.w3.org/2000/svg",preserveAspectRatio:"xMidYMid"},m.createElement("g",null,m.createElement("path",{d:"M8.13911129,9.00268191 L0.171521827,17.0258467 C-0.0498027049,17.248715 -0.0498027049,17.6098394 0.171521827,17.8327545 C0.28204354,17.9443526 0.427188206,17.9998706 0.572051765,17.9998706 C0.71714958,17.9998706 0.862013139,17.9443526 0.972581703,17.8327545 L9.0000937,9.74924618 L17.0276057,17.8327545 C17.1384085,17.9443526 17.2832721,17.9998706 17.4281356,17.9998706 C17.5729992,17.9998706 17.718097,17.9443526 17.8286656,17.8327545 C18.0499901,17.6098862 18.0499901,17.2487618 17.8286656,17.0258467 L9.86135722,9.00268191 L17.8340066,0.973848225 C18.0553311,0.750979934 18.0553311,0.389855532 17.8340066,0.16694039 C17.6126821,-0.0556467968 17.254037,-0.0556467968 17.0329467,0.16694039 L9.00042166,8.25611765 L0.967006424,0.167268345 C0.745681892,-0.0553188426 0.387317931,-0.0553188426 0.165993399,0.167268345 C-0.0553311331,0.390136635 -0.0553311331,0.751261038 0.165993399,0.974176179 L8.13920499,9.00268191 L8.13911129,9.00268191 Z",fill:i}))))}he.propTypes={handleClick:u.func.isRequired,styles:u.object.isRequired};function ye(e){var t=e.content,n=e.footer,i=e.handleClick,r=e.open,o=e.positionWrapper,l=e.showCloseButton,f=e.title,s=e.styles,c={content:m.isValidElement(t)?t:m.createElement("div",{className:"__floater__content",style:s.content},t)};return f&&(c.title=m.isValidElement(f)?f:m.createElement("div",{className:"__floater__title",style:s.title},f)),n&&(c.footer=m.isValidElement(n)?n:m.createElement("div",{className:"__floater__footer",style:s.footer},n)),(l||o)&&!a.boolean(r)&&(c.close=m.createElement(he,{styles:s.close,handleClick:i})),m.createElement("div",{className:"__floater__container",style:s.container},c.close,c.title,c.content,c.footer)}ye.propTypes={content:u.node.isRequired,footer:u.node,handleClick:u.func.isRequired,open:u.bool,positionWrapper:u.bool.isRequired,showCloseButton:u.bool.isRequired,styles:u.object.isRequired,title:u.node};var me=function(e){q(n,e);var t=D(n);function n(){return L(this,n),t.apply(this,arguments)}return F(n,[{key:"style",get:function(){var r=this.props,o=r.disableAnimation,l=r.component,f=r.placement,s=r.hideArrow,c=r.status,h=r.styles,p=h.arrow.length,d=h.floater,y=h.floaterCentered,w=h.floaterClosing,g=h.floaterOpening,P=h.floaterWithAnimation,E=h.floaterWithComponent,b={};return s||(f.startsWith("top")?b.padding="0 0 ".concat(p,"px"):f.startsWith("bottom")?b.padding="".concat(p,"px 0 0"):f.startsWith("left")?b.padding="0 ".concat(p,"px 0 0"):f.startsWith("right")&&(b.padding="0 0 0 ".concat(p,"px"))),[v.OPENING,v.OPEN].indexOf(c)!==-1&&(b=O(O({},b),g)),c===v.CLOSING&&(b=O(O({},b),w)),c===v.OPEN&&!o&&(b=O(O({},b),P)),f==="center"&&(b=O(O({},b),y)),l&&(b=O(O({},b),E)),O(O({},d),b)}},{key:"render",value:function(){var r=this.props,o=r.component,l=r.handleClick,f=r.hideArrow,s=r.setFloaterRef,c=r.status,h={},p=["__floater"];return o?m.isValidElement(o)?h.content=m.cloneElement(o,{closeFn:l}):h.content=o({closeFn:l}):h.content=m.createElement(ye,this.props),c===v.OPEN&&p.push("__floater__open"),f||(h.arrow=m.createElement(de,this.props)),m.createElement("div",{ref:s,className:p.join(" "),style:this.style},m.createElement("div",{className:"__floater__body"},h.content,h.arrow))}}]),n}(m.Component);C(me,"propTypes",{component:u.oneOfType([u.func,u.element]),content:u.node,disableAnimation:u.bool.isRequired,footer:u.node,handleClick:u.func.isRequired,hideArrow:u.bool.isRequired,open:u.bool,placement:u.string.isRequired,positionWrapper:u.bool.isRequired,setArrowRef:u.func.isRequired,setFloaterRef:u.func.isRequired,showCloseButton:u.bool,status:u.string.isRequired,styles:u.object.isRequired,title:u.node});var ve=function(e){q(n,e);var t=D(n);function n(){return L(this,n),t.apply(this,arguments)}return F(n,[{key:"render",value:function(){var r=this.props,o=r.children,l=r.handleClick,f=r.handleMouseEnter,s=r.handleMouseLeave,c=r.setChildRef,h=r.setWrapperRef,p=r.style,d=r.styles,y;if(o)if(m.Children.count(o)===1)if(!m.isValidElement(o))y=m.createElement("span",null,o);else{var w=a.function(o.type)?"innerRef":"ref";y=m.cloneElement(m.Children.only(o),C({},w,c))}else y=o;return y?m.createElement("span",{ref:h,style:O(O({},d),p),onClick:l,onMouseEnter:f,onMouseLeave:s},y):null}}]),n}(m.Component);C(ve,"propTypes",{children:u.node,handleClick:u.func.isRequired,handleMouseEnter:u.func.isRequired,handleMouseLeave:u.func.isRequired,setChildRef:u.func.isRequired,setWrapperRef:u.func.isRequired,style:u.object,styles:u.object.isRequired});var Ke={zIndex:100};function Qe(e){var t=V(Ke,e.options||{});return{wrapper:{cursor:"help",display:"inline-flex",flexDirection:"column",zIndex:t.zIndex},wrapperPosition:{left:-1e3,position:"absolute",top:-1e3,visibility:"hidden"},floater:{display:"inline-block",filter:"drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))",maxWidth:300,opacity:0,position:"relative",transition:"opacity 0.3s",visibility:"hidden",zIndex:t.zIndex},floaterOpening:{opacity:1,visibility:"visible"},floaterWithAnimation:{opacity:1,transition:"opacity 0.3s, transform 0.2s",visibility:"visible"},floaterWithComponent:{maxWidth:"100%"},floaterClosing:{opacity:0,visibility:"visible"},floaterCentered:{left:"50%",position:"fixed",top:"50%",transform:"translate(-50%, -50%)"},container:{backgroundColor:"#fff",color:"#666",minHeight:60,minWidth:200,padding:20,position:"relative",zIndex:10},title:{borderBottom:"1px solid #555",color:"#555",fontSize:18,marginBottom:5,paddingBottom:6,paddingRight:18},content:{fontSize:15},close:{backgroundColor:"transparent",border:0,borderRadius:0,color:"#555",fontSize:0,height:15,outline:"none",padding:10,position:"absolute",right:0,top:0,width:15,WebkitAppearance:"none"},footer:{borderTop:"1px solid #ccc",fontSize:13,marginTop:10,paddingTop:5},arrow:{color:"#fff",display:"inline-flex",length:16,margin:8,position:"absolute",spread:32},options:t}}var Xe=["arrow","flip","offset"],et=["position","top","right","bottom","left"],ge=function(e){q(n,e);var t=D(n);function n(i){var r;return L(this,n),r=t.call(this,i),C(S(r),"setArrowRef",function(o){r.arrowRef=o}),C(S(r),"setChildRef",function(o){r.childRef=o}),C(S(r),"setFloaterRef",function(o){r.floaterRef=o}),C(S(r),"setWrapperRef",function(o){r.wrapperRef=o}),C(S(r),"handleTransitionEnd",function(){var o=r.state.status,l=r.props.callback;r.wrapperPopper&&r.wrapperPopper.instance.update(),r.setState({status:o===v.OPENING?v.OPEN:v.IDLE},function(){var f=r.state.status;l(f===v.OPEN?"open":"close",r.props)})}),C(S(r),"handleClick",function(){var o=r.props,l=o.event,f=o.open;if(!a.boolean(f)){var s=r.state,c=s.positionWrapper,h=s.status;(r.event==="click"||r.event==="hover"&&c)&&(G({title:"click",data:[{event:l,status:h===v.OPEN?"closing":"opening"}],debug:r.debug}),r.toggle())}}),C(S(r),"handleMouseEnter",function(){var o=r.props,l=o.event,f=o.open;if(!(a.boolean(f)||H())){var s=r.state.status;r.event==="hover"&&s===v.IDLE&&(G({title:"mouseEnter",data:[{key:"originalEvent",value:l}],debug:r.debug}),clearTimeout(r.eventDelayTimeout),r.toggle())}}),C(S(r),"handleMouseLeave",function(){var o=r.props,l=o.event,f=o.eventDelay,s=o.open;if(!(a.boolean(s)||H())){var c=r.state,h=c.status,p=c.positionWrapper;r.event==="hover"&&(G({title:"mouseLeave",data:[{key:"originalEvent",value:l}],debug:r.debug}),f?[v.OPENING,v.OPEN].indexOf(h)!==-1&&!p&&!r.eventDelayTimeout&&(r.eventDelayTimeout=setTimeout(function(){delete r.eventDelayTimeout,r.toggle()},f*1e3)):r.toggle(v.IDLE))}}),r.state={currentPlacement:i.placement,needsUpdate:!1,positionWrapper:i.wrapperOptions.position&&!!i.target,status:v.INIT,statusWrapper:v.INIT},r._isMounted=!1,r.hasMounted=!1,k()&&window.addEventListener("load",function(){r.popper&&r.popper.instance.update(),r.wrapperPopper&&r.wrapperPopper.instance.update()}),r}return F(n,[{key:"componentDidMount",value:function(){if(k()){var r=this.state.positionWrapper,o=this.props,l=o.children,f=o.open,s=o.target;this._isMounted=!0,G({title:"init",data:{hasChildren:!!l,hasTarget:!!s,isControlled:a.boolean(f),positionWrapper:r,target:this.target,floater:this.floaterRef},debug:this.debug}),this.hasMounted||(this.initPopper(),this.hasMounted=!0),!l&&s&&a.boolean(f)}}},{key:"componentDidUpdate",value:function(r,o){if(k()){var l=this.props,f=l.autoOpen,s=l.open,c=l.target,h=l.wrapperOptions,p=Ie(o,this.state),d=p.changedFrom,y=p.changed;if(r.open!==s){var w;a.boolean(s)&&(w=s?v.OPENING:v.CLOSING),this.toggle(w)}(r.wrapperOptions.position!==h.position||r.target!==c)&&this.changeWrapperPosition(this.props),y("status",v.IDLE)&&s?this.toggle(v.OPEN):d("status",v.INIT,v.IDLE)&&f&&this.toggle(v.OPEN),this.popper&&y("status",v.OPENING)&&this.popper.instance.update(),this.floaterRef&&(y("status",v.OPENING)||y("status",v.CLOSING))&&Ze(this.floaterRef,"transitionend",this.handleTransitionEnd),y("needsUpdate",!0)&&this.rebuildPopper()}}},{key:"componentWillUnmount",value:function(){k()&&(this._isMounted=!1,this.popper&&this.popper.instance.destroy(),this.wrapperPopper&&this.wrapperPopper.instance.destroy())}},{key:"initPopper",value:function(){var r=this,o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:this.target,l=this.state.positionWrapper,f=this.props,s=f.disableFlip,c=f.getPopper,h=f.hideArrow,p=f.offset,d=f.placement,y=f.wrapperOptions,w=d==="top"||d==="bottom"?"flip":["right","bottom-end","top-end","left","top-start","bottom-start"];if(d==="center")this.setState({status:v.IDLE});else if(o&&this.floaterRef){var g=this.options,P=g.arrow,E=g.flip,b=g.offset,x=fe(g,Xe);new K(o,this.floaterRef,{placement:d,modifiers:O({arrow:O({enabled:!h,element:this.arrowRef},P),flip:O({enabled:!s,behavior:w},E),offset:O({offset:"0, ".concat(p,"px")},b)},x),onCreate:function(R){var I;if(r.popper=R,!((I=r.floaterRef)!==null&&I!==void 0&&I.isConnected)){r.setState({needsUpdate:!0});return}c(R,"floater"),r._isMounted&&r.setState({currentPlacement:R.placement,status:v.IDLE}),d!==R.placement&&setTimeout(function(){R.instance.update()},1)},onUpdate:function(R){r.popper=R;var I=r.state.currentPlacement;r._isMounted&&R.placement!==I&&r.setState({currentPlacement:R.placement})}})}if(l){var B=a.undefined(y.offset)?0:y.offset;new K(this.target,this.wrapperRef,{placement:y.placement||d,modifiers:{arrow:{enabled:!1},offset:{offset:"0, ".concat(B,"px")},flip:{enabled:!1}},onCreate:function(R){r.wrapperPopper=R,r._isMounted&&r.setState({statusWrapper:v.IDLE}),c(R,"wrapper"),d!==R.placement&&setTimeout(function(){R.instance.update()},1)}})}}},{key:"rebuildPopper",value:function(){var r=this;this.floaterRefInterval=setInterval(function(){var o;(o=r.floaterRef)!==null&&o!==void 0&&o.isConnected&&(clearInterval(r.floaterRefInterval),r.setState({needsUpdate:!1}),r.initPopper())},50)}},{key:"changeWrapperPosition",value:function(r){var o=r.target,l=r.wrapperOptions;this.setState({positionWrapper:l.position&&!!o})}},{key:"toggle",value:function(r){var o=this.state.status,l=o===v.OPEN?v.CLOSING:v.OPENING;a.undefined(r)||(l=r),this.setState({status:l})}},{key:"debug",get:function(){var r=this.props.debug;return r||k()&&"ReactFloaterDebug"in window&&!!window.ReactFloaterDebug}},{key:"event",get:function(){var r=this.props,o=r.disableHoverToClick,l=r.event;return l==="hover"&&H()&&!o?"click":l}},{key:"options",get:function(){var r=this.props.options;return V(De,r||{})}},{key:"styles",get:function(){var r=this,o=this.state,l=o.status,f=o.positionWrapper,s=o.statusWrapper,c=this.props.styles,h=V(Qe(c),c);if(f){var p;[v.IDLE].indexOf(l)===-1||[v.IDLE].indexOf(s)===-1?p=h.wrapperPosition:p=this.wrapperPopper.styles,h.wrapper=O(O({},h.wrapper),p)}if(this.target){var d=window.getComputedStyle(this.target);this.wrapperStyles?h.wrapper=O(O({},h.wrapper),this.wrapperStyles):["relative","static"].indexOf(d.position)===-1&&(this.wrapperStyles={},f||(et.forEach(function(y){r.wrapperStyles[y]=d[y]}),h.wrapper=O(O({},h.wrapper),this.wrapperStyles),this.target.style.position="relative",this.target.style.top="auto",this.target.style.right="auto",this.target.style.bottom="auto",this.target.style.left="auto"))}return h}},{key:"target",get:function(){if(!k())return null;var r=this.props.target;return r?a.domElement(r)?r:document.querySelector(r):this.childRef||this.wrapperRef}},{key:"render",value:function(){var r=this.state,o=r.currentPlacement,l=r.positionWrapper,f=r.status,s=this.props,c=s.children,h=s.component,p=s.content,d=s.disableAnimation,y=s.footer,w=s.hideArrow,g=s.id,P=s.open,E=s.showCloseButton,b=s.style,x=s.target,B=s.title,W=m.createElement(ve,{handleClick:this.handleClick,handleMouseEnter:this.handleMouseEnter,handleMouseLeave:this.handleMouseLeave,setChildRef:this.setChildRef,setWrapperRef:this.setWrapperRef,style:b,styles:this.styles.wrapper},c),R={};return l?R.wrapperInPortal=W:R.wrapperAsChildren=W,m.createElement("span",null,m.createElement(ce,{hasChildren:!!c,id:g,placement:o,setRef:this.setFloaterRef,target:x,zIndex:this.styles.options.zIndex},m.createElement(me,{component:h,content:p,disableAnimation:d,footer:y,handleClick:this.handleClick,hideArrow:w||o==="center",open:P,placement:o,positionWrapper:l,setArrowRef:this.setArrowRef,setFloaterRef:this.setFloaterRef,showCloseButton:E,status:f,styles:this.styles,title:B}),R.wrapperInPortal),R.wrapperAsChildren)}}]),n}(m.Component);C(ge,"propTypes",{autoOpen:u.bool,callback:u.func,children:u.node,component:ae(u.oneOfType([u.func,u.element]),function(e){return!e.content}),content:ae(u.node,function(e){return!e.component}),debug:u.bool,disableAnimation:u.bool,disableFlip:u.bool,disableHoverToClick:u.bool,event:u.oneOf(["hover","click"]),eventDelay:u.number,footer:u.node,getPopper:u.func,hideArrow:u.bool,id:u.oneOfType([u.string,u.number]),offset:u.number,open:u.bool,options:u.object,placement:u.oneOf(["top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end","auto","center"]),showCloseButton:u.bool,style:u.object,styles:u.object,target:u.oneOfType([u.object,u.string]),title:u.node,wrapperOptions:u.shape({offset:u.number,placement:u.oneOf(["top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end","auto"]),position:u.bool})});C(ge,"defaultProps",{autoOpen:!1,callback:se,debug:!1,disableAnimation:!1,disableFlip:!1,disableHoverToClick:!1,event:"click",eventDelay:.4,getPopper:se,hideArrow:!1,offset:15,placement:"bottom",showCloseButton:!1,styles:{},target:null,wrapperOptions:{position:!1}});export{ge as R};