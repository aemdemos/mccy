/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the card links
  const cardsGrid = element.querySelector('.component-content');
  if (!cardsGrid) return;

  // Gather all card anchor elements (each represents a card)
  const cardLinks = Array.from(cardsGrid.querySelectorAll(':scope > a'));

  // Header row must have two cells: ['Cards', '']
  const rows = [['Cards', '']];

  cardLinks.forEach(card => {
    // Image cell: .align-center > img
    let img = null;
    const imgContainer = card.querySelector('div.align-center');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }
    const imgCell = img || '';

    // Text cell: .flex-col contains <p> title (and possibly more in variants)
    const textDiv = card.querySelector('div.flex-col');
    let textCellContents = [];
    if (textDiv) {
      const titleP = textDiv.querySelector('p');
      if (titleP) textCellContents.push(titleP);
    }
    rows.push([imgCell, textCellContents]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
