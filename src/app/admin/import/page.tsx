'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { formatBDT } from '@/lib/constants';

interface RawRow {
  product_name?: string;
  variant_sku?: string;
  size?: string;
  pack_count?: number | string;
  price?: number | string;
  regular_price?: number | string;
  stock_quantity?: number | string;
  brand_name?: string;
  category_name?: string;
  description?: string;
  image_url?: string;
  [key: string]: unknown;
}

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<RawRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    totalProcessed: number;
    created: number;
    updated: number;
    failed: number;
    validationErrors: Array<{ rowNumber: number; sku?: string; errors: string[] }>;
  } | null>(null);

  const [parseError, setParseError] = useState('');

  // Generate downloadable sample CSV template
  const downloadSampleTemplate = () => {
    const sampleHeaders = [
      'product_name',
      'variant_sku',
      'size',
      'pack_count',
      'price',
      'regular_price',
      'stock_quantity',
      'brand_name',
      'category_name',
      'description',
      'image_url',
    ];

    const sampleRows = [
      [
        'Twinkle Baby Diaper Pant',
        'TWK-PANT-S42',
        'S',
        '42',
        '510',
        '540',
        '50',
        'Twinkle',
        'Diaper Pants',
        'Super absorbent breathable diaper pants',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
      ],
      [
        'Twinkle Baby Diaper Pant',
        'TWK-PANT-M40',
        'M',
        '40',
        '530',
        '560',
        '80',
        'Twinkle',
        'Diaper Pants',
        'Super absorbent breathable diaper pants',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
      ],
      [
        'Twinkle Baby Diaper Pant',
        'TWK-PANT-L34',
        'L',
        '34',
        '550',
        '580',
        '60',
        'Twinkle',
        'Diaper Pants',
        'Super absorbent breathable diaper pants',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
      ],
    ];

    const csvContent = [
      sampleHeaders.join(','),
      ...sampleRows.map((row) => row.map((val) => `"${val}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'lashker_diaper_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setParseError('');
    setImportResult(null);
    setIsParsing(true);

    const fileName = selected.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      Papa.parse(selected, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          setParsedRows(results.data as RawRow[]);
          setIsParsing(false);
        },
        error: (err) => {
          setParseError(`CSV Parse Error: ${err.message}`);
          setIsParsing(false);
        },
      });
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json<RawRow>(firstSheet);
          setParsedRows(json);
        } catch (err: unknown) {
          setParseError(`Excel Parse Error: ${err instanceof Error ? err.message : 'Invalid workbook'}`);
        } finally {
          setIsParsing(false);
        }
      };
      reader.readAsBinaryString(selected);
    } else {
      setParseError('Unsupported file type. Please upload a .csv or .xlsx file.');
      setIsParsing(false);
    }
  };

  const handleCommitImport = async () => {
    if (parsedRows.length === 0) return;

    setIsImporting(true);
    setParseError('');

    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsedRows }),
      });

      const data = await res.json();
      if (!res.ok && !data.validationErrors) {
        setParseError(data.error || 'Import batch execution failed');
      } else {
        setImportResult(data);
      }
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : 'Error committing import');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Product & Variant Import Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bulk upload diaper sizes, pack counts, pricing, and stock via validated CSV or XLSX files
          </p>
        </div>

        <button
          type="button"
          onClick={downloadSampleTemplate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors w-fit"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center space-y-4 hover:border-sky-400 transition-colors">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
          <Upload className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800">
            {file ? file.name : 'Drag and drop your CSV or Excel file here'}
          </p>
          <p className="text-xs text-slate-400">
            Supports CSV, XLSX up to 10 MB. Strict schema validation protects catalog integrity.
          </p>
        </div>

        <label className="inline-block cursor-pointer">
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileUpload}
            className="hidden"
          />
          <span className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors">
            Choose File to Upload
          </span>
        </label>
      </div>

      {parseError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      {/* Import Result Stats */}
      {importResult && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs animate-in fade-in">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Import Execution Summary</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Total Rows</span>
              <p className="text-lg font-extrabold text-slate-900">{importResult.totalProcessed}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-emerald-700 font-medium">New Created</span>
              <p className="text-lg font-extrabold text-emerald-700">{importResult.created}</p>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
              <span className="text-[11px] text-sky-700 font-medium">Updated Stock/Price</span>
              <p className="text-lg font-extrabold text-sky-700">{importResult.updated}</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-[11px] text-rose-700 font-medium">Failed Rows</span>
              <p className="text-lg font-extrabold text-rose-700">{importResult.failed}</p>
            </div>
          </div>

          {/* Row Errors Breakdown */}
          {importResult.validationErrors.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-rose-800">
                Row-Level Validation Errors ({importResult.validationErrors.length}):
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-1.5 text-[11px] border border-rose-200 rounded-xl p-3 bg-rose-50/50">
                {importResult.validationErrors.map((err, i) => (
                  <div key={i} className="text-rose-700 flex items-start gap-2">
                    <span className="font-mono font-bold shrink-0">Row {err.rowNumber}:</span>
                    <span>{err.errors.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Table */}
      {parsedRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                File Preview ({parsedRows.length} rows loaded)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review mapped fields before confirming database commit
              </p>
            </div>

            <button
              type="button"
              disabled={isImporting}
              onClick={handleCommitImport}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isImporting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Bounded Batches...</span>
                </>
              ) : (
                <>
                  <span>Commit Import to Database</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Pack (Pcs)</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Stock</th>
                  <th className="py-2.5 px-3">Brand</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.slice(0, 15).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {row.product_name || 'N/A'}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                      {row.variant_sku || 'N/A'}
                    </td>
                    <td className="py-2 px-3 font-bold text-sky-700">
                      {row.size || 'N/A'}
                    </td>
                    <td className="py-2 px-3">{row.pack_count || 'N/A'}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">
                      {row.price ? `৳${row.price}` : 'N/A'}
                    </td>
                    <td className="py-2 px-3">{row.stock_quantity ?? '0'}</td>
                    <td className="py-2 px-3 text-slate-500">{row.brand_name || 'Twinkle'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {parsedRows.length > 15 && (
            <p className="text-[11px] text-slate-400 text-center pt-2">
              Showing preview of first 15 rows of {parsedRows.length} total rows.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
