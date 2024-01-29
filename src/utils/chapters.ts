import type { CMSList } from '../../types/CMSList';
import type { Member } from '../../types/Member';

/**
 * Populate CMS Data from an external API.
 */
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  async (listInstances: CMSList[]) => {
    // Get the list instance
    const [listInstance] = listInstances;

    // Save a copy of the template
    const [firstItem] = listInstance.items;
    const itemTemplateElement = firstItem.element;

    // Fetch external data
    const members = await fetchMembers();

    // Remove existing items
    listInstance.clearItems();

    // Create the new items
    const newItems = members.map((member: Member) => createItem(member, itemTemplateElement));

    // Populate the list
    await listInstance.addItems(newItems);
  },
]);

/**
 * Fetches members from MemberStack (using Cloudflare Worker Proxy)
 * @returns An array of {@link Member}.
 */
const fetchMembers = async () => {
  try {
    // Retrieve the content of the element with `data-element="chapter-title"`
    const chapterTitleElement = document.querySelector('[data-element="chapter-title"]');
    const chapterTitle = chapterTitleElement ? chapterTitleElement.textContent : '';

    const query = chapterTitle ? `?chapter=${encodeURIComponent(chapterTitle)}` : '';
    const response = await fetch(`https://members.helpers.wipn.org/${query}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

/**
 * Creates an item from the template element.
 * @param member The member data to create the item from.
 * @param templateElement The template element.
 *
 * @returns A new Collection Item element.
 */
const createItem = (member: Member, templateElement: HTMLDivElement) => {
  // Clone the template element
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;

  // Query inner elements
  const image = newItem.querySelector<HTMLImageElement>('[data-element="profile-image"]');
  const firstName = newItem.querySelector<HTMLSpanElement>('[data-element="first-name"]');
  const lastName = newItem.querySelector<HTMLSpanElement>('[data-element="last-name"]');
  const chapter = newItem.querySelector<HTMLParagraphElement>('[data-element="chapter"]');
  const company = newItem.querySelector<HTMLParagraphElement>('[data-element="company"]');

  // Populate inner elements
  if (image) image.src = member.profileImage;
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
