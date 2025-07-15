/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1st row: Block header ---
  const headerRow = ['Hero'];

  // --- 2nd row: Background image (optional) ---
  // Extract from style background-image property
  let imageEl = '';
  const style = element.getAttribute('style') || '';
  const imgMatch = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
  if (imgMatch && imgMatch[1]) {
    imageEl = document.createElement('img');
    imageEl.src = imgMatch[1];
    imageEl.alt = '';
  }

  // --- 3rd row: Content (title, subheading, CTA) ---
  // Try to reference the most precise element containing the heading & content
  // Prioritize the .component-content column, then fallback to h1/p
  let contentCellNodes = [];
  const componentContent = element.querySelector('.component-content');
  if (componentContent) {
    // Find the main text column (usually the first child div with flex-col)
    const textCol = componentContent.querySelector('div.flex-col');
    if (textCol) {
      // Add all its children (e.g. headings, paragraphs)
      contentCellNodes = Array.from(textCol.children).filter(e => e.textContent.trim() !== '');
    } else {
      // fallback: use everything inside .component-content
      contentCellNodes = [componentContent];
    }
  } else {
    // fallback: just h1 and p
    const h1 = element.querySelector('h1');
    const p = element.querySelector('p');
    if (h1) contentCellNodes.push(h1);
    if (p) contentCellNodes.push(p);
  }

  // Prepare the table for the Hero block
  const cells = [
    headerRow,
    [imageEl || ''],
    [contentCellNodes.length ? contentCellNodes : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
