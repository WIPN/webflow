import type { CMSFilters } from '$types/CMSFilters';
import type { Member } from '$types/Member';
import { getGravatar } from '$utils/gravatar';
import { fetchMembers } from '$utils/members';

/**
 * Function to initialize CMS filtering.
 */
export function membersFilters() {
  window.fsAttributes = window.fsAttributes || [];

  window.fsAttributes.push([
    'cmsfilter',
    async (filtersInstances: CMSFilters[]) => {
      // Get the filters instance
      const [filtersInstance] = filtersInstances;
      if (!filtersInstance) return;

      // Get the list instance
      const { listInstance } = filtersInstance;

      // Save a copy of the template
      const [firstItem] = listInstance.items;
      const itemTemplateElement = firstItem.element;

      // Fetch external data
      const members = await fetchMembers();

      // Remove existing items
      listInstance.clearItems();

      // Create the new items
      const newItemsPromises = members.map((member: Member) =>
        createMemberCard(member, itemTemplateElement)
      );
      const newItems = await Promise.all(newItemsPromises);

      // Populate the list
      listInstance.addItems(newItems);

      // Get the template filter
      const filterTemplateElement =
        filtersInstance.form.querySelector<HTMLLabelElement>('[data-element="filter"]');
      if (!filterTemplateElement) return;

      // Get the parent wrapper
      const filtersWrapper = filterTemplateElement.parentElement;
      if (!filtersWrapper) return;

      // Remove the template from the DOM
      filterTemplateElement.remove();

      // Sync the CMSFilters instance with the new created filters
      // filtersInstance.storeFiltersData();
    },
  ]);
}

async function createMemberCard(member: Member, templateElement: HTMLDivElement) {
  // Clone the template element
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;

  // Query inner elements
  const firstName = newItem.querySelector<HTMLSpanElement>('[data-element="first-name"]');
  const lastName = newItem.querySelector<HTMLSpanElement>('[data-element="last-name"]');
  const chapter = newItem.querySelector<HTMLParagraphElement>('[data-element="chapter"]');
  const company = newItem.querySelector<HTMLParagraphElement>('[data-element="company"]');
  const location = newItem.querySelector<HTMLParagraphElement>('[data-element="location"]');
  const phone = newItem.querySelector<HTMLParagraphElement>('[data-element="phone"]');
  const profileImage = newItem.querySelector<HTMLImageElement>('[data-element="profile-image"]');

  // Populate inner elements

  // If the member has a first and last name, populate the elements
  if (firstName) firstName.textContent = member.firstName;
  if (lastName) lastName.textContent = member.lastName;

  // If the member somehow doesn't have a chapter, default to 'National Virtual'
  if (chapter) {
    chapter.textContent = 'National Virtual';
    if (member.chapter) {
      chapter.textContent = member.chapter;
    }
  }

  // If the member has a publicly visible company, populate the element, otherwise hide it
  if (company) {
    if (member.company) {
      company.textContent = member.company;
    } else {
      company.style.display = 'none';
    }
  }

  // If the member has a publicly visible location, populate the element, otherwise hide it
  if (location) {
    if (member.location) {
      location.textContent = member.location;
    } else {
      location.style.display = 'none';
    }
  }

  // If the member has a publicly visible phone number, populate the element, otherwise hide it
  if (phone) {
    if (member.phone) {
      phone.textContent = member.phone;
    } else {
      phone.style.display = 'none';
    }
  }

  // Get the Gravatar image
  if (profileImage) {
    profileImage.src = await getGravatar(member.email);
  }

  return newItem;
}
