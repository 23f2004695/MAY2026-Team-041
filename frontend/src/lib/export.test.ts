import { beforeEach, describe, expect, it, vi } from 'vitest';

import { downloadCsv } from './export';

// jsdom's Blob doesn't implement .text(), so read it back via FileReader instead.
function readBlobAsText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

interface Captured {
  blob: Blob | null;
  filename: string | null;
  getBlob: () => Blob;
}

function captureDownloadedBlob(): Captured {
  const result: Captured = {
    blob: null,
    filename: null,
    getBlob() {
      if (this.blob === null) throw new Error('No blob was captured');
      return this.blob;
    },
  };

  vi.spyOn(URL, 'createObjectURL').mockImplementation((obj: Blob | MediaSource) => {
    result.blob = obj as Blob;
    return 'blob:mock';
  });
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);

  const anchor = document.createElement('a');
  vi.spyOn(anchor, 'click').mockImplementation(() => undefined);
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'a') {
      Object.defineProperty(anchor, 'download', {
        get() {
          return result.filename ?? '';
        },
        set(value: string) {
          result.filename = value;
        },
      });
      return anchor;
    }
    return document.createElement(tag);
  });

  return result;
}

describe('downloadCsv', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('joins headers and rows with commas and newlines', async () => {
    const captured = captureDownloadedBlob();

    downloadCsv('payments.csv', ['Label', 'Amount'], [['Membership', 499]]);

    expect(captured.filename).toBe('payments.csv');
    const text = await readBlobAsText(captured.getBlob());
    expect(text).toBe('Label,Amount\nMembership,499');
  });

  it('escapes fields containing commas, quotes, or newlines', async () => {
    const captured = captureDownloadedBlob();

    downloadCsv('payments.csv', ['Label'], [['Say "hi", friend\nagain']]);

    const text = await readBlobAsText(captured.getBlob());
    expect(text).toBe('Label\n"Say ""hi"", friend\nagain"');
  });
});
