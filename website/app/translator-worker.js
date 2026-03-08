// This worker imports the bergamot package's own worker wrapper and delegates to it.
// The package's translator-worker.js provides BergamotTranslatorWorker with proper
// WASM init, AlignedMemory handling, and translation methods.

const BERGAMOT_VERSION = '0.4.9';
const BERGAMOT_BASE = `https://cdn.jsdelivr.net/npm/@browsermt/bergamot-translator@${BERGAMOT_VERSION}/worker`;

// Override importScripts resolution for the package's relative imports.
// The package's translator-worker.js calls importScripts('bergamot-translator-worker.js')
// with a relative path, which we need to resolve to the CDN.
const _origImportScripts = self.importScripts.bind(self);
self.importScripts = function(...scripts) {
  const resolved = scripts.map(s => {
    if (s === 'bergamot-translator-worker.js') {
      return `${BERGAMOT_BASE}/bergamot-translator-worker.js`;
    }
    return s;
  });
  return _origImportScripts(...resolved);
};

// Override fetch for .wasm resolution - the package uses:
//   self.fetch(new URL('./bergamot-translator-worker.wasm', self.location))
// We need this to resolve to the CDN instead.
const _origFetch = self.fetch.bind(self);
self.fetch = function(input, init) {
  if (input instanceof URL && input.pathname.endsWith('bergamot-translator-worker.wasm')) {
    return _origFetch(`${BERGAMOT_BASE}/bergamot-translator-worker.wasm`, init);
  }
  return _origFetch(input, init);
};

// Now import the package's translator-worker.js which sets up everything:
// - BergamotTranslatorWorker class
// - Message handler listening for {id, name, args} messages
_origImportScripts(`${BERGAMOT_BASE}/translator-worker.js`);
