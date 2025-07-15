/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Initiatives section
  const initiativesSection = element.querySelector('section#f925c0a8308833c7b693d9059865527e');
  if (!initiativesSection) return;
  const headerRow = ['Cards (cards7)'];

  // Find grid of cards
  const grid = initiativesSection.querySelector('div.grid');
  if (!grid) return;

  // Each card is an <a> inside the grid
  const cards = Array.from(grid.querySelectorAll('a'));
  const rows = [headerRow];
  cards.forEach(card => {
    // No image or icon in these cards
    // Title is in h3, remove svg
    const h3 = card.querySelector('h3');
    if (h3) {
      h3.querySelectorAll('svg').forEach(svg => svg.remove());
    }
    // We reference the h3 as title (preserve heading markup)
    // The card is just a title (no description, no separate CTA)
    rows.push(['', h3]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  initiativesSection.replaceWith(table);
}
