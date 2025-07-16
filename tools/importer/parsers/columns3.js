/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell (one column), with the block name exactly
  const headerRow = ['Columns (columns3)'];

  // Gather all direct children (columns)
  const columns = Array.from(element.children);

  // Remove SVGs from h3s in each column (decoration only)
  columns.forEach((col) => {
    const h3 = col.querySelector('h3');
    if (h3) {
      const svg = h3.querySelector('svg');
      if (svg) svg.remove();
    }
  });

  // Table structure: header (single cell), then a row with 3 columns
  const tableData = [
    headerRow,              // header row: exactly one cell
    columns                 // content row: one cell per column
  ];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
