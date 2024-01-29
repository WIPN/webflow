"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/chapter.ts
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsload",
    async (listInstances) => {
      const [listInstance] = listInstances;
      const [firstItem] = listInstance.items;
      const itemTemplateElement = firstItem.element;
      const members = await fetchMembers();
      listInstance.clearItems();
      const newItems = members.map((member) => createItem(member, itemTemplateElement));
      await listInstance.addItems(newItems);
    }
  ]);
  var fetchMembers = async () => {
    try {
      const chapterTitleElement = document.querySelector('[data-element="chapter-title"]');
      const chapterTitle = chapterTitleElement ? chapterTitleElement.textContent : "";
      const query = chapterTitle ? `?chapter=${encodeURIComponent(chapterTitle)}` : "";
      const response = await fetch(`https://members.helpers.wipn.org/${query}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  };
  var createItem = (member, templateElement) => {
    const newItem = templateElement.cloneNode(true);
    const image = newItem.querySelector('[data-element="profile-image"]');
    const firstName = newItem.querySelector('[data-element="first-name"]');
    const lastName = newItem.querySelector('[data-element="last-name"]');
    const chapter = newItem.querySelector('[data-element="chapter"]');
    const company = newItem.querySelector('[data-element="company"]');
    if (image)
      image.src = member.profileImage;
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
//# sourceMappingURL=chapter.js.map
