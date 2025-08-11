const ATTRIBUTE_REGEX = /(\S+?)="(.*?)"/g; // tvg-id="Channel1"
const CHANNEL_REGEX = /#EXTINF:-?\d?\s(?<meta>.*),(?<name>.*)/;
const kebab2CamelCase = (/** @type {string} */ str) => str.replace(/-./g, (x) => x[1].toUpperCase());

/**
 * Get playlist .m3u from url and parse it
 * @param {string} url playlist url
 */
export default async function ipTvPlaylistParser(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const text = await response.text();

  if (!text || !text.startsWith('#EXTM3U')) {
    throw new Error('Not a valid playlist');
  }

  return parseChannels(text);
}

/**
 * Parse channel from text
 * @param {string} text
 * @return {channelInfo[]}
 */
function parseChannels(text) {
  const lines = text.split('\n');
  /** @type {({name: string, url: string, group: string, id: string} & Record<string, string>) | Record<string, string>} */
  let channelInfo = {};
  /** @type {(typeof channelInfo)[]} */
  const channels = [];

  lines.forEach((line) => {
    if (line.startsWith('#EXTINF:')) {
      const match = CHANNEL_REGEX.exec(line);

      if (!match) {
        return;
      }
      // @ts-ignore
      const { meta, name } = match.groups;
      const attrs = parseAttributes(meta);

      channelInfo = { name: name.trim(), ...attrs };
    }
    else if (line.startsWith('#EXTGRP:')) {
      channelInfo.group = line.replace('#EXTGRP:', '').trim();
    }
    else if (line.startsWith('http')) { // end of channel
      const name = channelInfo.tvgName ?? channelInfo.name;

      if (!name) {
        return;
      }
      const group = channelInfo.group ?? channelInfo.groupTitle ?? '__UNKNOWN__';
      const url = line.trim();
      const id = getChannelId(name);

      channels.push({ ...channelInfo, group, name, url, id });
      channelInfo = {};
    }
  });

  channels.sort((a, b) => a.group.localeCompare(b.group));

  return channels;
}

/**
 * Parse attributes. like: tvg-id="Channel1" tvg-name="Channel 1" tvg-logo="http://example.com/logo1.png" group-title="News"
 * @param {string} attributeString
 * @return {Record<string, string>}
 */
function parseAttributes(attributeString) {
  /** @type {Record<string, string>} */
  const attributes = {};

  for (const [, k, v] of attributeString.matchAll(ATTRIBUTE_REGEX)) {
    const key = kebab2CamelCase(k);

    attributes[key] = v;
  }

  return attributes;
}

/**
 * Generate channel id from name
 * @param {string} str
 * @return {string}
 */
function getChannelId(str) {
  return str.replaceAll(' ', '');
}
