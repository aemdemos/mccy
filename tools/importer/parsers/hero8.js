/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main section which contains the content and image
  const mainSection = element.querySelector('.col-span-12');
  if (!mainSection) return;
  
  // 1. Find the hero image (first <img> in mainSection)
  const img = mainSection.querySelector('img');

  // 2. Find the first <h2> after the image (title for the hero)
  //    and collect all elements up to the next <h2> or end of mainSection
  let contentEls = [];
  let headingFound = false;
  if (img) {
    let node = img.parentElement.nextElementSibling;
    while (node) {
      if (node.tagName && node.tagName.match(/^H2$/i)) {
        if (!headingFound) {
          headingFound = true;
        } else {
          break; // Stop at the next H2 after the first
        }
      }
      if (headingFound) {
        contentEls.push(node);
      }
      node = node.nextElementSibling;
    }
  }
  // If we found nothing (odd edge-case), fallback: just grab all after img
  if (contentEls.length === 0 && img) {
    let node = img.parentElement.nextElementSibling;
    while (node) {
      contentEls.push(node);
      node = node.nextElementSibling;
    }
  }

  // Remove any undefined/null
  contentEls = contentEls.filter(Boolean);

  // Prepare table rows
  const headerRow = ['Hero (hero8)'];
  const imageRow = [img ? img : ''];
  const contentRow = [contentEls.length > 0 ? contentEls : ''];

  // Build table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the main hero section with the table
  mainSection.replaceWith(table);
}
