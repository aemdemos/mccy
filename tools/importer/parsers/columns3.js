/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell with block name and variant
  const headerRow = ['Columns (columns3)'];

  // Get all direct column elements (each <a>)
  const columns = Array.from(element.querySelectorAll(':scope > a'));
  // Defensive: if no columns, do not replace
  if (columns.length === 0) return;

  // Content row: array of <a> elements
  const contentRow = columns;

  // Table structure: header row (1 col), content row (n cols)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
