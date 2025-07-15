/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified by block name
  const headerRow = ['Cards (cards2)'];
  const rows = [];

  // Each card is a direct child <a> of the grid
  const cards = element.querySelectorAll(':scope > a');
  cards.forEach(card => {
    // Find the card image: the first <img> inside the card
    let image = null;
    const img = card.querySelector('img');
    if (img) image = img;

    // Card text: the div containing h3 (title) and p (desc)
    // Usually the second div in each card
    let textDiv = null;
    const divs = card.querySelectorAll(':scope > div');
    if (divs.length > 1) {
      textDiv = divs[1];
    } else if (divs.length === 1) {
      textDiv = divs[0];
    }

    // Clean up: remove any SVGs (arrow icons) inside h3
    if (textDiv) {
      const h3 = textDiv.querySelector('h3');
      if (h3) {
        h3.querySelectorAll('svg').forEach(svg => svg.remove());
      }
    }

    // Compose cell contents: h3 and p, only if they exist
    const cellContent = [];
    if (textDiv) {
      const h3 = textDiv.querySelector('h3');
      const p = textDiv.querySelector('p');
      if (h3) cellContent.push(h3);
      if (p) cellContent.push(p);
    }

    // Table row: [image, text cell]
    rows.push([
      image,
      cellContent
    ]);
  });

  // Build the table: header, then a row per card
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the element with the new block table
  element.replaceWith(table);
}
