/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match exactly
  const headerRow = ['Cards (cards2)'];
  // Select all immediate card links
  const cardLinks = element.querySelectorAll(':scope > a');
  const rows = [];
  for (const card of cardLinks) {
    // First cell: image (wrapped in a div)
    const imageDiv = card.querySelector(':scope > div');
    // Second cell: text content (title and description)
    const textDiv = card.querySelector(':scope > div.flex-col');
    // Defensive: fallback in case selectors do not match
    rows.push([
      imageDiv || '',
      textDiv || ''
    ]);
  }
  const tableCells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
