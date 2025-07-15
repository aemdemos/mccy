/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero'];

  // Extract background image URL from the section's style
  let bgImgEl = null;
  const style = element.getAttribute('style') || '';
  const bgMatch = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
  if (bgMatch && bgMatch[1]) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgMatch[1];
    bgImgEl.alt = '';
  }

  // Compose the headline and subheadline cell
  // Find the first h1 and p anywhere in the section
  const h1 = element.querySelector('h1');
  const p = element.querySelector('p');
  // Compose cell content, preserving order and using references
  const contentCell = [];
  if (h1) contentCell.push(h1);
  if (p) contentCell.push(p);
  // If both are missing, ensure the cell is not empty
  if (contentCell.length === 0) contentCell.push(document.createTextNode(''));

  // Compose the table cells as per structure
  const cells = [
    headerRow,
    [bgImgEl ? bgImgEl : ''],
    [contentCell],
  ];

  // Replace the original element with the new table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
