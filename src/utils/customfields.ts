// Define an interface for the structure of Memberstack data
interface MemberstackData {
  customFields?: { [key: string]: string | undefined };
}

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Get the `_ms-mem` object from the local storage
    const msMemString = localStorage.getItem('_ms-mem');
    const msMem: MemberstackData = msMemString ? JSON.parse(msMemString) : {};

    // Get all the elements that have the `ms-code-customfield` attribute
    const elements = document.querySelectorAll<HTMLElement>('[ms-code-customfield]');

    // Iterate over each element
    elements.forEach((element) => {
      // Get the value of the `ms-code-customfield` attribute
      const customField = element.getAttribute('ms-code-customfield');

      if (customField) {
        // If customField starts with '!', we invert the logic
        if (customField.startsWith('!')) {
          const actualCustomField = customField.slice(1); // remove the '!' from the start

          // If the custom field is empty, remove the element from the DOM
          if (msMem.customFields && msMem.customFields[actualCustomField]) {
            element.parentNode?.removeChild(element);
          }
        } else {
          // Check if the user has the corresponding custom field in Memberstack
          if (!msMem.customFields || !msMem.customFields[customField]) {
            // If the custom field is empty, remove the element from the DOM
            element.parentNode?.removeChild(element);
          }
        }
      }
    });
  });
})();
