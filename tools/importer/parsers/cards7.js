/* global WebImporter */
export default function parse(element, { document }) {
  // Locate Initiatives section
  const initiativesSection = element.querySelector('section#f925c0a8308833c7b693d9059865527e');
  if (!initiativesSection) return;
  const cardGrid = initiativesSection.querySelector('.grid');
  if (!cardGrid) return;
  const cards = Array.from(cardGrid.querySelectorAll(':scope > a'));

  const rows = cards.map(card => {
    // First cell: icon (svg in h3 if present)
    const h3 = card.querySelector('h3');
    let icon = null;
    if (h3) icon = h3.querySelector('svg');
    if (!icon) icon = document.createElement('span');

    // Second cell: title (strong), all elements and text that follow title, and CTA (the card link itself)
    // 1. Title as <strong>, referencing h3 text minus SVG
    let titleNode = null;
    if (h3) {
      const h3Clone = h3.cloneNode(true);
      h3Clone.querySelectorAll('svg').forEach(svg => svg.remove());
      titleNode = document.createElement('strong');
      titleNode.textContent = h3Clone.textContent.trim();
    }
    // 2. All descriptions: gather all nodes after <h3>, until end of card
    const descNodes = [];
    if (h3) {
      let n = h3.nextSibling;
      while (n) {
        // include element nodes and non-whitespace text nodes
        if (
          n.nodeType === Node.ELEMENT_NODE ||
          (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
        ) {
          descNodes.push(n);
        }
        n = n.nextSibling;
      }
    }
    // If description text nodes, wrap them in <span> to keep valid HTML
    const descEls = descNodes.map(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        return span;
      }
      return node;
    });
    // 3. CTA: use the card <a> itself, but only as link, not including inner elements
    const ctaLink = document.createElement('a');
    ctaLink.href = card.getAttribute('href');
    ctaLink.textContent = titleNode ? titleNode.textContent + ' →' : card.textContent.trim() + ' →';

    // Compose cell: title, desc, CTA, with <br>s as spacing if needed
    const cell = [titleNode];
    if (descEls.length) {
      cell.push(document.createElement('br'));
      cell.push(...descEls);
    }
    cell.push(document.createElement('br'));
    cell.push(ctaLink);
    return [icon, cell];
  });

  // Compose table for Cards (cards7)
  const table = WebImporter.DOMUtils.createTable([
    ['Cards (cards7)'],
    ...rows
  ], document);

  initiativesSection.replaceWith(table);
}
