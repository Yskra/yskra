/** @import {ReleaseDatesResponse} from '../Public'; */
import { IMPERIAL_CERTIFICATION_REGION_KEY, IMPERIAL_METRIC_CERTIFICATION_MAP } from '@/plugins/TMDB/constants.js';

/**
 * @param {ReleaseDatesResponse} releaseDates releaseDates
 * @param {string} region region
 */
export default function findCertification(releaseDates, region) {
  const defaultCertification = findByRegion(releaseDates, region);

  if (defaultCertification) {
    return defaultCertification;
  }
  if (region === IMPERIAL_CERTIFICATION_REGION_KEY) {
    return null;
  }

  const imperialCertification = findByRegion(releaseDates, IMPERIAL_CERTIFICATION_REGION_KEY);

  if (imperialCertification) {
    return normalizeRating(imperialCertification);
  }

  return null;


  /**
   * @param {ReleaseDatesResponse} releaseDates releaseDates
   * @param {string} regionName regionName
   */
  function findByRegion(releaseDates, regionName) {
    const region = releaseDates.results.find(({ iso_3166_1 }) => iso_3166_1 === regionName);

    if (region && region.release_dates.length) {
      const hasCertification = region.release_dates.find(({ certification }) => !!certification);

      if (hasCertification) {
        return hasCertification.certification;
      }
    }
  }
}

/**
 * convert imperial rating to metric
 * @param {string} classification imperial rating
 */
export function normalizeRating(classification) {
  if (classification in IMPERIAL_METRIC_CERTIFICATION_MAP) {
    // @ts-ignore
    return IMPERIAL_METRIC_CERTIFICATION_MAP[classification];
  }

  return classification;
}
