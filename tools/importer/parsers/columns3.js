/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should have a single cell, exactly as in the example
  const headerRow = ['Columns (columns3)'];
  
  // Get all the immediate child <a> elements, each is a column
  const anchors = Array.from(element.querySelectorAll(':scope > a'));
  
  // Remove SVG arrow from each <a>'s <h3>
  anchors.forEach(a => {
    const h3 = a.querySelector('h3');
    if (h3) {
      h3.querySelectorAll('svg').forEach(svg => svg.remove());
    }
  });

  // Build table: first row is the header (one cell), second row is all columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    anchors,
  ], document);

  element.replaceWith(table);
}
