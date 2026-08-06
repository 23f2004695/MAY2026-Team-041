import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export function downloadPdf(
  filename: string,
  title: string,
  headers: string[],
  rows: ExportCell[][],
  summaryLines: string[] = [],
): void {
  const doc = new jsPDF();
  doc.text(title, 14, 16);

  let startY = 22;
  if (summaryLines.length > 0) {
    doc.setFontSize(10);
    summaryLines.forEach((line, i) => {
      doc.text(line, 14, startY + i * 5);
    });
    doc.setFontSize(12);
    startY += summaryLines.length * 5 + 4;
  }

  autoTable(doc, {
    head: [headers],
    body: rows.map((row) => row.map(String)),
    startY,
  });
  doc.save(filename);
}
