function updateCopyright(selector: string = '[data-element="copyright"]'): void {
  const currentYear: number = new Date().getFullYear();
  const copyrightDateElement: HTMLElement | null = document.querySelector(selector);

  if (copyrightDateElement) {
    copyrightDateElement.textContent = currentYear.toString();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  updateCopyright();
});
