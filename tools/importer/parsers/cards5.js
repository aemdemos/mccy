/* global WebImporter */
export default function parse(element, { document }) {
  // Find the card grid container
  const cardsContainer = element.querySelector('.component-content');
  if (!cardsContainer) return;
  // Find all card anchor elements
  const cards = Array.from(cardsContainer.children).filter(el => el.tagName.toLowerCase() === 'a');

  // Prepare the table rows
  const rows = [['Cards (cards5)']];

  cards.forEach(card => {
    // First cell: The image (use the whole image div for resilience)
    let imgDiv = card.querySelector('div > img')?.parentElement;
    if (!imgDiv) {
      // fallback: find first img
      const img = card.querySelector('img');
      imgDiv = img ? img : '';
    }

    // Second cell: Text content (title)
    const textDiv = card.querySelector('div:last-of-type');
    let textContent = [];
    if (textDiv) {
      // Only a title <p>, so use that. Wrap in a link if card has href.
      const p = textDiv.querySelector('p');
      if (p) {
        // Use the existing <p> (don't clone)
        if (card.href) {
          const link = document.createElement('a');
          link.href = card.href;
          // Move the <p> into the link (not clone), but we must keep it in the DOM for this row only
          link.appendChild(p);
          textContent = [link];
        } else {
          textContent = [p];
        }
      }
    }
    rows.push([imgDiv, textContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
