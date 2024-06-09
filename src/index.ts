import '$utils/gravatar';
import '$utils/copyright';
import '$utils/customfields';

import { membersFilters } from '$utils/memberDirectory';
import { displayPlanDetails } from '$utils/plan';

// Attach membersFilters to the window object
declare global {
  interface Window {
    membersFilters: () => void;
  }
}

window.membersFilters = membersFilters || [];
const memberstack = window.$memberstackDom;

if (!memberstack) {
  throw new Error('MemberStack is not available.');
} else {
  /**
   * Get and replace the current plan details.
   */
  memberstack.getCurrentMember().then(({ data: member }) => {
    if (member) {
      displayPlanDetails(member);
    }

    // Get MemberStack metadata
    // if (member && member.metaData) {
    //   // For each metaData field, get the value and set the display style
    //   Object.keys(member.metaData).forEach((key) => {
    //     const value = member.metaData[key];

    //     const elements = document.querySelectorAll(`[data-ms-metadata:${key}]`);

    //     elements.forEach((element) => {
    //       element.style.display = element.getAttribute(`data-ms-metadata:${key}`) === value ? 'block' : 'none';
    //     });
    //   });
    // }
  });
}

/**
 * Populate CMS Data from an external API.
 */
window.fsAttributes = window.fsAttributes || [];

/**
 * Conditional Parameters Hiding/Showing Elements
 */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.has('action')) {
  // Get all the elements that have the `data-action` attribute
  const elements = document.querySelectorAll<HTMLElement>('[data-action]');
  // For each element with the `data-action` attribute
  elements.forEach((element) => {
    // Show the element if the action value is equal to the URL parameter
    if (element.getAttribute('data-action') === urlParams.get('action')) {
      element.style.display = 'block';
    }
    // Hide the element if the action value is not equal to the URL parameter
    else if (element.getAttribute('data-action') === `!${urlParams.get('action')}`) {
      element.style.display = 'none';
    }
  });
}
