/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header, matching example: 'Columns (columns3)'
  const headerRow = ['Columns (columns3)'];

  // Find all direct <a> children for the three columns
  const columns = Array.from(element.querySelectorAll(':scope > a'));

  // If there are no <a> children, don't create the table (edge case handling)
  if (!columns.length) return;

  // Each <a> becomes a column in the second row. Reference existing elements.
  const contentRow = columns;

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
