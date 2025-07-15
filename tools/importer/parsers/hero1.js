/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column: it's the .col-span-12 (not the sidebar)
  const mainCol = element.querySelector('.col-span-12.flex.flex-col');
  if (!mainCol) return;

  // Find the first image (background image for the Hero)
  const img = mainCol.querySelector('img');

  // Find the image container to know from where to start extracting hero content
  let imageContainer = null;
  if (img) {
    imageContainer = img.closest('div');
  }

  // Gather hero textual content: everything after the image, up to the first H2 ("Policies")
  // We'll collect all siblings after the image container until we hit h2 with text 'Policies'
  const heroContent = [];
  let collecting = false;
  for (const child of mainCol.children) {
    if (child === imageContainer) {
      collecting = true;
      continue;
    }
    if (collecting) {
      if (child.tagName === 'H2' && child.textContent.trim() === 'Policies') {
        break;
      }
      heroContent.push(child);
    }
  }

  // If no content found, fallback: just use the first h2 and its next paragraph
  if (heroContent.length === 0) {
    const h2 = mainCol.querySelector('h2');
    if (h2) heroContent.push(h2);
    if (h2 && h2.nextElementSibling && h2.nextElementSibling.tagName === 'P') {
      heroContent.push(h2.nextElementSibling);
    }
  }

  // Table structure as per example: 1 column, 3 rows (header, image, text)
  const cells = [
    ['Hero (hero1)'],
    [img ? img : ''],
    [heroContent.length > 0 ? heroContent : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
