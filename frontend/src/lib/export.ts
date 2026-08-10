export type ExportCell = string | number;

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsvField(field: ExportCell): string {
  const value = String(field);
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: ExportCell[][],
  summaryLines: string[] = [],
): void {
  const dataLines = [headers, ...rows].map((row) => row.map(escapeCsvField).join(','));
  const lines = summaryLines.length > 0 ? [...summaryLines, '', ...dataLines] : dataLines;
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

// ponytail: jspdf + jspdf-autotable are ~400kb and only needed once someone actually
// clicks "export PDF" — loaded on demand so they stay out of the initial bundle.
export async function downloadPdf(
  filename: string,
  title: string,
  headers: string[],
  rows: ExportCell[][],
  summaryLines: string[] = [],
): Promise<void> {
  const [jsPDFModule, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default || (jsPDFModule as any);
  const autoTable =
    typeof autoTableModule.default === 'function'
      ? autoTableModule.default
      : typeof (autoTableModule as any).autoTable === 'function'
      ? (autoTableModule as any).autoTable
      : typeof autoTableModule === 'function'
      ? autoTableModule
      : null;

  const doc = new jsPDF();
  doc.text(String(title || ''), 14, 16);

  let startY = 22;
  if (summaryLines && summaryLines.length > 0) {
    doc.setFontSize(10);
    summaryLines.forEach((line, i) => {
      doc.text(String(line ?? ''), 14, startY + i * 5);
    });
    doc.setFontSize(12);
    startY += summaryLines.length * 5 + 4;
  }

  const safeRows = (rows || []).map((row) =>
    (row || []).map((cell) => (cell == null ? '' : String(cell))),
  );

  if (typeof autoTable === 'function') {
    autoTable(doc, {
      head: [headers || []],
      body: safeRows,
      startY,
    });
  } else if (typeof (doc as any).autoTable === 'function') {
    (doc as any).autoTable({
      head: [headers || []],
      body: safeRows,
      startY,
    });
  }

  doc.save(filename);
}