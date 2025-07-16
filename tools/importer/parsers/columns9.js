/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get the immediate column containers (they have col-lg-*)
  const columns = Array.from(row.children).filter(child => child.matches('[class*=col-lg-]'));

  // For each column, reference their inner content block for the cell.
  // Use the first <div> within the column if present and it has children, else the column itself.
  const colCells = columns.map(col => {
    // Find the first inner <div> that actually contains content
    let contentBlock = null;
    const innerDivs = Array.from(col.children).filter(child => child.tagName === 'DIV' && child.childElementCount > 0);
    if (innerDivs.length > 0) {
      contentBlock = innerDivs[0];
    } else {
      contentBlock = col;
    }
    return contentBlock;
  });

  // Only create the table if we have columns with content
  if (colCells.length > 0) {
    const cells = [
      ['Columns (columns9)'],
      colCells
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
