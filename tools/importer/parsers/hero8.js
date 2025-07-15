/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column (contains the hero image and main content)
  let mainColumn = element.querySelector('.flex.flex-col.gap-16');
  if (!mainColumn) {
    mainColumn = element;
  }

  // Find the hero image (first <img> under mainColumn)
  let heroImg = mainColumn.querySelector('img');

  // Find the first hero heading (h2) after the image
  let heroHeading = null;
  let heroContent = [];
  if (heroImg) {
    // Start from the image's parent
    let imgContainer = heroImg.parentElement;
    let sibling = imgContainer.nextElementSibling;
    // Find the first H2 after the image
    while (sibling && (!sibling.tagName || !sibling.tagName.match(/^H2$/i))) {
      sibling = sibling.nextElementSibling;
    }
    if (sibling && sibling.tagName.match(/^H2$/i)) {
      heroHeading = sibling;
      heroContent.push(heroHeading);
      // Now gather only the blocks that belong to the hero intro: paragraphs and info boxes,
      // but stop if we hit another H2 (the next main section) or SECTION (major block)
      sibling = heroHeading.nextElementSibling;
      while (sibling && (!sibling.tagName.match(/^H2$/i)) && sibling.tagName !== 'SECTION') {
        // Example allows paragraphs and info-box divs in hero, but not new main sections
        if (
          sibling.tagName === 'P' ||
          (sibling.tagName === 'DIV' && sibling.className.includes('prose-headline-lg-regular'))
        ) {
          heroContent.push(sibling);
        }
        sibling = sibling.nextElementSibling;
      }
    }
  }

  const headerRow = ['Hero (hero8)'];
  const imgRow = [heroImg ? heroImg : ''];
  const contentRow = [heroContent.length ? heroContent : ['']];
  const cells = [headerRow, imgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
