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
  async function getGravatar(email) {
    const encodedEmail = encodeURIComponent(email);
    return `https://gravatar.helpers.wipn.org/?email=${encodedEmail}`;
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
      let url = "https://members.helpers.wipn.org/";
      url += query ? query : "";
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }

  // src/utils/memberDirectory.ts
  function membersFilters() {
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
        const newItemsPromises = members.map(
          (member) => createMemberCard(member, itemTemplateElement)
        );
        const newItems = await Promise.all(newItemsPromises);
        listInstance.addItems(newItems);
        const filterTemplateElement = filtersInstance.form.querySelector('[data-element="filter"]');
        if (!filterTemplateElement)
          return;
        const filtersWrapper = filterTemplateElement.parentElement;
        if (!filtersWrapper)
          return;
        filterTemplateElement.remove();
      }
    ]);
  }
  async function createMemberCard(member, templateElement) {
    const newItem = templateElement.cloneNode(true);
    const firstName = newItem.querySelector('[data-element="first-name"]');
    const lastName = newItem.querySelector('[data-element="last-name"]');
    const chapter = newItem.querySelector('[data-element="chapter"]');
    const company = newItem.querySelector('[data-element="company"]');
    const location2 = newItem.querySelector('[data-element="location"]');
    const phone = newItem.querySelector('[data-element="phone"]');
    const profileImage = newItem.querySelector('[data-element="profile-image"]');
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
    if (location2) {
      if (member.location) {
        location2.textContent = member.location;
      } else {
        location2.style.display = "none";
      }
    }
    if (phone) {
      if (member.phone) {
        phone.textContent = member.phone;
      } else {
        phone.style.display = "none";
      }
    }
    if (profileImage) {
      profileImage.src = await getGravatar(member.email);
    }
    return newItem;
  }

  // src/utils/plan.ts
  function formatDate(timestamp) {
    const date = new Date(timestamp * 1e3);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
  function displayPlanDetails(member, priceSelector = '[data-element="plan-price"]', renewalSelector = '[data-element="plan-renewal"]', statusSelector = '[data-element="plan-status"]') {
    const relevantPlans = member.planConnections.filter(
      (pc) => (pc.active || pc.status === "TRIALING") && pc.payment && pc.payment.nextBillingDate
    );
    const sortedPlans = relevantPlans.sort((a, b) => {
      if (a === void 0 || b === void 0) {
        return 0;
      }
      if (a.payment !== void 0 && b.payment !== void 0) {
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
  window.membersFilters = membersFilters || [];
  var memberstack = window.$memberstackDom;
  if (!memberstack) {
    throw new Error("MemberStack is not available.");
  } else {
    memberstack.getCurrentMember().then(({ data: member }) => {
      if (member) {
        displayPlanDetails(member);
      }
      if (member && member.metaData) {
        Object.keys(member.metaData).forEach((key) => {
          const value = member.metaData[key];
          const elements = document.querySelectorAll(`[data-ms-metadata:${key}]`);
          elements.forEach((element) => {
            element.style.display = element.getAttribute(`data-ms-metadata:${key}`) === value ? "block" : "none";
          });
        });
      }
    });
  }
  window.fsAttributes = window.fsAttributes || [];
})();
//# sourceMappingURL=index.js.map
