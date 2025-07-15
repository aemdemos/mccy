/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero image from the first img that is not an icon/etc
  let image = null;
  const imgs = element.querySelectorAll('img');
  for (const img of imgs) {
    // Heuristic: wide images with width="100%" are likely hero
    if (
      img.classList.contains('min-w-full') ||
      img.classList.contains('max-w-full') ||
      img.getAttribute('width') === '100%'
    ) {
      image = img;
      break;
    }
  }
  // Fallback: just use first img
  if (!image && imgs.length > 0) {
    image = imgs[0];
  }

  // Find the area after the image, up to (but not including) the next major section (h2 with id, or section)
  let heroContent = [];
  if (image) {
    let imgDiv = image.closest('div') || image.parentElement;
    let curr = imgDiv;
    // Move to next sibling
    do {
      curr = curr.nextElementSibling;
    } while (curr && curr.tagName === 'DIV' && curr.querySelector('img'));
    // Now at first real content after image
    // Gather everything until next h2 with id or section
    while (curr) {
      if ((curr.tagName === 'H2' && curr.id) || curr.tagName === 'SECTION') {
        break;
      }
      heroContent.push(curr);
      curr = curr.nextElementSibling;
    }
  }

  // Fallback: if we didn't find anything, try h2 + following ps at start
  if (heroContent.length === 0) {
    // Try to get first h2 in main content, and all p until next h2/section
    const h2 = element.querySelector('h2');
    if (h2) {
      heroContent.push(h2);
      let curr = h2.nextElementSibling;
      while (curr && curr.tagName !== 'H2' && curr.tagName !== 'SECTION') {
        heroContent.push(curr);
        curr = curr.nextElementSibling;
      }
    }
  }

  // Remove any null/undefined/empty nodes
  heroContent = heroContent.filter(Boolean);
  // Remove nodes that are just whitespace text nodes
  heroContent = heroContent.filter(node => {
    if (!node) return false;
    if (node.nodeType === Node.ELEMENT_NODE) return true;
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') return true;
    return false;
  });

  // Compose the cells as per the example: 1 column, 3 rows
  const cells = [
    ['Hero (hero5)'],
    [image ? image : ''],
    [heroContent.length > 0 ? heroContent : '']
  ];
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
