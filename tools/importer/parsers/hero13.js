/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name
  const headerRow = ['Hero'];

  // Find the hero background image (first <img> descendant)
  const img = element.querySelector('img');
  // If present, reference the existing image element; otherwise leave cell blank
  const imageRow = [img ? img : ''];

  // No heading, subheading, or CTA present in this HTML, so provide an empty string in the third row
  const contentRow = [''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
