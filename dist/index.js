"use strict";(()=>{window.fsAttributes=window.fsAttributes||[];window.fsAttributes.push(["cmsfilter",async e=>{let[r]=e,{listInstance:t}=r,[o]=t.items,l=o.element,a=await i();console.log(a),t.clearItems();let s=a.map(c=>m(c,l));await t.addItems(s);let n=r.form.querySelector('[data-element="filter"]');if(!n||!n.parentElement)return;n.remove();let f=collectCategories(a)}]);var i=async()=>{try{return await(await fetch("https://members.helpers.wipn.org/")).json()}catch{return[]}},m=(e,r)=>{let t=r.cloneNode(!0),o=t.querySelector('[data-element="profile-image"]'),l=t.querySelector('[data-element="first-name"]'),a=t.querySelector('[data-element="last-name"]'),s=t.querySelector('[data-element="chapter"]'),n=t.querySelector('[data-element="company"]');return o&&(o.src=e.profileImage),l&&(l.textContent=e.firstName),a&&(a.textContent=e.lastName),s&&(s.textContent="National Virtual",e.chapter&&(s.textContent=e.chapter)),n&&(e.company?n.textContent=e.company:n.style.display="none"),t};})();