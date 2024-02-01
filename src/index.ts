import '$utils/gravatar';
import '$utils/copyright';
import '$utils/customfields';

import { fetchMembers } from '$utils/members';
import { updatePlanDetails } from '$utils/plan';

import type { CMSFilters } from '../types/CMSFilters';
import type { Member } from '../types/Member';

const memberstack = window.$memberstackDom;
/**
 * Get and replace the current plan details.
 */
document.addEventListener('DOMContentLoaded', function () {
  memberstack.getCurrentMember().then(({ data: member }) => {
    if (member) {
      updatePlanDetails(member);
    }
  });
});

/**
 * Populate CMS Data from an external API.
 */
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
    const newItems = members.map((member) => createMemberCard(member, itemTemplateElement));

    // Populate the list
    await listInstance.addItems(newItems);

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

/**
 * Creates an item from the template element.
 * @param member The member data to create the item from.
 * @param templateElement The template element.
 *
 * @returns A new Collection Item element.
 */
const createMemberCard = (member: Member, templateElement: HTMLDivElement) => {
  // Clone the template element
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;

  // Query inner elements
  const firstName = newItem.querySelector<HTMLSpanElement>('[data-element="first-name"]');
  const lastName = newItem.querySelector<HTMLSpanElement>('[data-element="last-name"]');
  const chapter = newItem.querySelector<HTMLParagraphElement>('[data-element="chapter"]');
  const company = newItem.querySelector<HTMLParagraphElement>('[data-element="company"]');

  // Populate inner elements
  if (firstName) firstName.textContent = member.firstName;
  if (lastName) lastName.textContent = member.lastName;
  if (chapter) {
    chapter.textContent = 'National Virtual';
    if (member.chapter) {
      chapter.textContent = member.chapter;
    }
  }
  if (company) {
    if (member.company) {
      company.textContent = member.company;
    } else {
      company.style.display = 'none';
    }
  }

  return newItem;
};
