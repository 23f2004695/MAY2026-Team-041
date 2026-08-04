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
): void {
  const lines = [headers, ...rows].map((row) => row.map(escapeCsvField).join(','));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

export function downloadPdf(
  filename: string,
  title: string,
  headers: string[],
  rows: ExportCell[][],
): void {
  const doc = new jsPDF();
  doc.text(title, 14, 16);
  autoTable(doc, {
    head: [headers],
    body: rows.map((row) => row.map(String)),
    startY: 22,
  });
  doc.save(filename);
}
