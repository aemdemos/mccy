/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must match exactly as in the example
  const headerRow = ['Columns (columns3)'];
  // Find all immediate column elements (should be <a> elements)
  const columnEls = Array.from(element.children);

  // Edge case: if no columns, safely handle
  if (columnEls.length === 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ['']
    ], document);
    element.replaceWith(table);
    return;
  }

  // For each column, grab the inner block (div) or fall back to <a>
  const columns = columnEls.map((col) => {
    // Usually structure: <a> <div> ... </div> </a>
    const content = col.querySelector(':scope > div');
    // If for some reason not found, fall back to the whole column element
    return content || col;
  });

  // Build the main block table with header and one row of columns
  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(table);
}
