/* global WebImporter */
export default function parse(element, { document }) {
  // Goal: Extract the "Our initiatives" cards as a Cards (cards5) block

  // 1. Find the section with the 'Our initiatives' grid of cards
  let section = null;
  let grid = null;

  // Search for 'Our initiatives' heading
  const h2s = element.querySelectorAll('h2');
  for (const h2 of h2s) {
    if (h2.textContent.trim() === 'Our initiatives') {
      // The cards grid is likely a sibling or descendant
      // Look for the next .grid after the h2
      let node = h2.nextElementSibling;
      while (node) {
        if (node.classList && node.classList.contains('grid')) {
          grid = node;
          section = h2.parentElement;
          break;
        }
        node = node.nextElementSibling;
      }
      if (!grid) {
        // fallback: descendant .grid
        grid = h2.parentElement.querySelector('.grid');
        if (grid) section = h2.parentElement;
      }
      break;
    }
  }

  // If not found, fallback to .grid with 3 or more anchors
  if (!grid) {
    const possible = element.querySelectorAll('.grid');
    for (const div of possible) {
      if (div.querySelectorAll('a').length >= 3) {
        grid = div;
        section = div.parentElement;
        break;
      }
    }
  }

  if (!grid) return;
  
  // 2. Extract the cards
  const rows = [['Cards (cards5)']];
  const cards = Array.from(grid.querySelectorAll(':scope > a'));

  cards.forEach(card => {
    // First cell: the image (reference the actual <img> element)
    let imgCell = null;
    const imgDiv = card.querySelector('div');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) imgCell = img;
    }

    // Second cell: all text content (keep elements, do not clone)
    // This usually means the div (after the image div) containing h3, p, etc.
    let textDiv = null;
    const divs = Array.from(card.querySelectorAll('div'));
    if (divs.length > 1) {
      textDiv = divs[1];
    } else if (divs.length === 1 && !imgCell) {
      // In case the image is missing, use the only div
      textDiv = divs[0];
    }
    // Fallback: get all directly under the card after the image div
    let textContent = [];
    if (textDiv) {
      // Reference its children only (to avoid possible container div)
      textContent = Array.from(textDiv.children);
    } else {
      // fallback: collect all <h3> and <p> under the card (not in image div)
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (h3) textContent.push(h3);
      if (p) textContent.push(p);
    }

    // If no image, set cell to null for layout
    rows.push([
      imgCell || null,
      textContent.length > 0 ? textContent : card.textContent.trim()
    ]);
  });

  // 3. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
