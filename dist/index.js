"use strict";(()=>{async function h(e){let n=`https://gravatar.helpers.wipn.org/?email=${encodeURIComponent(e)}`;document.querySelectorAll('[data-element="gravatar"]').forEach(o=>{o.src=n})}async function p(e){return`https://gravatar.helpers.wipn.org/?email=${encodeURIComponent(e)}`}document.addEventListener("DOMContentLoaded",function(){window.$memberstackDom.getCurrentMember().then(({data:e})=>{e&&e.auth.email&&h(e.auth.email)})});function M(e='[data-element="copyright"]'){let t=new Date().getFullYear(),n=document.querySelector(e);n&&(n.textContent=t.toString())}document.addEventListener("DOMContentLoaded",function(){M()});(function(){document.addEventListener("DOMContentLoaded",function(){let e=localStorage.getItem("_ms-mem"),t=e?JSON.parse(e):{};document.querySelectorAll("[ms-code-customfield]").forEach(a=>{let o=a.getAttribute("ms-code-customfield");if(o)if(o.startsWith("!")){let c=o.slice(1);t.customFields&&t.customFields[c]&&a.parentNode?.removeChild(a)}else(!t.customFields||!t.customFields[o])&&a.parentNode?.removeChild(a)})})})();async function u(e){try{let t="https://members.helpers.wipn.org/";return t+=e||"",await(await fetch(t)).json()}catch(t){return t}}function f(){window.fsAttributes=window.fsAttributes||[],window.fsAttributes.push(["cmsfilter",async e=>{let[t]=e;if(!t)return;let{listInstance:n}=t,[a]=n.items,o=a.element,c=await u();n.clearItems();let i=c.map(s=>w(s,o)),l=await Promise.all(i);n.addItems(l);let r=t.form.querySelector('[data-element="members-filter"]');!r||!r.parentElement||r.remove()}])}async function w(e,t){let n=t.cloneNode(!0),a=n.querySelector('[data-element="first-name"]'),o=n.querySelector('[data-element="last-name"]'),c=n.querySelector('[data-element="chapter"]'),i=n.querySelector('[data-element="company"]'),l=n.querySelector('[data-element="location"]'),r=n.querySelector('[data-element="phone"]'),m=n.querySelector('[data-element="profile-image"]');return a&&(a.textContent=e.firstName),o&&(o.textContent=e.lastName),c&&(c.textContent="National Virtual",e.chapter&&(c.textContent=e.chapter)),i&&(i.style.display="none",e.company&&(i.textContent=e.company,i.style.display="block")),l&&(l.style.display="none",e.location&&(l.textContent=e.location,l.style.display="block")),r&&(r.style.display="none",e.phone&&(r.textContent=e.phone,r.style.display="block")),m&&(m.src=await p(e.email)),n}function C(e){let t=new Date(e*1e3),n={year:"numeric",month:"long",day:"numeric"};return t.toLocaleDateString("en-US",n)}function y(e,t='[data-element="plan-price"]',n='[data-element="plan-renewal"]',a='[data-element="plan-status"]'){let i=e.planConnections.filter(s=>(s.active||s.status==="TRIALING")&&s.payment&&s.payment.nextBillingDate).sort((s,d)=>s===void 0||d===void 0?0:s.payment!==void 0&&d.payment!==void 0?d.payment.nextBillingDate-s.payment.nextBillingDate:0)[0],l=document.querySelector(t),r=document.querySelector(n),m=document.querySelector(a);if(i&&i.payment){if(l&&(l.textContent=`$${i.payment.amount}`),r){let s=C(i.payment.nextBillingDate);r.textContent=s}m&&(m.textContent=i.active?"Active":"Inactive")}else l&&(l.textContent="Free"),r&&(r.textContent="N/A")}window.membersFilters=f||[];var g=window.$memberstackDom;if(g)g.getCurrentMember().then(({data:e})=>{e&&y(e)});else throw new Error("MemberStack is not available.");window.fsAttributes=window.fsAttributes||[];})();
