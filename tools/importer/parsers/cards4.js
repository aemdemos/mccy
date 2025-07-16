/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header, per spec, must match example exactly:
  const cells = [['Cards (cards4)']];

  // 2. Select all park card elements
  const cardContainer = element.querySelector('.park-cards-slider');
  if (!cardContainer) return;
  const cards = cardContainer.querySelectorAll('.park-card');

  cards.forEach(card => {
    // --- IMAGE CELL ---
    // Use the direct anchor containing the image and clips
    const imageCell = card.querySelector('.park-card-img');

    // --- CONTENT CELL ---
    const contentDiv = card.querySelector('.park-card-content .park-card-detail');
    const contentCell = document.createElement('div');
    if (contentDiv) {
      // Title as <strong> (left as-is if already strong, otherwise wrap)
      const titleLink = contentDiv.querySelector('.park-card-title');
      if (titleLink) {
        const titleStrong = document.createElement('strong');
        titleStrong.textContent = titleLink.textContent.trim();
        contentCell.appendChild(titleStrong);
      }

      // All <p> tags except 'Top activities:'
      const ps = Array.from(contentDiv.querySelectorAll('p'));
      ps.forEach((p) => {
        const txt = p.textContent.trim();
        if (/^Top activities:/i.test(txt)) return;
        // Space between blocks for legibility
        if (contentCell.childNodes.length) contentCell.appendChild(document.createElement('br'));
        contentCell.appendChild(p);
      });

      // Activities icons and labels
      const activities = contentDiv.querySelector('.park-card-activities');
      if (activities) {
        // Group all activity <a> into an inline block
        const actsDiv = document.createElement('div');
        Array.from(activities.children).forEach(a => {
          actsDiv.appendChild(a);
        });
        contentCell.appendChild(actsDiv);
      }
    }

    // Push row: image cell, then content cell
    cells.push([
      imageCell,
      contentCell
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
