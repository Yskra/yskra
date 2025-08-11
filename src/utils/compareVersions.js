/**
 * @param {string} version1 - format 1.0.0
 * @param {string} version2 - format 1.0.0
 * @return {boolean}
 */
export default function compareVersions(version1, version2) {
  const [major1, minor1, patch1] = version1.split('.').map(Number);
  const [major2, minor2, patch2] = version2.split('.').map(Number);

  if (major1 !== major2) {
    return major1 > major2;
  }
  if (minor1 !== minor2) {
    return minor1 > minor2;
  }
  return patch1 >= patch2;
}
