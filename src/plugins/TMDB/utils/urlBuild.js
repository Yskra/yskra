/** @import {imageTypes} from '../constants'; */
/** @typedef {typeof imageTypes} ImageTypes */
/** @typedef {ImageTypes[keyof ImageTypes]} ImageType */
/** @typedef {typeof imageQualities} ImageQualities */
/** @typedef {ImageQualities[keyof ImageQualities]} ImageQualitie */
// noinspection SpellCheckingInspection

import { imageQualities, imageSizes } from '@/plugins/TMDB/constants.js';
import { useTMDBStore } from '../api/tmdb.js';

const YT_ENDPOINT = new URL('https://www.youtube.com/watch?v=');
const YT_IMG_ENDPOINT = new URL('https://img.youtube.com/vi/');

export function useUrlBuild() {
  const store = useTMDBStore();
  const defaultQuality = imageQualities.HIGH;

  return {
    buildTMDBImageUrl,
    buildYTImageUrl,
    buildYTUrl,
  };

  /**
   * Build TMDB image url with quality
   * @param {string} path image /path
   * @param {ImageType} type type from ImageTypes
   * @param {(ImageQualitie|null)[]=} qility request quality [min, max]
   * @returns {URL} url
   */
  function buildTMDBImageUrl(path, type, [min, max] = [null, null]) {
    /** @type {ImageQualitie} */
    const quality = (min !== null && defaultQuality < min) ? min : (max !== null && defaultQuality > max) ? max : defaultQuality;
    const size = imageSizes[type][quality];

    return new URL(`w${size}${path}`, store.imageCdn);
  }

  /**
   * Build YouTube video image url
   * @param {string} key video id
   * @param {'default'|'chqdefault'|'mqdefault'|'sddefault'|'maxresdefault'} type yt image type
   */
  function buildYTImageUrl(key, type = 'mqdefault') {
    return new URL(`${key}/${type}.jpg`, YT_IMG_ENDPOINT);
  }

  /**
   * Build YouTube video url
   * @param {string} key video id
   */
  function buildYTUrl(key) {
    return new URL(`watch?v=${key}`, YT_ENDPOINT);
  }
}
