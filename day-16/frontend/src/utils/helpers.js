/**
 * Format a date into local date string.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString();
};

/**
 * Capitalize first letter.
 * @param {string} text
 * @returns {string}
 */
export const capitalize = (text = "") => {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Truncate long text.
 * @param {string} text
 * @param {number} length
 * @returns {string}
 */
export const truncateText = (text = "", length = 100) => {
  if (text.length <= length) {
    return text;
  }

  return `${text.substring(0, length)}...`;
};