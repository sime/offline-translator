import { getModelFiles, getTranslationPairs, getModelFileList, getDownloadUrl } from './models.js';
import { hasFile, getFile, hasAllFiles, downloadAndCache, deleteFile } from './storage.js';

class Translator {
  constructor() {
    this.worker = null;
    this.messageId = 1;
    this.pending = new Map();
    this.ready = false;
    this.onStatus = null;
  }

  async init() {
    this._setStatus('Loading translation engine...');
    this.worker = new Worker('translator-worker.js');
    this.worker.onmessage = (e) => this._handleMessage(e);
    await this._call('initialize', { cacheSize: 20 });
    this.ready = true;
    this._setStatus('Ready');
  }

  async isLanguagePairReady(from, to) {
    const pairs = getTranslationPairs(from, to);
    for (const pair of pairs) {
      const files = getModelFileList(pair.from, pair.to);
      if (!(await hasAllFiles(files))) return false;
    }
    return true;
  }

  async loadModelsForPair(from, to) {
    const pairs = getTranslationPairs(from, to);
    for (const pair of pairs) {
      await this._loadModelPair(pair.from, pair.to);
    }
  }

  async _loadModelPair(from, to) {
    const loaded = await this._call('hasTranslationModel', { from, to });
    if (loaded) return;

    this._setStatus(`Loading ${from}-${to} model...`);
    const files = getModelFiles(from, to);
    if (!files) throw new Error(`No model files for ${from}->${to}`);

    const [modelData, srcVocabData, tgtVocabData, lexData] = await Promise.all([
      getFile(files.model),
      getFile(files.srcVocab),
      getFile(files.tgtVocab),
      getFile(files.lex),
    ]);

    if (!modelData || !srcVocabData || !tgtVocabData || !lexData) {
      throw new Error(`Missing cached model files for ${from}->${to}`);
    }

    // The package's loadTranslationModel expects: {from, to}, {model, shortlist, vocabs}
    await this._call('loadTranslationModel',
      { from, to },
      {
        model: modelData,
        shortlist: lexData,
        vocabs: [srcVocabData, tgtVocabData],
      }
    );

    this._setStatus('Ready');
  }

  async translate(from, to, text) {
    if (from === to) return text;
    if (!text.trim()) return '';

    await this.loadModelsForPair(from, to);
    this._setStatus('Translating...');

    const pairs = getTranslationPairs(from, to);
    const models = pairs.map(p => ({ from: p.from, to: p.to }));
    const texts = [{ text, html: false }];

    const result = await this._call('translate', { models, texts });
    this._setStatus('Ready');
    return result[0].target.text;
  }

  async downloadLanguage(langCode, onProgress) {
    const directions = [
      { from: langCode, to: 'en' },
      { from: 'en', to: langCode },
    ];

    const allDownloads = [];
    for (const dir of directions) {
      const files = getModelFiles(dir.from, dir.to);
      if (!files) continue;
      const fileList = getModelFileList(dir.from, dir.to);
      for (const filename of fileList) {
        if (await hasFile(filename)) continue;
        const url = getDownloadUrl(dir.from, dir.to, filename);
        allDownloads.push({ url, filename });
      }
    }

    if (allDownloads.length === 0) return;

    let completed = 0;
    const total = allDownloads.length;

    for (const { url, filename } of allDownloads) {
      await downloadAndCache(url, filename, (received, fileTotal) => {
        if (onProgress) {
          onProgress({
            file: filename,
            fileReceived: received,
            fileTotal,
            filesCompleted: completed,
            filesTotal: total,
          });
        }
      });
      completed++;
      if (onProgress) {
        onProgress({
          file: filename,
          fileReceived: 0,
          fileTotal: 0,
          filesCompleted: completed,
          filesTotal: total,
        });
      }
    }
  }

  async deleteLanguage(langCode) {
    const directions = [
      { from: langCode, to: 'en' },
      { from: 'en', to: langCode },
    ];

    for (const dir of directions) {
      // Free model from worker memory if loaded
      try {
        await this._call('freeTranslationModel', { from: dir.from, to: dir.to });
      } catch (e) {
        // Model might not be loaded, that's fine
      }
      const fileList = getModelFileList(dir.from, dir.to);
      for (const filename of fileList) {
        await deleteFile(filename);
      }
    }
  }

  // The package's worker expects messages as {id, name, args}
  // where args is an array of positional arguments to the method.
  _call(name, ...args) {
    return new Promise((resolve, reject) => {
      const id = this.messageId++;
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage({ id, name, args });
    });
  }

  _handleMessage(e) {
    const { id, result, error } = e.data;
    const handler = this.pending.get(id);
    if (!handler) return;
    this.pending.delete(id);

    if (error) {
      handler.reject(new Error(error.message || error));
    } else {
      handler.resolve(result);
    }
  }

  _setStatus(status) {
    if (this.onStatus) this.onStatus(status);
  }
}

export { Translator };
