/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with exact block name as required
  const headerRow = ['Cards (cards2)'];

  // Select all direct card <a> children
  const cards = Array.from(element.querySelectorAll(':scope > a'));
  const rows = cards.map(card => {
    // First cell: only the <img> element
    const img = card.querySelector('img');
    // Second cell: text stack (h3 + p, if present)
    const h3 = card.querySelector('h3');
    const p = card.querySelector('p');
    // Remove SVG arrow from h3 if present, so heading text is clean
    if (h3) {
      const svg = h3.querySelector('svg');
      if (svg) svg.remove();
    }
    // Only add elements that are present
    const textCell = [];
    if (h3) textCell.push(h3);
    if (p) textCell.push(p);
    // If both missing, cell will be empty
    return [img, textCell.length ? textCell : ''];
  });
  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
