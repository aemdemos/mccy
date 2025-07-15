/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'Our initiatives' section by its h2
  let cardsSection = null;
  const sections = element.querySelectorAll('section');
  for (const sec of sections) {
    const h2 = sec.querySelector('h2');
    if (h2 && h2.textContent.trim().toLowerCase() === 'our initiatives') {
      cardsSection = sec;
      break;
    }
  }
  if (!cardsSection) return;

  // The cards are direct children <a> of the grid
  const grid = cardsSection.querySelector('div.grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll(':scope > a'));

  // Table header row
  const rows = [
    ['Cards (cards5)']
  ];

  // For each card, extract image and text content (reference existing elements)
  cards.forEach(card => {
    // Image is the first div > img
    const imgDiv = card.querySelector('div');
    let img = null;
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }
    // Text: the next div (with flex-col)
    const textDiv = card.querySelector('div.flex-col');
    let textContent = [];
    if (textDiv) {
      // Title: h3, Description: p (preserve order)
      const h3 = textDiv.querySelector('h3');
      const p = textDiv.querySelector('p');
      if (h3) textContent.push(h3);
      if (p) textContent.push(p);
    }
    // Add [image, text] row
    rows.push([img, textContent]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the section with the new table
  cardsSection.replaceWith(table);
}
