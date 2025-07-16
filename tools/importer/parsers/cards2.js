/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards2)'];
  // Gather all direct child card anchors
  const cardEls = Array.from(element.querySelectorAll(':scope > a'));
  const rows = [headerRow];

  cardEls.forEach(card => {
    // Image: always in the first child div > img
    let img = null;
    const imgDiv = card.querySelector(':scope > div');
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }

    // Text content: h3 (with svg removed), plus first p below it
    const textDiv = card.querySelector(':scope > div.flex.flex-col.gap-3');
    const cellContent = [];
    if (textDiv) {
      // Heading
      const heading = textDiv.querySelector('h3');
      if (heading) {
        // Remove SVG arrow if present
        const svg = heading.querySelector('svg');
        if (svg) svg.remove();
        cellContent.push(heading);
      }
      // Description
      const desc = textDiv.querySelector('p');
      if (desc) cellContent.push(desc);
    }

    rows.push([
      img,
      cellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
