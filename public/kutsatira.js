!function(){"use strict";!function(t){var e=t.screen,n=e.width,r=e.height,a=t.navigator.language,i=t.location,o=t.localStorage,c=t.document,u=t.history,s=i.hostname,f=i.pathname,l=i.search,v=c.currentScript;if(v){var d,p=function(t,e){return Object.keys(e).forEach((function(n){void 0!==e[n]&&(t[n]=e[n])})),t},h=function(t,e,n){var r=t[e];return function(){for(var e=[],a=arguments.length;a--;)e[a]=arguments[a];return n.apply(null,e),r.apply(t,e)}},m=function(){return o&&o.getItem("umami.disabled")||E&&function(){var e=t.doNotTrack,n=t.navigator,r=t.external,a="msTrackingProtectionEnabled",i=e||n.doNotTrack||n.msDoNotTrack||r&&a in r&&r[a]();return"1"==i||"yes"===i}()||A&&!N.includes(s)},g="data-",y="false",b=v.getAttribute.bind(v),k=b(g+"website-id"),w=b(g+"host-url"),S=b(g+"auto-track")!==y,E=b(g+"do-not-track"),T=b(g+"css-events")!==y,A=b(g+"domains")||"",N=A.split(",").map((function(t){return t.trim()})),j=(w?w.replace(/\/$/,""):v.src.split("/").slice(0,-1).join("/"))+"/api/collect",x=n+"x"+r,O=/^umami--([a-z]+)--([\w]+[\w-]*)$/,K="[class*='umami--']",L={},_=""+f+l,D=c.referrer,P=function(){return{website:k,hostname:s,screen:x,language:a,url:_}},$=function(t,e){var n;if(!m())return fetch(j,{method:"POST",body:JSON.stringify({type:t,payload:e}),headers:p({"Content-Type":"application/json"},(n={},n["x-umami-cache"]=d,n))}).then((function(t){return t.text()})).then((function(t){return d=t}))},q=function(t,e,n,r){return void 0===t&&(t=_),void 0===n&&(n=D),void 0===r&&(r=k),$("pageview",p(P(),{website:r,url:t,from:e,referrer:n}))},z=function(t,e,n,r,a){return void 0===r&&(r=_),void 0===a&&(a=k),$("event",p(P(),{website:a,url:r,event_name:t,event_data:n,event_type:e}))},C=function(t){var e=t.querySelectorAll(K);Array.prototype.forEach.call(e,I)},I=function(t){var e=t.getAttribute.bind(t);(e("class")||"").split(" ").forEach((function(n){if(O.test(n)){var r=n.split("--"),a=r[1],o=r[2],c=L[n]?L[n]:L[n]=function(n){"click"!==a||"A"!==t.tagName||n.ctrlKey||n.shiftKey||n.metaKey||n.button&&1===n.button||e("target")?z(o):(n.preventDefault(),z(o).then((function(){var t=e("href");t&&(i.href=t)})))};t.addEventListener(a,c,!0)}}))},J=function(t,e,n){if(n){D=_;var r=n.toString();(_="http"===r.substring(0,4)?"/"+r.split("/").splice(3).join("/"):r)!==D&&q()}};if(!t.kutsatira){var M=function(t){return z(t)};M.trackView=q,M.trackEvent=z,t.kutsatira=M}if(S&&!m()){u.pushState=h(u,"pushState",J),u.replaceState=h(u,"replaceState",J);var V=function(){"complete"===c.readyState&&(q(),T&&(C(c),new MutationObserver((function(t){t.forEach((function(t){var e=t.target;I(e),C(e)}))})).observe(c,{childList:!0,subtree:!0})))};c.addEventListener("readystatechange",V,!0),V()}}}(window)}();
