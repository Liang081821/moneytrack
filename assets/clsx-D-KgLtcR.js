var n={exports:{}},f;function x(r){var o,s,t="";if(typeof r=="string"||typeof r=="number")t+=r;else if(typeof r=="object")if(Array.isArray(r)){var a=r.length;for(o=0;o<a;o++)r[o]&&(s=x(r[o]))&&(t&&(t+=" "),t+=s)}else for(s in r)r[s]&&(t&&(t+=" "),t+=s);return t}function e(){for(var r,o,s=0,t="",a=arguments.length;s<a;s++)(r=arguments[s])&&(o=x(r))&&(t&&(t+=" "),t+=o);return t}n.exports=e,f=n.exports.clsx=e;var p=n.exports;export{p as a,f as c};