// @ts-nocheck

/**
 * @param {...any} message
 */
export default function logMessage2str(message) {
  if (Array.isArray(message)) {
    const messages = message.map((m) => toString(m));
    const title = messages.map(({ title }) => title).filter(Boolean).join('\n');
    const full = messages.map(({ full }) => full).filter(Boolean).join('\n');

    return { title, full };
  }
  return toString(message);
}

/**
 * @param {any} value
 */
function toString(value) {
  if (!value) {
    return { title: '', full: '' };
  }

  if (value instanceof Error) {
    const title = value.toString();
    const full = `${title}\n\n${value.stack}`;

    return { title, full };
  }

  if (typeof value === 'object') {
    const full = objectToString(value);

    return { title: '', full };
  }

  if (typeof value === 'function') {
    return { title: '', full: value.toString() };
  }

  return { title: value.toString() };
}

/**
 * @param {any} value
 */
function objectToString(value) {
  if ('$' in value) {
    if (typeof value.$.render === 'function') {
      return `[VueInstance (${value.$.type.__name})]`;
    }
    return '[cant JSON.stringify object - use browser console to see it]';
  }

  if (Array.isArray(value)) {
    return `${value.map((e) => (typeof e === 'object') ? objectToString(e) : e).join(', ')}`;
  }

  return JSON.stringify(value, null, 2);
}
