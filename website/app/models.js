const BASE_URL =
  'https://media.githubusercontent.com/media/mozilla/firefox-translations-models/6ffda9ba34d107a8b50ec766273b252ef92ebafc/models';

const LANGUAGES = [
  { code: 'sq', name: 'Albanian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'et', name: 'Estonian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ko', name: 'Korean' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'es', name: 'Spanish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
];

// fromEnglishFiles: en -> lang
const FROM_ENGLISH = {
  ar: { quality: 'base-memory', model: 'model.enar.intgemm.alphas.bin', srcVocab: 'vocab.enar.spm', tgtVocab: 'vocab.enar.spm', lex: 'lex.50.50.enar.s2t.bin' },
  az: { quality: 'tiny', model: 'model.enaz.intgemm.alphas.bin', srcVocab: 'vocab.enaz.spm', tgtVocab: 'vocab.enaz.spm', lex: 'lex.50.50.enaz.s2t.bin' },
  bg: { quality: 'base-memory', model: 'model.enbg.intgemm.alphas.bin', srcVocab: 'vocab.enbg.spm', tgtVocab: 'vocab.enbg.spm', lex: 'lex.50.50.enbg.s2t.bin' },
  bn: { quality: 'tiny', model: 'model.enbn.intgemm.alphas.bin', srcVocab: 'vocab.enbn.spm', tgtVocab: 'vocab.enbn.spm', lex: 'lex.50.50.enbn.s2t.bin' },
  ca: { quality: 'base-memory', model: 'model.enca.intgemm.alphas.bin', srcVocab: 'vocab.enca.spm', tgtVocab: 'vocab.enca.spm', lex: 'lex.50.50.enca.s2t.bin' },
  cs: { quality: 'base-memory', model: 'model.encs.intgemm.alphas.bin', srcVocab: 'vocab.encs.spm', tgtVocab: 'vocab.encs.spm', lex: 'lex.50.50.encs.s2t.bin' },
  da: { quality: 'tiny', model: 'model.enda.intgemm.alphas.bin', srcVocab: 'vocab.enda.spm', tgtVocab: 'vocab.enda.spm', lex: 'lex.50.50.enda.s2t.bin' },
  de: { quality: 'base-memory', model: 'model.ende.intgemm.alphas.bin', srcVocab: 'vocab.ende.spm', tgtVocab: 'vocab.ende.spm', lex: 'lex.50.50.ende.s2t.bin' },
  el: { quality: 'tiny', model: 'model.enel.intgemm.alphas.bin', srcVocab: 'vocab.enel.spm', tgtVocab: 'vocab.enel.spm', lex: 'lex.50.50.enel.s2t.bin' },
  es: { quality: 'base-memory', model: 'model.enes.intgemm.alphas.bin', srcVocab: 'vocab.enes.spm', tgtVocab: 'vocab.enes.spm', lex: 'lex.50.50.enes.s2t.bin' },
  et: { quality: 'base-memory', model: 'model.enet.intgemm.alphas.bin', srcVocab: 'vocab.enet.spm', tgtVocab: 'vocab.enet.spm', lex: 'lex.50.50.enet.s2t.bin' },
  fa: { quality: 'tiny', model: 'model.enfa.intgemm.alphas.bin', srcVocab: 'vocab.enfa.spm', tgtVocab: 'vocab.enfa.spm', lex: 'lex.50.50.enfa.s2t.bin' },
  fi: { quality: 'base-memory', model: 'model.enfi.intgemm.alphas.bin', srcVocab: 'vocab.enfi.spm', tgtVocab: 'vocab.enfi.spm', lex: 'lex.50.50.enfi.s2t.bin' },
  fr: { quality: 'base-memory', model: 'model.enfr.intgemm.alphas.bin', srcVocab: 'vocab.enfr.spm', tgtVocab: 'vocab.enfr.spm', lex: 'lex.50.50.enfr.s2t.bin' },
  gu: { quality: 'tiny', model: 'model.engu.intgemm.alphas.bin', srcVocab: 'vocab.engu.spm', tgtVocab: 'vocab.engu.spm', lex: 'lex.50.50.engu.s2t.bin' },
  he: { quality: 'tiny', model: 'model.enhe.intgemm.alphas.bin', srcVocab: 'vocab.enhe.spm', tgtVocab: 'vocab.enhe.spm', lex: 'lex.50.50.enhe.s2t.bin' },
  hi: { quality: 'tiny', model: 'model.enhi.intgemm.alphas.bin', srcVocab: 'vocab.enhi.spm', tgtVocab: 'vocab.enhi.spm', lex: 'lex.50.50.enhi.s2t.bin' },
  hr: { quality: 'tiny', model: 'model.enhr.intgemm.alphas.bin', srcVocab: 'vocab.enhr.spm', tgtVocab: 'vocab.enhr.spm', lex: 'lex.50.50.enhr.s2t.bin' },
  hu: { quality: 'base-memory', model: 'model.enhu.intgemm.alphas.bin', srcVocab: 'vocab.enhu.spm', tgtVocab: 'vocab.enhu.spm', lex: 'lex.50.50.enhu.s2t.bin' },
  id: { quality: 'tiny', model: 'model.enid.intgemm.alphas.bin', srcVocab: 'vocab.enid.spm', tgtVocab: 'vocab.enid.spm', lex: 'lex.50.50.enid.s2t.bin' },
  is: { quality: 'base-memory', model: 'model.enis.intgemm.alphas.bin', srcVocab: 'vocab.enis.spm', tgtVocab: 'vocab.enis.spm', lex: 'lex.50.50.enis.s2t.bin' },
  it: { quality: 'base-memory', model: 'model.enit.intgemm.alphas.bin', srcVocab: 'vocab.enit.spm', tgtVocab: 'vocab.enit.spm', lex: 'lex.50.50.enit.s2t.bin' },
  ja: { quality: 'base-memory', model: 'model.enja.intgemm.alphas.bin', srcVocab: 'srcvocab.enja.spm', tgtVocab: 'trgvocab.enja.spm', lex: 'lex.50.50.enja.s2t.bin' },
  kn: { quality: 'tiny', model: 'model.enkn.intgemm.alphas.bin', srcVocab: 'vocab.enkn.spm', tgtVocab: 'vocab.enkn.spm', lex: 'lex.50.50.enkn.s2t.bin' },
  ko: { quality: 'base-memory', model: 'model.enko.intgemm.alphas.bin', srcVocab: 'srcvocab.enko.spm', tgtVocab: 'trgvocab.enko.spm', lex: 'lex.50.50.enko.s2t.bin' },
  lt: { quality: 'base-memory', model: 'model.enlt.intgemm.alphas.bin', srcVocab: 'vocab.enlt.spm', tgtVocab: 'vocab.enlt.spm', lex: 'lex.50.50.enlt.s2t.bin' },
  lv: { quality: 'base-memory', model: 'model.enlv.intgemm.alphas.bin', srcVocab: 'vocab.enlv.spm', tgtVocab: 'vocab.enlv.spm', lex: 'lex.50.50.enlv.s2t.bin' },
  ml: { quality: 'tiny', model: 'model.enml.intgemm.alphas.bin', srcVocab: 'vocab.enml.spm', tgtVocab: 'vocab.enml.spm', lex: 'lex.50.50.enml.s2t.bin' },
  ms: { quality: 'tiny', model: 'model.enms.intgemm.alphas.bin', srcVocab: 'vocab.enms.spm', tgtVocab: 'vocab.enms.spm', lex: 'lex.50.50.enms.s2t.bin' },
  nl: { quality: 'base-memory', model: 'model.ennl.intgemm.alphas.bin', srcVocab: 'vocab.ennl.spm', tgtVocab: 'vocab.ennl.spm', lex: 'lex.50.50.ennl.s2t.bin' },
  pl: { quality: 'base-memory', model: 'model.enpl.intgemm.alphas.bin', srcVocab: 'vocab.enpl.spm', tgtVocab: 'vocab.enpl.spm', lex: 'lex.50.50.enpl.s2t.bin' },
  pt: { quality: 'base-memory', model: 'model.enpt.intgemm.alphas.bin', srcVocab: 'vocab.enpt.spm', tgtVocab: 'vocab.enpt.spm', lex: 'lex.50.50.enpt.s2t.bin' },
  ro: { quality: 'tiny', model: 'model.enro.intgemm.alphas.bin', srcVocab: 'vocab.enro.spm', tgtVocab: 'vocab.enro.spm', lex: 'lex.50.50.enro.s2t.bin' },
  ru: { quality: 'base-memory', model: 'model.enru.intgemm.alphas.bin', srcVocab: 'vocab.enru.spm', tgtVocab: 'vocab.enru.spm', lex: 'lex.50.50.enru.s2t.bin' },
  sk: { quality: 'base-memory', model: 'model.ensk.intgemm.alphas.bin', srcVocab: 'vocab.ensk.spm', tgtVocab: 'vocab.ensk.spm', lex: 'lex.50.50.ensk.s2t.bin' },
  sl: { quality: 'base-memory', model: 'model.ensl.intgemm.alphas.bin', srcVocab: 'vocab.ensl.spm', tgtVocab: 'vocab.ensl.spm', lex: 'lex.50.50.ensl.s2t.bin' },
  sq: { quality: 'tiny', model: 'model.ensq.intgemm.alphas.bin', srcVocab: 'vocab.ensq.spm', tgtVocab: 'vocab.ensq.spm', lex: 'lex.50.50.ensq.s2t.bin' },
  sv: { quality: 'tiny', model: 'model.ensv.intgemm.alphas.bin', srcVocab: 'vocab.ensv.spm', tgtVocab: 'vocab.ensv.spm', lex: 'lex.50.50.ensv.s2t.bin' },
  ta: { quality: 'tiny', model: 'model.enta.intgemm.alphas.bin', srcVocab: 'vocab.enta.spm', tgtVocab: 'vocab.enta.spm', lex: 'lex.50.50.enta.s2t.bin' },
  te: { quality: 'tiny', model: 'model.ente.intgemm.alphas.bin', srcVocab: 'vocab.ente.spm', tgtVocab: 'vocab.ente.spm', lex: 'lex.50.50.ente.s2t.bin' },
  tr: { quality: 'tiny', model: 'model.entr.intgemm.alphas.bin', srcVocab: 'vocab.entr.spm', tgtVocab: 'vocab.entr.spm', lex: 'lex.50.50.entr.s2t.bin' },
  uk: { quality: 'base-memory', model: 'model.enuk.intgemm.alphas.bin', srcVocab: 'vocab.enuk.spm', tgtVocab: 'vocab.enuk.spm', lex: 'lex.50.50.enuk.s2t.bin' },
  zh: { quality: 'base-memory', model: 'model.enzh.intgemm.alphas.bin', srcVocab: 'srcvocab.enzh.spm', tgtVocab: 'trgvocab.enzh.spm', lex: 'lex.50.50.enzh.s2t.bin' },
};

// toEnglishFiles: lang -> en
const TO_ENGLISH = {
  ar: { quality: 'base-memory', model: 'model.aren.intgemm.alphas.bin', srcVocab: 'vocab.aren.spm', tgtVocab: 'vocab.aren.spm', lex: 'lex.50.50.aren.s2t.bin' },
  az: { quality: 'tiny', model: 'model.azen.intgemm.alphas.bin', srcVocab: 'vocab.azen.spm', tgtVocab: 'vocab.azen.spm', lex: 'lex.50.50.azen.s2t.bin' },
  bg: { quality: 'base-memory', model: 'model.bgen.intgemm.alphas.bin', srcVocab: 'vocab.bgen.spm', tgtVocab: 'vocab.bgen.spm', lex: 'lex.50.50.bgen.s2t.bin' },
  bn: { quality: 'tiny', model: 'model.bnen.intgemm.alphas.bin', srcVocab: 'vocab.bnen.spm', tgtVocab: 'vocab.bnen.spm', lex: 'lex.50.50.bnen.s2t.bin' },
  ca: { quality: 'base-memory', model: 'model.caen.intgemm.alphas.bin', srcVocab: 'vocab.caen.spm', tgtVocab: 'vocab.caen.spm', lex: 'lex.50.50.caen.s2t.bin' },
  cs: { quality: 'base-memory', model: 'model.csen.intgemm.alphas.bin', srcVocab: 'vocab.csen.spm', tgtVocab: 'vocab.csen.spm', lex: 'lex.50.50.csen.s2t.bin' },
  da: { quality: 'tiny', model: 'model.daen.intgemm.alphas.bin', srcVocab: 'vocab.daen.spm', tgtVocab: 'vocab.daen.spm', lex: 'lex.50.50.daen.s2t.bin' },
  de: { quality: 'base-memory', model: 'model.deen.intgemm.alphas.bin', srcVocab: 'vocab.deen.spm', tgtVocab: 'vocab.deen.spm', lex: 'lex.50.50.deen.s2t.bin' },
  el: { quality: 'tiny', model: 'model.elen.intgemm.alphas.bin', srcVocab: 'vocab.elen.spm', tgtVocab: 'vocab.elen.spm', lex: 'lex.50.50.elen.s2t.bin' },
  es: { quality: 'base-memory', model: 'model.esen.intgemm.alphas.bin', srcVocab: 'vocab.esen.spm', tgtVocab: 'vocab.esen.spm', lex: 'lex.50.50.esen.s2t.bin' },
  et: { quality: 'base-memory', model: 'model.eten.intgemm.alphas.bin', srcVocab: 'vocab.eten.spm', tgtVocab: 'vocab.eten.spm', lex: 'lex.50.50.eten.s2t.bin' },
  fa: { quality: 'tiny', model: 'model.faen.intgemm.alphas.bin', srcVocab: 'vocab.faen.spm', tgtVocab: 'vocab.faen.spm', lex: 'lex.50.50.faen.s2t.bin' },
  fi: { quality: 'base-memory', model: 'model.fien.intgemm.alphas.bin', srcVocab: 'vocab.fien.spm', tgtVocab: 'vocab.fien.spm', lex: 'lex.50.50.fien.s2t.bin' },
  fr: { quality: 'base-memory', model: 'model.fren.intgemm.alphas.bin', srcVocab: 'vocab.fren.spm', tgtVocab: 'vocab.fren.spm', lex: 'lex.50.50.fren.s2t.bin' },
  gu: { quality: 'tiny', model: 'model.guen.intgemm.alphas.bin', srcVocab: 'vocab.guen.spm', tgtVocab: 'vocab.guen.spm', lex: 'lex.50.50.guen.s2t.bin' },
  he: { quality: 'tiny', model: 'model.heen.intgemm.alphas.bin', srcVocab: 'vocab.heen.spm', tgtVocab: 'vocab.heen.spm', lex: 'lex.50.50.heen.s2t.bin' },
  hi: { quality: 'tiny', model: 'model.hien.intgemm.alphas.bin', srcVocab: 'vocab.hien.spm', tgtVocab: 'vocab.hien.spm', lex: 'lex.50.50.hien.s2t.bin' },
  hr: { quality: 'tiny', model: 'model.hren.intgemm.alphas.bin', srcVocab: 'vocab.hren.spm', tgtVocab: 'vocab.hren.spm', lex: 'lex.50.50.hren.s2t.bin' },
  hu: { quality: 'tiny', model: 'model.huen.intgemm.alphas.bin', srcVocab: 'vocab.huen.spm', tgtVocab: 'vocab.huen.spm', lex: 'lex.50.50.huen.s2t.bin' },
  id: { quality: 'tiny', model: 'model.iden.intgemm.alphas.bin', srcVocab: 'vocab.iden.spm', tgtVocab: 'vocab.iden.spm', lex: 'lex.50.50.iden.s2t.bin' },
  is: { quality: 'base-memory', model: 'model.isen.intgemm.alphas.bin', srcVocab: 'vocab.isen.spm', tgtVocab: 'vocab.isen.spm', lex: 'lex.50.50.isen.s2t.bin' },
  it: { quality: 'base-memory', model: 'model.iten.intgemm.alphas.bin', srcVocab: 'vocab.iten.spm', tgtVocab: 'vocab.iten.spm', lex: 'lex.50.50.iten.s2t.bin' },
  ja: { quality: 'base-memory', model: 'model.jaen.intgemm.alphas.bin', srcVocab: 'vocab.jaen.spm', tgtVocab: 'vocab.jaen.spm', lex: 'lex.50.50.jaen.s2t.bin' },
  kn: { quality: 'tiny', model: 'model.knen.intgemm.alphas.bin', srcVocab: 'vocab.knen.spm', tgtVocab: 'vocab.knen.spm', lex: 'lex.50.50.knen.s2t.bin' },
  ko: { quality: 'base-memory', model: 'model.koen.intgemm.alphas.bin', srcVocab: 'vocab.koen.spm', tgtVocab: 'vocab.koen.spm', lex: 'lex.50.50.koen.s2t.bin' },
  lt: { quality: 'tiny', model: 'model.lten.intgemm.alphas.bin', srcVocab: 'vocab.lten.spm', tgtVocab: 'vocab.lten.spm', lex: 'lex.50.50.lten.s2t.bin' },
  lv: { quality: 'tiny', model: 'model.lven.intgemm.alphas.bin', srcVocab: 'vocab.lven.spm', tgtVocab: 'vocab.lven.spm', lex: 'lex.50.50.lven.s2t.bin' },
  ml: { quality: 'tiny', model: 'model.mlen.intgemm.alphas.bin', srcVocab: 'vocab.mlen.spm', tgtVocab: 'vocab.mlen.spm', lex: 'lex.50.50.mlen.s2t.bin' },
  ms: { quality: 'tiny', model: 'model.msen.intgemm.alphas.bin', srcVocab: 'vocab.msen.spm', tgtVocab: 'vocab.msen.spm', lex: 'lex.50.50.msen.s2t.bin' },
  nl: { quality: 'base-memory', model: 'model.nlen.intgemm.alphas.bin', srcVocab: 'vocab.nlen.spm', tgtVocab: 'vocab.nlen.spm', lex: 'lex.50.50.nlen.s2t.bin' },
  pl: { quality: 'base-memory', model: 'model.plen.intgemm.alphas.bin', srcVocab: 'vocab.plen.spm', tgtVocab: 'vocab.plen.spm', lex: 'lex.50.50.plen.s2t.bin' },
  pt: { quality: 'base-memory', model: 'model.pten.intgemm.alphas.bin', srcVocab: 'vocab.pten.spm', tgtVocab: 'vocab.pten.spm', lex: 'lex.50.50.pten.s2t.bin' },
  ro: { quality: 'tiny', model: 'model.roen.intgemm.alphas.bin', srcVocab: 'vocab.roen.spm', tgtVocab: 'vocab.roen.spm', lex: 'lex.50.50.roen.s2t.bin' },
  ru: { quality: 'tiny', model: 'model.ruen.intgemm.alphas.bin', srcVocab: 'vocab.ruen.spm', tgtVocab: 'vocab.ruen.spm', lex: 'lex.50.50.ruen.s2t.bin' },
  sk: { quality: 'tiny', model: 'model.sken.intgemm.alphas.bin', srcVocab: 'vocab.sken.spm', tgtVocab: 'vocab.sken.spm', lex: 'lex.50.50.sken.s2t.bin' },
  sl: { quality: 'base-memory', model: 'model.slen.intgemm.alphas.bin', srcVocab: 'vocab.slen.spm', tgtVocab: 'vocab.slen.spm', lex: 'lex.50.50.slen.s2t.bin' },
  sq: { quality: 'tiny', model: 'model.sqen.intgemm.alphas.bin', srcVocab: 'vocab.sqen.spm', tgtVocab: 'vocab.sqen.spm', lex: 'lex.50.50.sqen.s2t.bin' },
  sv: { quality: 'tiny', model: 'model.sven.intgemm.alphas.bin', srcVocab: 'vocab.sven.spm', tgtVocab: 'vocab.sven.spm', lex: 'lex.50.50.sven.s2t.bin' },
  ta: { quality: 'tiny', model: 'model.taen.intgemm.alphas.bin', srcVocab: 'vocab.taen.spm', tgtVocab: 'vocab.taen.spm', lex: 'lex.50.50.taen.s2t.bin' },
  te: { quality: 'tiny', model: 'model.teen.intgemm.alphas.bin', srcVocab: 'vocab.teen.spm', tgtVocab: 'vocab.teen.spm', lex: 'lex.50.50.teen.s2t.bin' },
  tr: { quality: 'tiny', model: 'model.tren.intgemm.alphas.bin', srcVocab: 'vocab.tren.spm', tgtVocab: 'vocab.tren.spm', lex: 'lex.50.50.tren.s2t.bin' },
  uk: { quality: 'tiny', model: 'model.uken.intgemm.alphas.bin', srcVocab: 'vocab.uken.spm', tgtVocab: 'vocab.uken.spm', lex: 'lex.50.50.uken.s2t.bin' },
  zh: { quality: 'base-memory', model: 'model.zhen.intgemm.alphas.bin', srcVocab: 'vocab.zhen.spm', tgtVocab: 'vocab.zhen.spm', lex: 'lex.50.50.zhen.s2t.bin' },
};

function getLanguageName(code) {
  const lang = LANGUAGES.find(l => l.code === code);
  return lang ? lang.name : code;
}

function getModelFiles(from, to) {
  if (from === 'en') return FROM_ENGLISH[to];
  if (to === 'en') return TO_ENGLISH[from];
  return null;
}

function getTranslationPairs(from, to) {
  if (from === to) return [];
  if (from === 'en') return [{ from: 'en', to }];
  if (to === 'en') return [{ from, to: 'en' }];
  return [{ from, to: 'en' }, { from: 'en', to }];
}

function getModelFileList(from, to) {
  const files = getModelFiles(from, to);
  if (!files) return [];
  const unique = new Set([files.model, files.srcVocab, files.tgtVocab, files.lex]);
  return [...unique];
}

function getDownloadUrl(from, to, filename) {
  const files = getModelFiles(from, to);
  if (!files) return null;
  return `${BASE_URL}/${files.quality}/${from}${to}/${filename}.gz`;
}

function getRequiredLanguages(from, to) {
  if (from === to) return [];
  if (from === 'en') return [to];
  if (to === 'en') return [from];
  return [from, to];
}

export { LANGUAGES, FROM_ENGLISH, TO_ENGLISH, BASE_URL, getLanguageName, getModelFiles, getTranslationPairs, getModelFileList, getDownloadUrl, getRequiredLanguages };
