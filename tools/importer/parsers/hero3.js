/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column that contains the main content (with image and text)
  let mainCol = element.querySelector('.flex.flex-col.gap-16');
  if (!mainCol) mainCol = element;

  // 1. Find the main image (first <img> in the mainCol)
  const img = mainCol.querySelector('img');

  // 2. Gather all heading, paragraphs, and section content after the image in mainCol
  const contentParts = [];
  let seenImg = false;
  for (const node of mainCol.childNodes) {
    // Skip non-element and whitespace text nodes
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (!seenImg && node.tagName === 'IMG') {
        seenImg = true;
        continue; // skip putting img in contentParts
      }
      if (seenImg) {
        // Add any element after img that is not empty
        // (This matches Hero pattern: p, section, etc.)
        if (
          node.tagName.match(/^H[1-6]$/) ||
          node.tagName === 'P' ||
          node.tagName === 'SECTION' ||
          node.tagName === 'DIV'
        ) {
          if (node.textContent.trim() !== '' || node.tagName === 'SECTION') {
            contentParts.push(node);
          }
        }
      }
    }
  }

  // Fallback: If image not found or no content after image, capture everything but the image
  if (!img || contentParts.length === 0) {
    contentParts.length = 0;
    for (const node of mainCol.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'IMG') {
        if (node.textContent.trim() !== '') {
          contentParts.push(node);
        }
      }
    }
  }

  // 3. Table per example
  const cells = [
    ['Hero'],
    [img || ''],
    [contentParts]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
