"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/gravatar.ts
  async function updateGravatarImages(email) {
    const encodedEmail = encodeURIComponent(email);
    const endpoint = `https://gravatar.helpers.wipn.org/?email=${encodedEmail}`;
    const gravatarImages = document.querySelectorAll('[data-element="gravatar"]');
    gravatarImages.forEach((image) => {
      image.src = endpoint;
    });
  }
  document.addEventListener("DOMContentLoaded", function() {
    window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
      if (member && member.auth.email) {
        updateGravatarImages(member.auth.email);
      }
    });
  });

  // src/utils/copyright.ts
  function updateCopyright(selector = '[data-element="copyright"]') {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const copyrightDateElement = document.querySelector(selector);
    if (copyrightDateElement) {
      copyrightDateElement.textContent = currentYear.toString();
    }
  }
  document.addEventListener("DOMContentLoaded", function() {
    updateCopyright();
  });

  // src/utils/customfields.ts
  (function() {
    document.addEventListener("DOMContentLoaded", function() {
      const msMemString = localStorage.getItem("_ms-mem");
      const msMem = msMemString ? JSON.parse(msMemString) : {};
      const elements = document.querySelectorAll("[ms-code-customfield]");
      elements.forEach((element) => {
        const customField = element.getAttribute("ms-code-customfield");
        if (customField) {
          if (customField.startsWith("!")) {
            const actualCustomField = customField.slice(1);
            if (msMem.customFields && msMem.customFields[actualCustomField]) {
              element.parentNode?.removeChild(element);
            }
          } else {
            if (!msMem.customFields || !msMem.customFields[customField]) {
              element.parentNode?.removeChild(element);
            }
          }
        }
      });
    });
  })();

  // src/utils/members.ts
  async function fetchMembers(query) {
    try {
      const response = await fetch(`https://members.helpers.wipn.org/${query}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }

  // src/utils/plan.ts
  function formatDate(timestamp) {
    const date = new Date(timestamp * 1e3);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
  function updatePlanDetails(member, priceSelector = '[data-element="plan-price"]', renewalSelector = '[data-element="plan-renewal"]', statusSelector = '[data-element="plan-status"]') {
    const relevantPlans = member.planConnections.filter(
      (pc) => (pc.active || pc.status === "TRIALING") && pc.payment && pc.payment.nextBillingDate
    );
    const sortedPlans = relevantPlans.sort((a, b) => {
      if (a === void 0 || b === void 0) {
        return 0;
      }
      if (a.payment !== void 0 || b.payment !== void 0) {
        return b.payment.nextBillingDate - a.payment.nextBillingDate;
      }
      return 0;
    });
    const currentPlan = sortedPlans[0];
    const priceElement = document.querySelector(priceSelector);
    const renewalElement = document.querySelector(renewalSelector);
    const statusElement = document.querySelector(statusSelector);
    if (currentPlan && currentPlan.payment) {
      if (priceElement) {
        priceElement.textContent = `$${currentPlan.payment.amount}`;
      }
      if (renewalElement) {
        const formattedDate = formatDate(currentPlan.payment.nextBillingDate);
        renewalElement.textContent = formattedDate;
      }
      if (statusElement) {
        statusElement.textContent = currentPlan.active ? "Active" : "Inactive";
      }
    } else {
      if (priceElement) {
        priceElement.textContent = "Free";
      }
      if (renewalElement) {
        renewalElement.textContent = "N/A";
      }
    }
  }

  // src/index.ts
  var memberstack = window.$memberstackDom;
  document.addEventListener("DOMContentLoaded", function() {
    memberstack.getCurrentMember().then(({ data: member }) => {
      if (member) {
        updatePlanDetails(member);
      }
    });
  });
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsfilter",
    async (filtersInstances) => {
      const [filtersInstance] = filtersInstances;
      if (!filtersInstance)
        return;
      const { listInstance } = filtersInstance;
      const [firstItem] = listInstance.items;
      const itemTemplateElement = firstItem.element;
      const members = await fetchMembers();
      listInstance.clearItems();
      const newItems = members.map((member) => createItem(member, itemTemplateElement));
      await listInstance.addItems(newItems);
      const filterTemplateElement = filtersInstance.form.querySelector('[data-element="filter"]');
      if (!filterTemplateElement)
        return;
      const filtersWrapper = filterTemplateElement.parentElement;
      if (!filtersWrapper)
        return;
      filterTemplateElement.remove();
    }
  ]);
  var createItem = (member, templateElement) => {
    const newItem = templateElement.cloneNode(true);
    const firstName = newItem.querySelector('[data-element="first-name"]');
    const lastName = newItem.querySelector('[data-element="last-name"]');
    const chapter = newItem.querySelector('[data-element="chapter"]');
    const company = newItem.querySelector('[data-element="company"]');
    if (firstName)
      firstName.textContent = member.firstName;
    if (lastName)
      lastName.textContent = member.lastName;
    if (chapter) {
      chapter.textContent = "National Virtual";
      if (member.chapter) {
        chapter.textContent = member.chapter;
      }
    }
    if (company) {
      if (member.company) {
        company.textContent = member.company;
      } else {
        company.style.display = "none";
      }
    }
    return newItem;
  };
})();
//# sourceMappingURL=index.js.map
