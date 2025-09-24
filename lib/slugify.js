export function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // spaces → dash
      .replace(/[^\w\-]+/g, "") // remove non-word
      .replace(/\-\-+/g, "-"); // collapse multiple dashes
  }
  