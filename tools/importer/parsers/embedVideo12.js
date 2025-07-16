/* global WebImporter */
export default function parse(element, { document }) {
  // Gather all visual and textual content from the element, referencing nodes directly
  const cellContent = [];
  
  // Collect all images in order
  element.querySelectorAll('img').forEach(img => cellContent.push(img));

  // Collect all iframes/embed as video links (as per requirements)
  element.querySelectorAll('iframe, embed').forEach(iframe => {
    if (iframe.src) {
      const a = document.createElement('a');
      a.href = iframe.src;
      a.textContent = iframe.src;
      cellContent.push(a);
    }
  });

  // Collect direct children that are not images/iframes/embeds (e.g., text, nav, logo, links, buttons, etc)
  // Also, for each child node, if it's an element node and not already captured, include it
  Array.from(element.childNodes).forEach(node => {
    // If the node is an element and not img/iframe/embed, include it
    if (node.nodeType === Node.ELEMENT_NODE && !['IMG','IFRAME','EMBED'].includes(node.tagName)) {
      if (!cellContent.includes(node)) {
        cellContent.push(node);
      }
    }
    // If the node is a text node with real text, include it in order
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      cellContent.push(node);
    }
  });

  // If nothing meaningful, do not replace
  if (cellContent.length === 0) return;

  const cells = [
    ['Embed (embedVideo12)'],
    [cellContent.length === 1 ? cellContent[0] : cellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
