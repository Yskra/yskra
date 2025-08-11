/**
 * Formats a floating-point number representing seconds into HH:MM:SS format.
 * @param {number} seconds - The number of seconds to format.
 * @returns {string} The formatted time in (HH)?:М(М)?:SS format.
 */
export default function formatPlayerTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const result = [];

  if (hours > 0) {
    result.push(hours);
  }
  result.push(minutes, remainingSeconds.toString().padStart(2, '0'));

  return result.join(':');
}
