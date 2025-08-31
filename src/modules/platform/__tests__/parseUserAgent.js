// noinspection SpellCheckingInspection

import { describe, expect, it } from 'vitest';
import parseUserAgent from '../parseUserAgent.js';

// https://developer.samsung.com/smarttv/develop/guides/fundamentals/retrieving-platform-information.html
describe('tizen', () => {
  it('tv sdk 4.0 (2012)', () => {
    const input = 'Mozilla/5.0 (SmartHub; SMART-TV; U; Linux/SmartTV; Maple2012) AppleWebKit/534.7 (KHTML, like Gecko) SmartTV Safari/534.7';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 1 },
      browser: 'Safari',
      version: 534,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('tv sdk 4.5 (2013)', () => {
    const input = 'Mozilla/5.0 (SmartHub; SMART-TV; U; Linux/SmartTV+2013; Maple2012) AppleWebKit/535.20+ (KHTML, like Gecko) SmartTV Safari/535.20+';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 2013 },
      browser: 'Safari',
      version: 535,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('tv sdk 5.1 (2014)', () => {
    const input = 'Mozilla/5.0 (SmartHub; SMART-TV; U; Linux/SmartTV+2014; Maple2012) AppleWebKit/537.42+ (KHTML, like Gecko) SmartTV Safari/537.42+';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 2014 },
      browser: 'Safari',
      version: 537,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('tizen 2.3 (2015)', () => {
    const input = 'Mozilla/5.0 (SMART-TV; Linux; Tizen 2.2) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 2.2 }, // IK but for Samsung 2.3 is 2.2
      browser: 'Safari',
      version: 538,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('tizen 2.4 (2016)', () => {
    const input = 'Mozilla/5.0 (SMART-TV; Linux; Tizen 2.4.0) AppleWebKit/538.1 (KHTML, like Gecko) Version/2.4.0 TV Safari/538.1';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 2.4 },
      browser: 'Safari',
      version: 538,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('tizen 3.0 (2017)', () => {
    const input = 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 3.0) AppleWebKit/538.1 (KHTML, like Gecko) Version/3.0 TV Safari/538.1';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 3 },
      browser: 'Safari',
      version: 538,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('tizen 4.0 (2018)', () => {
    const input = 'Mozilla/5.0 (SMART-TV; Linux; Tizen 4.0) AppleWebKit/538.1 (KHTML, like Gecko) Version/4.0 TV Safari/538.1';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 4 },
      browser: 'Safari',
      version: 538,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('tizen 5.0 (2019)', () => {
    const input = 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/5.0 TV Safari/537.36';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 5 },
      browser: 'Safari',
      version: 537,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('tizen 5.5 (2020)', () => {
    const input = 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 5.5) AppleWebKit/537.36 (KHTML, like Gecko) 69.0.3497.106.1/5.5 TV Safari/537.36';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 5.5 },
      browser: 'Chrome',
      version: 69,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('tizen 6.0 (2021)', () => {
    const input = 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) 76.0.3809.146/6.0 TV Safari/537.36';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 6 },
      browser: 'Chrome',
      version: 76,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('tizen 6.5 (2022)', () => {
    const input = 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 6.5) AppleWebKit/537.36 (KHTML, like Gecko) 85.0.4183.93/6.5 TV Safari/537.36';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 6.5 },
      browser: 'Chrome',
      version: 85,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('tizen 7.0 (2023)', () => {
    const input = 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 7.0) AppleWebKit/537.36 (KHTML, like Gecko) 94.0.4606.31/7.0 TV Safari/537.36';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 7 },
      browser: 'Chrome',
      version: 94,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('tizen 8.0 (2022)', () => {
    const input = 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 8.0) AppleWebKit/537.36 (KHTML, like Gecko) 108.0.5359.1/8.0 TV Safari/537.36';
    const output = {
      isTV: true,
      os: { family: 'Tizen', version: 8 },
      browser: 'Chrome',
      version: 108,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });
});

// https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine#useragent-string
describe('webOS', () => {
  it('webOS TV 1.x', () => {
    const input = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.41 (KHTML, like Gecko) Large Screen WebAppManager Safari/537.41';
    const output = {
      isTV: true,
      os: { family: 'WebOS', version: 1 },
      browser: 'Safari',
      version: 537,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('webOS TV 2.x', () => {
    const input = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/538.2 (KHTML, like Gecko) Large Screen WebAppManager Safari/538.2';
    const output = {
      isTV: true,
      os: { family: 'WebOS', version: 2 },
      browser: 'Safari',
      version: 538,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('webOS TV 3.x', () => {
    const input = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.2.1 Chrome/38.0.2125.122 Safari/537.36 WebAppManager';
    const output = {
      isTV: true,
      os: { family: 'WebOS', version: 3 },
      browser: 'Chrome',
      version: 38,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('webOS TV 4.x', () => {
    const input = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.34 Safari/537.36 WebAppManager';
    const output = {
      isTV: true,
      os: { family: 'WebOS', version: 4 },
      browser: 'Chrome',
      version: 53,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('webOS TV 5.x', () => {
    const input = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36 WebAppManager';
    const output = {
      isTV: true,
      os: { family: 'WebOS', version: 5 },
      browser: 'Chrome',
      version: 68,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('webOS TV 6.x', () => {
    const input = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 WebAppManager';
    const output = {
      isTV: true,
      os: { family: 'WebOS', version: 6 },
      browser: 'Chrome',
      version: 79,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('webOS TV 22', () => {
    const input = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 WebAppManager';
    const output = {
      isTV: true,
      os: { family: 'WebOS', version: 22 },
      browser: 'Chrome',
      version: 87,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('webOS TV 23', () => {
    const input = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.128 Safari/537.36 WebAppManager';
    const output = {
      isTV: true,
      os: { family: 'WebOS', version: 23 },
      browser: 'Chrome',
      version: 94,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('webOS TV 24', () => {
    const input = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.211 Safari/537.36 WebAppManager';
    const output = {
      isTV: true,
      os: { family: 'WebOS', version: 24 },
      browser: 'Chrome',
      version: 108,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });
});

describe('android TV', () => {
  it('android tv 10', () => {
    const input = 'Mozilla/5.0 (Linux; Android 10.0.0; Android TV; SMART TV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.0 TV Safari/537.36';
    const output = {
      isTV: true,
      os: { family: 'AndroidTV', version: 10 },
      browser: 'Chrome',
      version: 40,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('android tv 10 Webview', () => {
    const input = 'Mozilla/5.0 (Linux; Android 10; PrismPlus 4K Android TV Build/QTG3.200617.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/113.0.5672.76 Mobile Safari/537.36';
    const output = {
      isTV: true,
      os: { family: 'AndroidTV', version: 10 },
      browser: 'Chrome',
      version: 113,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('mi box S Webview', () => {
    const input = 'Mozilla/5.0 (Linux; Android 9; MIBOX4 Build/PI) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.123 Mobile Safari/537.36';
    const output = {
      isTV: true,
      os: { family: 'AndroidTV', version: 9 },
      browser: 'Chrome',
      version: 124,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });

  it('nvidia shield', () => {
    const input = 'Mozilla/5.0 (Linux; Android 11; SHIELD Android TV Build/RQ1A.210105.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/129.0.6668.81 Mobile Safari/537.36';
    const output = {
      isTV: true,
      os: { family: 'AndroidTV', version: 11 },
      browser: 'Chrome',
      version: 129,
    };

    expect(parseUserAgent(input)).toEqual(output);
  });
});

// it('user agent for a Philips TV', () => {
//   const userAgent = 'Mozilla/5.0 (Linux; Android 11; Philips Google TV TA7 Build/RTM5.220609.199; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.107 Mobile Safari/537.36';
//   const result = parseUserAgent(userAgent);
//
//   expect(result).toEqual({});
// });

it('user agent for a Windows 10 machine', () => {
  const input = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36';
  const output = {
    isTV: false,
    os: { family: 'Windows', version: 10 },
    browser: 'Chrome',
    version: 133,
  };

  expect(parseUserAgent(input)).toEqual(output);
});

it('user agent for a Mac OS X machine', () => {
  const input = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36';
  const output = {
    isTV: false,
    os: { family: 'macOS', version: 14 },
    browser: 'Chrome',
    version: 133,
  };

  expect(parseUserAgent(input)).toEqual(output);
});

it('user agent for android', () => {
  const input = 'Mozilla/5.0 (Android 10; Mobile; rv:141.0) Gecko/141.0 Firefox/141.0';
  const output = {
    isTV: false,
    os: { family: 'Android', version: 10 },
    browser: 'Firefox',
    version: 141,
  };

  expect(parseUserAgent(input)).toEqual(output);
});

it('user agent for a Linux machine', () => {
  const input = 'Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0';
  const output = {
    isTV: false,
    os: { family: 'Linux', version: 1 },
    browser: 'Firefox',
    version: 134,
  };

  expect(parseUserAgent(input)).toEqual(output);
});

it('handle an unknown user agent', () => {
  const input = 'Mozilla/5.0';
  const output = {
    isTV: false,
    os: { family: undefined, version: 1 },
    browser: undefined,
    version: 1,
  };

  expect(parseUserAgent(input)).toEqual(output);
});

it('user agent for an Edge browser', () => {
  const input = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/131.0.2903.8';
  const output = {
    isTV: false,
    os: { family: 'Windows', version: 10 },
    browser: 'Chrome',
    version: 133,
  };

  expect(parseUserAgent(input)).toEqual(output);
});

it('handle an unknown browser', () => {
  const input = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36';
  const output = {
    isTV: false,
    os: { family: 'Windows', version: 10 },
    browser: 'Safari',
    version: 537,
  };

  expect(parseUserAgent(input)).toEqual(output);
});
