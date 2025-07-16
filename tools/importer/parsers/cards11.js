/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the example
  const cells = [['Cards (cards11)']];

  // Select all cards
  const cardWrappers = element.querySelectorAll(':scope .card-wrapper');

  cardWrappers.forEach((cardWrapper) => {
    const card = cardWrapper.querySelector('.tile-card');
    if (!card) return;

    // Image: take the <img> directly
    const imgDiv = card.querySelector('.tile-card-image');
    let img = imgDiv ? imgDiv.querySelector('img') : null;

    // Title (should be strong, not a heading)
    const details = card.querySelector('.tile-card-details');
    let title = details ? details.querySelector('.tile-card-title') : null;
    const desc = details ? details.querySelector('p') : null;

    // Call-to-action (optional)
    const ctaLink = card.querySelector('a.card-readmore');
    let cta = null;
    if (ctaLink) {
      cta = document.createElement('a');
      cta.href = ctaLink.href;
      cta.textContent = ctaLink.textContent.trim();
      if (ctaLink.hasAttribute('target')) {
        cta.setAttribute('target', ctaLink.getAttribute('target'));
      }
    }

    // Compose the text cell: strong for title, then desc, then CTA (br separated)
    const textCell = [];
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.push(strong);
    }
    if (desc) {
      if (textCell.length) textCell.push(document.createElement('br'));
      textCell.push(desc);
    }
    if (cta) {
      if (textCell.length) textCell.push(document.createElement('br'));
      textCell.push(cta);
    }

    cells.push([
      img || '',
      textCell.length === 1 ? textCell[0] : textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
