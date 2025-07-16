/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row exactly matching block name
  const headerRow = ['Cards (cards7)'];
  const rows = [];
  // Get all direct child divs (each representing a card)
  const cards = element.querySelectorAll(':scope > div');
  cards.forEach(card => {
    const link = card.querySelector('a');
    if (!link) return; // skip if missing a link
    const img = link.querySelector('img');
    const textDiv = link.querySelector('div');
    // First cell: the image element itself (reference, not clone)
    // Second cell: the text, styled as a heading (use <strong>, as per example), wrapped with a link if needed for CTA effect
    let textCell = null;
    if (textDiv && textDiv.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = textDiv.textContent.trim();
      // If the card's text should be a CTA link, wrap in <a> if link is external or target=_blank, otherwise just <strong>
      // But per example, just strong is fine
      textCell = strong;
    } else {
      // fallback: if no text, leave empty string
      textCell = '';
    }
    rows.push([img, textCell]);
  });
  // Only build table if at least 1 row (besides header)
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
