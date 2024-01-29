export async function updateGravatarImages(email: string) {
  const encodedEmail = encodeURIComponent(email);
  const endpoint = `https://gravatar.helpers.wipn.org/?email=${encodedEmail}`;

  // Select all elements with the `data-element="gravatar"` attribute
  const gravatarImages = document.querySelectorAll('[data-element="gravatar"]');

  // Iterate over the NodeList and update each image source
  gravatarImages.forEach((image) => {
    image.src = endpoint;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Example usage with MemberStack
  window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
    if (member && member.auth.email) {
      updateGravatarImages(member.auth.email);
    }
  });
});
