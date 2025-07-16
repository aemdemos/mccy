/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to collect all non-empty visible elements relevant for carousel text
  function getSlideTextBlock(slide) {
    // Prefer .home-carousel-title block in its entirety if it contains any non-empty text
    const titleBlock = slide.querySelector('.home-carousel-title');
    if (titleBlock) {
      // If .home-carousel-title or any of its descendants contains non-empty textContent, use the entire block
      if (titleBlock.textContent && titleBlock.textContent.trim().length > 0) {
        return titleBlock;
      }
    }
    // Otherwise, try .carousel-caption
    const captionBlock = slide.querySelector('.carousel-caption');
    if (captionBlock && captionBlock.textContent && captionBlock.textContent.trim().length > 0) {
      return captionBlock;
    }
    // Otherwise, collect all direct children that are heading, p, or link and have text
    const blocks = Array.from(slide.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a')).filter(e => e.textContent && e.textContent.trim().length > 0);
    if (blocks.length) {
      // If multiple, return as a fragment
      if (blocks.length === 1) return blocks[0];
      const fragment = document.createElement('div');
      blocks.forEach(el => fragment.appendChild(el));
      return fragment;
    }
    // As fallback, gather all non-empty text nodes under slide
    const texts = Array.from(slide.childNodes)
      .filter(n => n.nodeType === 3 && n.textContent && n.textContent.trim().length > 0)
      .map(n => n.textContent.trim());
    if (texts.length) {
      const span = document.createElement('span');
      span.textContent = texts.join(' ');
      return span;
    }
    // If nothing, return empty string
    return '';
  }

  // Helper to get best image for the slide
  function getSlideImage(slide) {
    // Look for <picture> first, prefer desktop <source>
    const picture = slide.querySelector('picture');
    if (picture) {
      const sources = picture.querySelectorAll('source[srcset]');
      let bestSrc = '';
      let found = Array.from(sources).find(s => s.media && s.media.includes('min-width'));
      if (!found && sources.length > 0) found = sources[0];
      if (found) bestSrc = found.getAttribute('srcset');
      // Fallback to <img> src
      if (!bestSrc) {
        const img = picture.querySelector('img[src]');
        if (img) bestSrc = img.getAttribute('src');
      }
      if (bestSrc) {
        let imgElem = picture.querySelector(`img[src="${bestSrc}"]`);
        if (!imgElem) {
          imgElem = document.createElement('img');
          imgElem.src = bestSrc;
        }
        if (!imgElem.alt) {
          const img = picture.querySelector('img');
          imgElem.alt = img && img.getAttribute('alt') ? img.getAttribute('alt') : '';
        }
        return imgElem;
      }
    }
    // <video>: get <img> poster if available
    const video = slide.querySelector('video');
    if (video) {
      const posterImg = video.querySelector('img[src]');
      if (posterImg) return posterImg;
    }
    // <img> direct
    const img = slide.querySelector('img[src]');
    if (img) return img;
    return '';
  }

  // Build the block table
  const rows = [['Carousel']];
  const carouselInner = element.querySelector('.carousel-inner');
  if (carouselInner) {
    const slides = carouselInner.querySelectorAll(':scope > .carousel-item');
    slides.forEach((slide) => {
      const imgElem = getSlideImage(slide);
      const textElem = getSlideTextBlock(slide);
      // Guarantee a 2-column row. If textElem is empty string, keep as is.
      rows.push([imgElem, textElem]);
    });
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
