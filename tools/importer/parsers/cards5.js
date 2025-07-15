/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main content column which contains the relevant initiatives section
  const mainColumn = element.querySelector('.flex.flex-col.gap-16');
  if (!mainColumn) return;

  // Find the 'Our initiatives' section (cards5 block)
  const ourInitiativesSection = mainColumn.querySelector('section');
  if (!ourInitiativesSection) return;

  // Find the cards grid inside the section
  const cardsGrid = ourInitiativesSection.querySelector('div.grid');
  if (!cardsGrid) return;

  // Gather all card links (immediate children)
  const cardLinks = Array.from(cardsGrid.querySelectorAll(':scope > a'));

  // Header row as specified in instructions and example
  const headerRow = ['Cards (cards5)'];

  // Build each card row
  const cardRows = cardLinks.map(card => {
    // Image: inside a "div.w-full" in the card
    const imgContainer = card.querySelector('div.w-full');
    const img = imgContainer ? imgContainer.querySelector('img') : null;

    // Title and description: inside card's text container
    const textContainer = card.querySelector('div.flex.flex-col');
    let cardTitle = null;
    let cardDesc = null;
    if (textContainer) {
      // Build card title as: use heading element (h3), but remove arrow SVG if present
      cardTitle = textContainer.querySelector('h3');
      if (cardTitle && cardTitle.querySelector('svg')) {
        cardTitle = cardTitle.cloneNode(true);
        const svg = cardTitle.querySelector('svg');
        if (svg) svg.remove();
      }
      // Description: paragraph
      cardDesc = textContainer.querySelector('p');
    }
    // Compose cell 2 as [title, description] (do not clone or create new elements)
    const cell2 = [];
    if (cardTitle) cell2.push(cardTitle);
    if (cardDesc) cell2.push(cardDesc);
    return [img, cell2];
  });

  // Compose the table: header row then card rows
  const tableRows = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the section (ourInitiativesSection) with the block table
  ourInitiativesSection.replaceWith(block);
}
