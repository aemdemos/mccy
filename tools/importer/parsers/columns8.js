/* global WebImporter */
export default function parse(element, { document }) {
  // Get container for social block
  const container = element.querySelector('.home-get-social') || element;
  // Find Instagram image block if it exists
  const imagesBlock = container.querySelector('.get-social-images, #instagramContainer');

  // Gather all nodes that are not the images block or loader
  const nonImageNodes = [];
  for (const node of container.childNodes) {
    if (imagesBlock && node === imagesBlock) continue;
    if (node.nodeType === Node.ELEMENT_NODE && node.matches('#insta-loader')) continue;
    if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
      nonImageNodes.push(node);
    }
  }

  // Gather Instagram image links as columns
  let imageLinks = [];
  if (imagesBlock) {
    imageLinks = Array.from(imagesBlock.querySelectorAll(':scope > a'));
  }

  // Build columns array: first column for non-image content (if any), then image columns
  let columns = [];
  if (nonImageNodes.length) columns.push(nonImageNodes);
  if (imageLinks.length) columns = columns.concat(imageLinks);
  if (!columns.length) columns = ['']; // Guarantee at least one cell

  const cells = [
    ['Columns (columns8)'],
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
