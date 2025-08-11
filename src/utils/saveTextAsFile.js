/**
 * @param {string} filename
 * @param {ArrayBuffer|string|Blob} content
 */
export default function saveTextAsFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}
