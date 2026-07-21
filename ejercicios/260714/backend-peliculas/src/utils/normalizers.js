function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function sanitizeText(value, { maxLength = 255, allowEmpty = false } = {}) {
  if (value === undefined || value === null) return allowEmpty ? "" : null;
  const normalized = String(value).trim().replace(/\s+/g, " ");
  if (!normalized) return allowEmpty ? "" : null;
  return normalized.slice(0, maxLength);
}

function sanitizeYear(value) {
  const currentYear = new Date().getFullYear();
  if (value === undefined || value === null || value === "") return String(currentYear);

  const year = String(value).trim();
  if (!/^\d{4}$/.test(year)) return null;

  const numericYear = Number(year);
  if (numericYear < 1888 || numericYear > currentYear + 2) return null;
  return year;
}

function sanitizeGenres(value) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) return null;

  return [...new Set(
    value
      .map((genre) => sanitizeText(genre, { maxLength: 50 }))
      .filter(Boolean)
  )];
}

function sanitizeImage(value) {
  if (value === undefined || value === null || value === "") return "";

  try {
    const url = new URL(String(value).trim());
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function sanitizeTemporadas(value) {
  if (value === undefined || value === null || value === "") return 1;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 999) return null;
  return parsed;
}

module.exports = {
  normalizeText,
  sanitizeText,
  sanitizeYear,
  sanitizeGenres,
  sanitizeImage,
  sanitizeTemporadas,
};
