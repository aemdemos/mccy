/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches exactly: 'Cards (cards2)'
  const rows = [['Cards (cards2)']];

  // Get all direct <a> card elements
  const cards = element.querySelectorAll(':scope > a');
  cards.forEach(card => {
    // Image: get the first <img> inside card
    let img = card.querySelector('img'); // null if not present

    // Text content: group h3 & p from card's content area
    const textContainer = card.querySelector('.flex-col.gap-3');
    let textElements = [];
    if (textContainer) {
      // Remove any <svg> from <h3> for clean heading
      const h3 = textContainer.querySelector('h3');
      if (h3) {
        const icon = h3.querySelector('svg');
        if (icon) icon.remove();
        textElements.push(h3);
      }
      const p = textContainer.querySelector('p');
      if (p) textElements.push(p);
    }
    // Always reference the actual DOM nodes, not clones
    rows.push([
      img,
      textElements.length === 1 ? textElements[0] : textElements // array for both h3+p, h3-only, or p-only
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
