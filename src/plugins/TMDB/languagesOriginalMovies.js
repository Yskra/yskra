// import fs from 'node:fs';
// import languages from './languages.json' with { type: 'json' };
//
// const filmsText = fs.readFileSync('./filmsWithHasOriginalMovies.txt', 'utf-8');
// const validLanguages = new Set();
// const result = [];
//
// filmsText.trim().split('\n').forEach(line => {
//   const match = line.match(/^(.+?) \(([\d,]+)\)$/);
//   if (match) {
//     const languageName = match[1].trim();
//     const count = Number.parseInt(match[2].replace(/,/g, ''), 10);
//
//     if (count > 2000) {
//       validLanguages.add(languageName);
//     }
//   }
// });
// languages.forEach(lang => {
//   const { iso_639_1, english_name, name } = lang;
//   const displayName = name && name.trim() !== '' ? name : english_name;
//
//   if (validLanguages.has(english_name) || (name && name.trim() !== '' && validLanguages.has(name))) {
//     result.push({
//       value: iso_639_1,
//       name: `${displayName} [${iso_639_1}]`
//     });
//   }
// });


export default [
  { value: 'id', name: 'Bahasa indonesia [id]' },
  { value: 'ru', name: 'Pусский [ru]' },
  { value: 'sv', name: 'svenska [sv]' },
  { value: 'ta', name: 'தமிழ் [ta]' },
  { value: 'te', name: 'తెలుగు [te]' },
  { value: 'uk', name: 'Український [uk]' },
  { value: 'el', name: 'ελληνικά [el]' },
  { value: 'tr', name: 'Türkçe [tr]' },
  { value: 'cn', name: '广州话 / 廣州話 [cn]' },
  { value: 'ja', name: '日本語 [ja]' },
  { value: 'ko', name: '한국어/조선말 [ko]' },
  { value: 'da', name: 'Dansk [da]' },
  { value: 'cs', name: 'Český [cs]' },
  { value: 'ro', name: 'Română [ro]' },
  { value: 'fr', name: 'Français [fr]' },
  { value: 'th', name: 'ภาษาไทย [th]' },
  { value: 'xx', name: 'No Language [xx]' },
  { value: 'de', name: 'Deutsch [de]' },
  { value: 'fi', name: 'suomi [fi]' },
  { value: 'it', name: 'Italiano [it]' },
  { value: 'pt', name: 'Português [pt]' },
  { value: 'fa', name: 'فارسی [fa]' },
  { value: 'en', name: 'English [en]' },
  { value: 'hu', name: 'Magyar [hu]' },
  { value: 'ml', name: 'Malayalam [ml]' },
  { value: 'ar', name: 'العربية [ar]' },
  { value: 'sk', name: 'Slovenčina [sk]' },
  { value: 'no', name: 'Norsk [no]' },
  { value: 'pl', name: 'Polski [pl]' },
  { value: 'tl', name: 'Tagalog [tl]' },
  { value: 'hi', name: 'हिन्दी [hi]' },
  { value: 'bn', name: 'বাংলা [bn]' },
  { value: 'he', name: 'עִבְרִית [he]' },
];

