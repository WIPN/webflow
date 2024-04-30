/**
 * This file contains utility functions for working with Gravatar images.
 * It uses the Gravatar Helpers API to generate Gravatar images based on email addresses.
 * The API is available at https://gravatar.helpers.wipn.org/.
 */
export async function updateGravatarImages(email: string) {
  const encodedEmail = encodeURIComponent(email);
  const endpoint = `https://gravatar.helpers.wipn.org/?email=${encodedEmail}`;

  // Select all elements with the `data-element="gravatar"` attribute
  const gravatarImages: NodeListOf<HTMLImageElement> = document.querySelectorAll(
    '[data-element="gravatar"]'
  );

  // Iterate over the NodeList and update each image source
  gravatarImages.forEach((image) => {
    image.src = endpoint;
  });
}

/**
 * Get a Gravatar image URL based on an email address.
 * @param email The email address to generate a Gravatar image for.
 * @returns The URL of the Gravatar image.
 */
export async function getGravatar(email: string) {
  const encodedEmail = encodeURIComponent(email);
  return `https://gravatar.helpers.wipn.org/?email=${encodedEmail}`;
}

// Update Gravatar images when the DOM content has loaded.
document.addEventListener('DOMContentLoaded', function () {
  // Example usage with MemberStack
  window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
    if (member && member.auth.email) {
      updateGravatarImages(member.auth.email);
    }
  });
});
