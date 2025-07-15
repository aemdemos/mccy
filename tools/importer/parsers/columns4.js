/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find and REMOVE the heading so it isn't duplicated
  let heading = element.querySelector('h2.prose-display-sm');
  if (heading && heading.parentElement) {
    heading = heading.parentElement.removeChild(heading);
  }

  // 2. Locate the grid (desktop or mobile)
  let desktop = element.querySelector('.lg\\:block');
  let grid = null;
  let afterGrid = [];
  if (desktop) {
    grid = desktop.querySelector('.lg\\:grid');
    if (grid) {
      const gridIndex = Array.from(desktop.children).indexOf(grid);
      afterGrid = Array.from(desktop.children).slice(gridIndex + 1).filter(
        (c) => c.nodeType === 1 && c.tagName.toLowerCase() === 'div'
      );
    }
  }
  if (!grid) {
    grid = element.querySelector(
      '.flex.flex-col.gap-8.px-6.py-11'
    ) || element.querySelector('.flex.flex-col.gap-8.px-6') ||
      element.querySelector('.flex.flex-col.gap-8');
    if (grid) {
      const gridIndex = Array.from(element.children).indexOf(grid);
      afterGrid = Array.from(element.children).slice(gridIndex + 1).filter(
        (c) => c.nodeType === 1 && c.tagName.toLowerCase() === 'div'
      );
    }
  }
  if (!grid) grid = element;

  // 3. Find left and right columns
  let leftCol = null, rightCol = null;
  if (grid.classList.contains('lg:grid')) {
    const gridDivs = Array.from(grid.children).filter(
      (c) => c.nodeType === 1 && c.tagName === 'DIV'
    );
    leftCol = gridDivs[0] || '';
    rightCol = gridDivs[1] || '';
  } else {
    const mainDivs = Array.from(grid.children).filter(
      (c) => c.nodeType === 1 && c.tagName === 'DIV'
    );
    leftCol = mainDivs[0] || '';
    rightCol = mainDivs[1] || '';
  }

  // 4. Dive into content block if just a wrapper
  function getContentBlock(col) {
    if (!col) return '';
    if (col.children.length === 1 && col.children[0].tagName === 'DIV') {
      return col.children[0];
    }
    return col;
  }
  leftCol = getContentBlock(leftCol);
  rightCol = getContentBlock(rightCol);

  // 5. Compose the left column fragment with heading at the top
  const leftColFragment = document.createDocumentFragment();
  if (heading) leftColFragment.appendChild(heading);
  if (leftCol) {
    // If leftCol contains the heading due to a substructure, remove any additional h2 inside
    let h2inside = leftCol.querySelector('h2.prose-display-sm');
    if (h2inside && h2inside.parentElement) {
      h2inside.parentElement.removeChild(h2inside);
    }
    leftColFragment.appendChild(leftCol);
  }

  // 6. Main row
  const mainRow = [leftColFragment, rightCol];

  // 7. Footer row for everything after grid (should NOT include heading)
  let footerRow = null;
  if (afterGrid && afterGrid.length > 0) {
    // Remove any h2 that may remain in afterGrid (to prevent accidental placement in footer)
    afterGrid.forEach(div => {
      let h2in = div.querySelector('h2.prose-display-sm');
      if (h2in && h2in.parentElement) h2in.parentElement.removeChild(h2in);
    });
    let fragment = document.createDocumentFragment();
    afterGrid.forEach((el) => fragment.appendChild(el));
    footerRow = [fragment, ''];
  }

  // 8. Compose table
  const rows = [['Columns'], mainRow];
  if (footerRow) rows.push(footerRow);

  // 9. Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
