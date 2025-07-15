/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as required
  const headerRow = ['Cards (cards2)'];

  // Get card <a> elements (each is a card)
  const cards = Array.from(element.querySelectorAll(':scope > a'));

  // Map each card to a row: [img, [title, description]]
  const rows = cards.map(card => {
    // Image: <img> inside first div
    const imgDiv = card.querySelector(':scope > div');
    const img = imgDiv ? imgDiv.querySelector('img') : null;

    // Text content: inside second div
    const textDivs = card.querySelectorAll(':scope > div');
    const textDiv = textDivs.length > 1 ? textDivs[1] : null;

    // Defensive: if no content, keep cell empty
    let textCellContent = [];
    if (textDiv) {
      // Title (h3) - remove SVG if present
      const h3 = textDiv.querySelector('h3');
      if (h3) {
        const svg = h3.querySelector('svg');
        if (svg) svg.remove();
        textCellContent.push(h3);
      }
      // Description (p)
      const p = textDiv.querySelector('p');
      if (p) textCellContent.push(p);
    }
    return [img, textCellContent];
  });

  // Compose the table
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
