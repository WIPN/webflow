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
