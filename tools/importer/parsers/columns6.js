/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const cells = [['Columns (columns6)']];

  // Find main content (prefer desktop)
  const wrappers = element.querySelectorAll(':scope > div');
  let mainContent;
  if (wrappers.length === 2 && wrappers[1].classList.contains('lg:block')) {
    mainContent = wrappers[1].querySelector('.mx-auto') || wrappers[1];
  } else if (wrappers.length > 0) {
    mainContent = wrappers[0];
  } else {
    mainContent = element;
  }

  // Find grid/flex with two columns (nav, contact/social)
  let grid = mainContent.querySelector('[class*="grid"]');
  if (!grid) grid = mainContent.querySelector('.prose-body-sm.flex.flex-col.gap-8');
  let gridDivs = grid ? Array.from(grid.children).filter(e => e.tagName === 'DIV') : [];

  // LEFT COLUMN: Ministry heading and nav links
  const leftColumn = [];
  const ministryHeading = mainContent.querySelector('h2');
  if (ministryHeading) leftColumn.push(ministryHeading);
  if (gridDivs[0]) leftColumn.push(gridDivs[0]);

  // RIGHT COLUMN: contact/social, then copyright/legal/badges, stacked
  const rightColumn = [];
  if (gridDivs[1]) rightColumn.push(gridDivs[1]);
  // Get all mainContent children after the grid (copyright, legal, badges)
  const allMainChildren = Array.from(mainContent.children);
  const gridIdx = allMainChildren.indexOf(grid);
  if (gridIdx > -1) {
    for (let i = gridIdx + 1; i < allMainChildren.length; i++) {
      const c = allMainChildren[i];
      // Only add elements containing visible (non-empty) text or links/badges
      if (c && (c.textContent.trim() || c.querySelector('svg,a'))) {
        rightColumn.push(c);
      }
    }
  }

  // Compose the row
  cells.push([leftColumn, rightColumn]);

  // Fallback: if no columns, put all mainContent in a single cell
  if (!leftColumn.length && !rightColumn.length) {
    cells.push([[mainContent]]);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
